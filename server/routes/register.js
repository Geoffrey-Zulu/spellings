const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the hashed password to the database
    await prisma.admin.create({
      data: {
        passwordHash: hashedPassword,
      },
    });

    res.status(201).json({ message: 'Root password set successfully' });
  } catch (error) {
    console.error('Error setting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
