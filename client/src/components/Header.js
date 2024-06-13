// /client/src/components/Header.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'; // Use solid style for clarity

const Header = () => {
  return (
    <header className="bg-white py-4 px-6 border-b border-black flex justify-between items-center">
      <h1 className="text-4xl font-serif font-bold tracking-tighter text-black mx-auto">
        Adess Spellings
      </h1>
      <button
        className="text-black hover:text-gray-700 focus:outline-none focus:ring-0 active:bg-transparent"
        aria-label="How to Play"
        onClick={() => alert('How to play modal content will go here.')}
      >
        <FontAwesomeIcon icon={faCircleQuestion} size="2x"/>
      </button>
    </header>
  );
};

export default Header;
