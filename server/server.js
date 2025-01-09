require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const OpenAI = require('openai');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cookieParser());

const cors = require('cors');

const allowedOrigins = [
  'http://localhost:8000', // Allow requests from local development
  'https://reframer-473c134b8246.herokuapp.com', // Allow the deployed frontend
];

app.use(
  cors({
    origin: allowedOrigins, // Allow specific origins
    credentials: true, // Allow cookies and credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  })
);

// Ensure preflight requests are handled
app.options('*', cors());


app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

app.use(express.static(path.join(__dirname, '../out')));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
