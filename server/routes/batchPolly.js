// /server/routes/batchPolly.js
const express = require('express');
const AWS = require('aws-sdk');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const polly = new AWS.Polly();
const prisma = new PrismaClient();

router.post('/synthesize-tomorrow', async (req, res) => {
  try {
    // Calculate tomorrow's date and format as string 'YYYY-MM-DD'
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];

    // Fetch word entry for tomorrow's date
    const wordEntry = await prisma.wordEntry.findUnique({
      where: { entryDate: formattedDate },
    });

    if (!wordEntry) {
      return res.status(404).json({ error: 'No word entry found for tomorrow' });
    }

    // Function to synthesize speech
    const synthesizeSpeech = async (text) => {
      const params = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: 'Nicole',
      };
      const { AudioStream } = await polly.synthesizeSpeech(params).promise();
      return Buffer.from(AudioStream);
    };

    // Synthesize audio for word, meaning, and example
    const wordAudio = await synthesizeSpeech(wordEntry.word);
    const meaningAudio = await synthesizeSpeech(wordEntry.meaning);
    const exampleAudio = await synthesizeSpeech(wordEntry.example);

    // Store the audio files in the database
    const newAudioEntry = await prisma.audioEntry.create({
      data: {
        wordAudio,
        meaningAudio,
        exampleAudio,
        entryDate: formattedDate,
      },
    });

    res.status(201).json({ message: 'Audio synthesized and stored successfully', audioEntry: newAudioEntry });
  } catch (error) {
    console.error('Error during audio synthesis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
