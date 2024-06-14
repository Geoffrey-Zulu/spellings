// /server/routes/todayEntry.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
require('dotenv').config();

const prisma = new PrismaClient();

router.get('/today', async (req, res) => {
  try {
    // Calculate today's date and format as string 'YYYY-MM-DD'
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // Debug: Log the formatted date for comparison
    console.log('Formatted Date for Query:', formattedDate);

    // Fetch the word entry for today's date using string comparison
    const wordEntry = await prisma.wordEntry.findUnique({
      where: { entryDate: formattedDate },
    });

    if (!wordEntry) {
      return res.status(404).json({ error: 'No word entry found for today' });
    }

    // Fetch the audio entry for today's date using string comparison
    const audioEntry = await prisma.audioEntry.findUnique({
      where: { entryDate: formattedDate },
    });

    if (!audioEntry) {
      return res.status(404).json({ error: 'No audio entry found for today' });
    }

    // Respond with the word details and URLs to audio files
    res.status(200).json({
      word: wordEntry.word,
      meaning: wordEntry.meaning,
      example: wordEntry.example,
      wordAudioUrl: `/api/today/audio/word`,
      meaningAudioUrl: `/api/today/audio/meaning`,
      exampleAudioUrl: `/api/today/audio/example`,
      entryDate: wordEntry.entryDate,
    });
  } catch (error) {
    console.error('Error retrieving today\'s entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
