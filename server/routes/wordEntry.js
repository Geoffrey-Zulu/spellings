// /server/routes/wordEntry.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const prisma = new PrismaClient();

router.post('/set-word', authMiddleware, async (req, res) => {
  const { word, meaning, example, date } = req.body;

  if (!word || !meaning || !example || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Store the date as a string
    const entryDate = date; // Expecting 'YYYY-MM-DD' format

    // Check if an entry with the same date already exists
    const existingEntry = await prisma.wordEntry.findUnique({
      where: { entryDate },
    });

    if (existingEntry) {
      return res.status(409).json({ error: 'An entry already exists for this date' });
    }

    // Save the new word entry to the database
    const newWordEntry = await prisma.wordEntry.create({
      data: {
        word,
        meaning,
        example,
        entryDate,
      },
    });

    res.status(201).json({ message: 'Word entry created successfully', wordEntry: newWordEntry });
  } catch (error) {
    console.error('Error creating word entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
