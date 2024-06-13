import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bgGray p-4 md:px-8 md:py-16 space-y-8">
      <h1 className="text-4xl md:text-7xl font-serif font-bold text-black mb-6 tracking-wide">
        ADESS SPELLINGS
      </h1>
      <h2 className="text-2xl md:text-3xl font-sans font-bold text-black mb-4">Hi Amigos</h2>
      <p className="text-lg md:text-xl font-sans text-black mb-8 text-center">
        Excited to have you on board, click play and let’s get started
      </p>
      <p className="text-lg md:text-2xl font-serif text-black mb-8">
        12th June, 2024 • Spelling No: 40
      </p>
      <button
        onClick={() => navigate('/home')}
        className="button-1 bg-primary text-white py-2 px-6 md:py-3 md:px-8 rounded-lg text-lg md:text-2xl font-grover shadow-lg hover:bg-primary-dark"
      >
        Play
      </button>
    </div>
  );
};

export default LandingPage;
