require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query?.trim()) {
      return res.status(400).json({ error: 'Please enter a valid question' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `As a shopping assistant, provide specific recommendations for: ${query.trim()}
    Format as:
    - 3 product options with brands
    - Price ranges
    - Key features
    - Where to buy
    Keep response under 400 characters.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text.trim() });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'AI service unavailable',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Add this test route to your server.js temporarily
app.get('/api/test-gemini', async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Test connection");
    res.json({ status: "Connected successfully!" });
  } catch (error) {
    console.error("Connection test failed:", error);
    res.status(500).json({ 
      error: "Connection failed",
      details: error.message 
    });
  }
});
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query?.trim()) {
      return res.status(400).json({ error: 'Please enter a valid question' });
    }

    console.log('Initializing Gemini with key:', process.env.GEMINI_API_KEY?.slice(0, 5) + '...');
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `As a shopping assistant, respond to: ${query.trim()}`;
    console.log('Sending prompt:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    if (!response) {
      throw new Error('Empty response from Gemini');
    }
    
    const text = response.text();
    console.log('Received response:', text);
    
    res.json({ response: text.trim() });
    
  } catch (error) {
    console.error('Full error:', {
      message: error.message,
      stack: error.stack,
      code: error.code || 'UNKNOWN',
      status: error.status || 500
    });
    
    const errorDetails = {
      error: 'AI service unavailable',
      details: {
        code: error.code || 'NO_ERROR_CODE',
        message: error.message
      }
    };
    
    res.status(500).json(errorDetails);
  }
});
