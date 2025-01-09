require('dotenv').config();

const express = require('express');
const cors = require ('cors');
const cookieParser = require('cookie-parser');
const OpenAI = require('openai');
const path = require('path');

const app = express();

app.use((req, res, next) => {
  console.log('Incoming Request Headers:', req.headers);
  next();
});

app.use((req, res, next) => {
  const send = res.send;
  res.send = function (body) {
    console.log('Response Headers:', res.getHeaders());
    send.call(this, body);
  };
  next();
});


const allowedOrigins = [
  'http://localhost:3000', // Local development origin
  'https://reframer-3d028bd4486b.herokuapp.com', // Production origin
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use(cookieParser());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something is broken!');
});

app.get('/', (req, res)=>{
  res.send('Hello from the mycelium network');
});

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.post('/growthmindset', async(req, res) => {
  console.log('Request body:', req.body);
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