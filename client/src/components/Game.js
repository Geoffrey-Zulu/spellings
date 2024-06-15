import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import audioWave from '../assets/images/audio-wave.gif';
import audioStop from '../assets/images/audio-stop.png';
import axios from 'axios';
import './Game.css';
import Modal from './Modal';
import LifeBar from './LifeBar';

const Game = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [isPlaying, setIsPlaying] = useState([false, false, false]);
  const [audioUrls, setAudioUrls] = useState([null, null, null]);
  const [lives, setLives] = useState(localStorage.getItem('lives') ? parseInt(localStorage.getItem('lives')) : 5);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [correctWord, setCorrectWord] = useState(localStorage.getItem('correctWord') || ''); // Initialize correctWord
  const audioRefs = [useRef(null), useRef(null), useRef(null)];
  const maxWordLength = 13;

  const handleKeyClick = (letter) => {
    if (currentWord.length < maxWordLength) {
      setCurrentWord(currentWord + letter);
    }
  };

  const handleBackspace = () => {
    setCurrentWord(currentWord.slice(0, -1));
  };

  const handlePlayClick = (index) => {
    setIsPlaying((prev) => prev.map((state, i) => {
      if (i === index && state) {
        audioRefs[index].current.pause();
        audioRefs[index].current.currentTime = 0;
        return false;
      } else {
        audioRefs.forEach((audioRef) => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        });
        return i === index;
      }
    }));
  };

  useEffect(() => {
    audioRefs.forEach((audioRef, index) => {
      if (audioRef.current) {
        if (isPlaying[index]) {
          audioRef.current.play();
        }
      }
    });
  }, [isPlaying]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/today/today');
        const { word, wordAudioUrl, meaningAudioUrl, exampleAudioUrl } = response.data;
        setCorrectWord(word); 
        localStorage.setItem('correctWord', word); // Cache the correct word

        const baseUrl = 'http://localhost:3001';
        setAudioUrls([
          `${baseUrl}${wordAudioUrl}`,
          `${baseUrl}${meaningAudioUrl}`,
          `${baseUrl}${exampleAudioUrl}`
        ]);
      } catch (error) {
        console.error('Error fetching audio data:', error);
      }
    };

    if (!localStorage.getItem('correctWord')) {
      fetchData();
    }
  }, []);

  const handleSubmit = async () => {
    if (!currentWord) return;

    if (currentWord.toLowerCase() === correctWord.toLowerCase()) {
      setModalContent(`Congratulations! You've guessed the word!`);
      localStorage.setItem('gameStatus', 'won'); // Cache the game status
      flashSquares('green');
      setTimeout(() => {
        setShowModal(true);
      }, 1500);
    } else {
      if (lives > 1) {
        flashSquares('red');
        setLives(lives - 1);
        localStorage.setItem('lives', lives - 1); // Cache remaining lives
      } else {
        setModalContent(`Out of tries! The correct word was "${correctWord}".`);
        localStorage.setItem('gameStatus', 'lost'); // Cache the game status
        setShowModal(true);
        setLives(0);
      }
    }
    setTimeout(() => {
      setCurrentWord('');
    }, 1000);
  };

  const flashSquares = (color) => {
    const squares = document.querySelectorAll('.input-box');
    squares.forEach((square) => {
      square.style.backgroundColor = color;
    });
    setTimeout(() => {
      squares.forEach((square) => {
        square.style.backgroundColor = 'white';
      });
    }, 500);
  };

  const handleCopy = () => {
    const tries = 5 - lives;
    const resultMessage = `Adess Spelling\n${tries}/5\n\n⬛⬛⬛⬛⬛ 🟩🟩🟩🟩🟩\nLink: http://yourwebsite.com`;
    navigator.clipboard.writeText(resultMessage);
    alert('Results copied to clipboard!');
  };

  useEffect(() => {
    const gameStatus = localStorage.getItem('gameStatus');
    if (gameStatus === 'won') {
      setModalContent(`Congratulations! You've guessed the word!`);
      setShowModal(true);
    } else if (gameStatus === 'lost') {
      setModalContent(`Out of tries! The correct word was "${correctWord}".`);
      setShowModal(true);
    }
  }, []);

  return (
    <div className="flex flex-col items-center py-10 space-y-8">
      {/* Audio Waveform Animation */}
      <div className="flex space-x-4">
        <img src={isPlaying.some((state) => state) ? audioWave : audioStop} alt="Audio Status" className="w-10 h-10" />
      </div>

      {/* Labels with Play Icons */}
      <div className="space-y-4 text-center">
        {['Word', 'Definition', 'Example'].map((label, index) => (
          <div key={index} className="text-xl font-semibold flex items-center justify-center">
            <button
              className="mr-2 text-2xl cursor-pointer transform transition-transform hover:scale-110 focus:outline-none"
              onClick={() => handlePlayClick(index)}
            >
              <FontAwesomeIcon icon={isPlaying[index] ? faStopCircle : faPlayCircle} />
            </button>
            {label}: <span className="font-light ml-2">{`Play for ${label}`}</span>
            {audioUrls[index] && (
              <audio
                ref={audioRefs[index]}
                src={audioUrls[index]}
                onEnded={() => setIsPlaying((prev) => prev.map((state, i) => i === index ? false : state))}
              />
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Input Boxes */}
      <div className="flex space-x-2">
        {[...Array(maxWordLength)].map((_, index) => (
          <div
            key={index}
            className={`input-box w-10 h-10 border-2 border-gray-300 flex items-center justify-center text-xl font-semibold rounded shadow-md ${
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
          <div className="col-start-2 col-span-8 grid grid-cols-9 gap-2">
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
          <div className="col-start-3 col-span-6 grid grid-cols-7 gap-2">
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
            onClick={handleSubmit}
          >
            Enter
          </button>
        </div>
      </div>

      {/* Life Bar */}
      <LifeBar lives={lives} />

      {/* Modal for Result */}
      {showModal && <Modal content={modalContent} onClose={() => setShowModal(false)} onCopy={handleCopy} />}
    </div>
  );
};

export default Game;
