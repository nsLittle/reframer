require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const OpenAI = require('openai');
const path = require('path');

const app = express();

app.use((req, res, next) => {
  console.log('Incoming Request Headers:', req.headers);
  next();
});

// API routes
app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Catch-all route for unknown API routes
app.use((req, res, next) => {
  const send = res.send;
  res.send = function (body) {
    console.log('Response Headers:', res.getHeaders());
    send.call(this, body);
  };
  next();
});

const allowedOrigins = [
  'http://localhost:3000',
  'https://reframer-473c134b8246.herokuapp.com',
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API route for growth mindset reframing
app.post('/growthmindset', async (req, res) => {
  console.log('Request body:', req.body);
  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a positivity assistant. Please translate my thought into a pithy one sentence positive growth mindset reframing of the original input.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    res.json({ completion: completion.choices[0].message.content });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'An error occurred while processing this request.',
      error: error.message,
    });
  }
});

// Serve static files from the "out" directory
app.use(express.static(path.join(__dirname, 'out')));

// Fallback route to serve index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'out', 'index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
