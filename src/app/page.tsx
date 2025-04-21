// src/app/page.tsx
import Head from 'next/head';
import IntervalWorkout from './component/IntervalWorkout';

const Home = () => {
  return (
    <div className='flex w-full h-full bg-red-500'>
      <Head>
        <title>Car Inspection</title>
        <meta name="description" content="Car Inspection Records" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <IntervalWorkout />
        </div>
      </main>
    </div>
  );
};

export default Home;
