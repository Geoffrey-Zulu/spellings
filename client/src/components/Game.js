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
  const [lives, setLives] = useState(() => {
    // Retrieve lives from localStorage or default to 5
    const savedLives = localStorage.getItem('lives');
    return savedLives ? parseInt(savedLives, 10) : 5;
  });
  const [attempts, setAttempts] = useState(() => {
    // Retrieve attempts from localStorage or default to 0
    const savedAttempts = localStorage.getItem('attempts');
    return savedAttempts ? parseInt(savedAttempts, 10) : 0;
  });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [correctWord, setCorrectWord] = useState(''); 
  const audioRefs = [useRef(null), useRef(null), useRef(null)];
  const maxWordLength = 13;

  useEffect(() => {
    // Clear cache if a new day starts
    const lastPlayDate = localStorage.getItem('lastPlayDate');
    const today = new Date().toISOString().split('T')[0];
    if (lastPlayDate !== today) {
      localStorage.clear();
      localStorage.setItem('lastPlayDate', today);
      setLives(5);
      setAttempts(0);
    }
  }, []);

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
        audioRefs.forEach((audioRef, i) => {
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

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!currentWord) return;

    setAttempts(prev => prev + 1);

    if (currentWord.toLowerCase() === correctWord.toLowerCase()) {
      setModalContent(`Congratulations! You've guessed the word!`);
      setShowModal(true);
      flashSquares('green');
    } else {
      if (lives > 1) {
        flashSquares('red');
        setLives(lives - 1);
      } else {
        setModalContent(`Out of tries! The correct word was "${correctWord}".`);
        setShowModal(true);
        setLives(0);
      }
    }

    // Save lives and attempts to localStorage
    localStorage.setItem('lives', lives - 1);
    localStorage.setItem('attempts', attempts + 1);

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

  return (
    <div className="flex flex-col items-center py-10 space-y-8">
      <div className="flex space-x-4">
        <img src={isPlaying.some((state) => state) ? audioWave : audioStop} alt="Audio Status" className="w-10 h-10" />
      </div>

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

      <div className="mt-8 space-y-2">
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

      <LifeBar lives={lives} />

      {showModal && <Modal content={modalContent} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Game;
