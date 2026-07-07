const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ service: 'staffcar backend', status: 'ok' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/books', (req, res) => {
  res.json({ books: [] });
});

app.post('/api/books', (req, res) => {
  res.status(201).json({ message: 'Book created', data: req.body });
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend listening on port ${port}`);
});
