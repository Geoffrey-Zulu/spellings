import React from 'react';
import Header from '../components/Header';
import Game from '../components/Game';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Game />
      </main>
    </div>
  );
};

export default HomePage;
