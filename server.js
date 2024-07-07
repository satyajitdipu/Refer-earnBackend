const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.get('/api/referrals', async (req, res) => {
  try {
    const referrals = await prisma.referral.findMany();
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch referrals' });
  }
});
app.post('/api/referrals', async (req, res) => {
  try {
    const { referrerName, referrerEmail, refereeName, refereeEmail, courseName, message } = req.body;

    if (!referrerName || !referrerEmail || !refereeName || !refereeEmail || !courseName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newReferral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
        courseName,
        message,
      },
    });

    res.status(201).json(newReferral);
  } catch (error) {
    console.error('Error handling referral submission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
