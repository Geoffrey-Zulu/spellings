const axios = require('axios');

const apiKey = 'YOUR_WORDNIK_API_KEY';
const baseUrl = 'https://api.wordnik.com/v4';

// Fetch Word of the Day
const getWordOfTheDay = async () => {
  try {
    const response = await axios.get(`${baseUrl}/words.json/wordOfTheDay`, {
      params: { api_key: apiKey }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching word of the day:', error);
    throw error;
  }
};

// Fetch Details for a Specific Word
const getWordDetails = async (word) => {
  try {
    const response = await axios.get(`${baseUrl}/word.json/${word}/definitions`, {
      params: { api_key: apiKey }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for ${word}:`, error);
    throw error;
  }
};

module.exports = {
  getWordOfTheDay,
  getWordDetails
};
