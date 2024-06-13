// /client/src/components/Game.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import audioWave from '../assets/images/audio-wave.gif';
import audioStop from '../assets/images/audio-stop.png';

const Game = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [isPlaying, setIsPlaying] = useState([false, false, false]); // Independent play states
  const maxWordLength = 10;

  const handleKeyClick = (letter) => {
    if (currentWord.length < maxWordLength) {
      setCurrentWord(currentWord + letter);
    }
  };

  const handleBackspace = () => {
    setCurrentWord(currentWord.slice(0, -1));
  };

  const handlePlayClick = (index) => {
    setIsPlaying((prev) => prev.map((state, i) => i === index ? !state : false));
  };

  return (
    <div className="flex flex-col items-center py-10 space-y-8">
      {/* Audio Waveform Animation */}
      <div className="flex space-x-4">
        <img src={isPlaying.some((state) => state) ? audioWave : audioStop} alt="Audio Status" className="w-10 h-10" />
      </div>

      {/* Labels with Play Icons */}
      <div className="space-y-4 text-center">
        {['Word', 'Definition', 'Example'].map((label, index) => (
          <p key={index} className="text-xl font-semibold flex items-center justify-center">
            <button
              className="mr-2 text-2xl cursor-pointer transform transition-transform hover:scale-110 focus:outline-none"
              onClick={() => handlePlayClick(index)}
            >
              <FontAwesomeIcon icon={isPlaying[index] ? faStopCircle : faPlayCircle} />
            </button>
            {label}: <span className="font-light ml-2">{`${label} goes here`}</span>
          </p>
        ))}
      </div>

{/* Dynamic Input Boxes */}
<div className="flex space-x-2"> 
  {[...Array(maxWordLength)].map((_, index) => (
    <div
      key={index}
      className={`w-12 h-12 border-2 border-gray-300 flex items-center justify-center text-2xl font-semibold rounded shadow-md ${
        index === 0 ? "" : (index < currentWord.length ? "" : "invisible") 
      }`}
    >
      {currentWord[index] || ''}
    </div>
  ))}
</div>





{/* Custom Keyboard */}
<div className="mt-8 space-y-2">
  {/* First Row */}
  <div className="grid grid-cols-10 gap-2">
    {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((letter) => (
      <button
        key={letter}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow-md focus:outline-none" 
        onClick={() => handleKeyClick(letter)}
      >
        {letter}
      </button>
    ))}
  </div>

  {/* Second Row */}
  <div className="grid grid-cols-10 gap-2">
    <div className="col-start-2 col-span-8 grid grid-cols-9 gap-2"> {/* Center alignment */}
      {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((letter) => (
        <button
          key={letter}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow-md focus:outline-none"
          onClick={() => handleKeyClick(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  </div>

  {/* Third Row */}
  <div className="grid grid-cols-10 gap-2"> 
    <button
      className="col-span-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow-md focus:outline-none"
      onClick={handleBackspace}
    >
      ⌫
    </button>
    <div className="col-start-3 col-span-6 grid grid-cols-7 gap-2"> {/* Center alignment */}
      {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((letter) => (
        <button
          key={letter}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow-md focus:outline-none"
          onClick={() => handleKeyClick(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
    <button
      className="col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md focus:outline-none"
      onClick={() => alert('Enter pressed')}
    >
      Enter
    </button>
  </div>
</div>


    </div>
  );
};

export default Game;
