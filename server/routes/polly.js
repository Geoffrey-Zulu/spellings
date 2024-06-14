// /server/routes/polly.js
const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

require('dotenv').config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const polly = new AWS.Polly();

router.post('/synthesize', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const params = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: 'Ruth', 
  };

  try {
    const { AudioStream } = await polly.synthesizeSpeech(params).promise();
    const audioBuffer = Buffer.from(AudioStream);
    res.set('Content-Type', 'audio/mp3');
    res.send(audioBuffer);
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    res.status(500).json({ error: 'Could not synthesize speech' });
  }
});

module.exports = router;
