// src/app/page.tsx
import Head from 'next/head';
import IntervalWorkout from './component/IntervalWorkout';

const Home = () => {
  return (
    <>
      <Head>
        <title>Car Inspection</title>
        <meta name="description" content="Car Inspection Records" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-2 bg-white rounded-lg shadow-lg">
          <IntervalWorkout />
        </div>
      </main>
    </>
  );
};

export default Home;
