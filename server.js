require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini with error handling
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('Gemini initialized successfully');
} catch (err) {
  console.error('Failed to initialize Gemini:', err);
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Please enter a valid question' });
    }

    console.log('Received query:', query); // Debug log

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `As a shopping assistant, provide concise advice about: ${query}.
    Include 2-3 product recommendations with brand, price range, and key features.
    Keep response under 300 characters.`;
    
    console.log('Sending prompt to Gemini...'); // Debug log
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Received response from Gemini:', text); // Debug log

    res.json({ response: text.trim() });
    
  } catch (error) {
    console.error('Full error:', error); // Detailed error log
    res.status(500).json({ 
      error: 'AI service unavailable',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});