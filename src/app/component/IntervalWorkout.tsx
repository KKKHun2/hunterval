'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FiSettings } from 'react-icons/fi';

interface Interval {
  type: '느리게 걷기' | '빠르게 걷기' | '달리기';
  duration: number;
  speed: string;
}

const defaultIntervals: Interval[] = [
  { type: '느리게 걷기', duration: 180, speed: '3~5' },
  { type: '빠르게 걷기', duration: 120, speed: '5~6' },
  { type: '달리기', duration: 120, speed: '9~11' },
];

const formatTime = (seconds: number): string => {
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
};

const IntervalWorkout = () => {
  const [intervals, setIntervals] = useState<Interval[]>(defaultIntervals);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [routineCount, setRoutineCount] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const [slowCount, setSlowCount] = useState(0);
  const [fastCount, setFastCount] = useState(0);
  const [runCount, setRunCount] = useState(0);

  const completedSteps = useRef<Set<number>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = useCallback(() => {
    if (!isStarted) {
      setIsStarted(true);
      if (currentIndex === -1) {
        setCurrentIndex(0);
        setTimeLeft(intervals[0].duration);
      }
    } else {
      setIsStarted(false);
    }
  }, [isStarted, currentIndex, intervals]);

  const handleChangeDuration = useCallback((idx: number, newDuration: number) => {
    setIntervals(prev => {
      const copy = [...prev];
      copy[idx].duration = newDuration;
      return copy;
    });
  }, []);

  const handleReset = useCallback(() => {
    setIntervals(defaultIntervals.map(i => ({ ...i })));
  }, [intervals]);

  const progressPercent = useMemo(
    () => currentIndex >= 0 ? ((intervals[currentIndex].duration - timeLeft) / intervals[currentIndex].duration) * 100 : 0,
    [currentIndex, timeLeft, intervals]
  );

  useEffect(() => {
    if (isStarted && currentIndex >= 0 && currentIndex < intervals.length) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);

            if (!completedSteps.current.has(currentIndex)) {
              completedSteps.current.add(currentIndex);
              const type = intervals[currentIndex].type;
              if (type === '느리게 걷기') setSlowCount(prev => prev + 1);
              else if (type === '빠르게 걷기') setFastCount(prev => prev + 1);
              else if (type === '달리기') setRunCount(prev => prev + 1);
            }

            if (currentIndex + 1 < intervals.length) {
              const nextIndex = currentIndex + 1;
              setCurrentIndex(nextIndex);
              setTimeLeft(intervals[nextIndex].duration);
            } else {
              if (completedSteps.current.size === intervals.length) {
                setRoutineCount(prev => prev + 1);
              }
              completedSteps.current.clear();
              setIsStarted(false);
              setCurrentIndex(-1);
            }

            return 0;
          }
          return prev - 1;
        });
        setTotalTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, isStarted, intervals]);

  return (
    <div className="min-h-screen flex flex-col justify-between items-center font-sans p-6 bg-gray-50">
      <div className="w-full flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2">운동 {isStarted ? '진행 중' : '시작하기'}</h2>
        <button
          onClick={handleStart}
          className={`${
            isStarted ? 'w-full max-w-[30%] bg-red-500 hover:bg-red-600' : 'w-full max-w-[30%] bg-blue-500 hover:bg-blue-600'
          } text-white px-6 py-2 rounded transition mb-6`}
        >
          {isStarted ? 'Stop' : 'Start'}
        </button>

        {isStarted && currentIndex >= 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-1">현재 운동: {intervals[currentIndex].type}</h3>
            <div className="text-2xl font-bold text-red-500">남은 시간: {formatTime(timeLeft)}</div>
            <div className="w-full max-w-md h-3 bg-gray-200 rounded-full mx-auto mt-3">
              <div className="h-3 bg-green-500 rounded-full transition-all duration-500 ease-linear" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-6 mb-6">
          {intervals.map((interval, idx) => {
            const isActive = currentIndex === idx;
            const isCompleted = currentIndex > idx || (!isStarted && currentIndex === -1);
            return (
              <div
                key={idx}
                className={`relative w-28 h-28 rounded-lg border-4 flex flex-col items-center justify-center transition-all duration-300 shadow-md ${
                  isActive ? 'border-blue-500 bg-blue-50' : isCompleted ? 'border-gray-400 bg-gray-100' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-sm font-semibold whitespace-pre-line leading-tight text-center">{interval.type}</div>
                <div className="text-xs text-gray-500">{interval.speed} km/h</div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-6 mb-4">
          {intervals.map((interval, idx) => (
            <div key={idx} className="w-28 rounded-lg p-3 bg-white shadow flex flex-col items-center">
              <label className="flex items-center gap-1 text-xs">
                <FiSettings className="w-4 h-4" />
                <input
                  type="number"
                  value={interval.duration}
                  min={10}
                  className="w-14 px-1 border border-gray-300 rounded text-center text-xs"
                  onChange={e => handleChangeDuration(idx, Number(e.target.value))}
                />
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="mb-10 px-4 py-2 w-full bg-gray-200 hover:bg-gray-300 text-sm rounded"
        >
          리셋
        </button>

        <div className="flex justify-center gap-6 mb-10">
          <div className="w-28 rounded-lg p-3 bg-white shadow text-sm text-center">🧍 느리게 걷기<br />{slowCount}회</div>
          <div className="w-28 rounded-lg p-3 bg-white shadow text-sm text-center">🚶 빠르게 걷기<br />{fastCount}회</div>
          <div className="w-28 rounded-lg p-3 bg-white shadow text-sm text-center">🏃 달리기<br />{runCount}회</div>
        </div>
      </div>

      <div className="border-2 border-gray-800 py-3 w-72 text-lg font-medium rounded-lg text-center bg-white shadow">
        <div className="text-center text-sm text-gray-700 mb-2">루틴 완료 횟수: <span className="font-semibold">{routineCount}</span>회</div>
        전체 운동 시간: {formatTime(totalTime)}
      </div>
    </div>
  );
};

export default IntervalWorkout;
