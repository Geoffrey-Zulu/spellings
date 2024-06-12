// /client/src/pages/LandingPage.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto flex flex-col items-center justify-center text-center p-4">
        <img src="/assets/images/logo.png" alt="Logo" className="mb-8" />
        <h2 className="text-4xl font-bold mb-4">Get 6 chances to guess a 5-letter word.</h2>
        <p className="text-gray-700 mb-8">Test your skills with our daily word challenge!</p>
        <div className="flex space-x-4">
          <button className="bg-black text-white py-2 px-4 rounded">Log in</button>
          <button className="bg-white text-black border border-black py-2 px-4 rounded">Play</button>
        </div>
        <p className="mt-8 text-gray-500">June 12, 2024 • No. 1089 • Edited by Tracy Bennett</p>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
