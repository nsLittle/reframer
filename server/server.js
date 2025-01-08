require('dotenv').config();

const express = require('express');
const cors = require ('cors');
const cookieParser = require('cookie-parser');
const OpenAI = require('openai');
const path = require('path');

const app = express();

const allowedOrigins = [
  'http://localhost:3000', // Local development origin
  'https://reframer-3d028bd4486b.herokuapp.com', // Production origin
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, Postman) or valid origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Enable cookies and credentials
}));

// Handle preflight OPTIONS requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin); // Echo the request's origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

app.use(express.json());
app.use(cookieParser());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// basic midleware?
// app.use((req, res, next) => {
//   console.log('Basic Middleware Stuff...');
//   // res.set(CORS_HEADERS);
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
//   next();
// });

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