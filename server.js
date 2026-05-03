import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import chatHandler from './api/chat.js';
import quizHandler from './api/quiz.js';
import feedbackHandler from './api/feedback.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    await chatHandler(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/quiz', async (req, res) => {
  try {
    await quizHandler(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    await feedbackHandler(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
