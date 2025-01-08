require('dotenv').config();

const express = require('express');
const cors = require ('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://reframer-3d028bd4486b.herokuapp.com'
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// swagger path?

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// basic midleware?
app.use((req, res, next) => {
  console.log('Basic Middleware Stuff...');
  // res.set(CORS_HEADERS);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// error handling?
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something is broken!');
});

// swagger?

app.get('/', (req, res)=>{
  res.send('Hello from the mycelium network');
});

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.post('/growthmindset', async(req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system',
          content: 'You are a positivity assistant. Please translate my thought into a pithy one sentence positive growth mindest reframing of the original input.'},
        {
          role: 'user',
          content: prompt,
        },
      ]
    })
    res.json({ completion: completion.choices[0].message.content});
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'An error occured while processing this request.',
      error: error.message,
    });
  }
});

const PORT =process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));