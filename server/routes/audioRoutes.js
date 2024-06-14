// /server/routes/audioRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
require('dotenv').config();

const prisma = new PrismaClient();

const sendAudio = async (req, res, audioField) => {
  try {
    // Calculate today's date and format as string 'YYYY-MM-DD'
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // Fetch the audio entry for today's date
    const audioEntry = await prisma.audioEntry.findUnique({
      where: { entryDate: formattedDate },
    });

    if (!audioEntry) {
      return res.status(404).json({ error: 'No audio entry found for today' });
    }

    // Send the requested audio as a stream
    const audioBuffer = audioEntry[audioField];
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (error) {
    console.error('Error serving audio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.get('/audio/word', (req, res) => sendAudio(req, res, 'wordAudio'));
router.get('/audio/meaning', (req, res) => sendAudio(req, res, 'meaningAudio'));
router.get('/audio/example', (req, res) => sendAudio(req, res, 'exampleAudio'));

module.exports = router;
