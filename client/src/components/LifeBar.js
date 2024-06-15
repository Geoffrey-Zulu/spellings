import React from 'react';

const LifeBar = ({ lives }) => {
  return (
    <div className="flex space-x-2 mt-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`w-4 h-10 rounded ${index < lives ? 'bg-blue-500' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default LifeBar;
