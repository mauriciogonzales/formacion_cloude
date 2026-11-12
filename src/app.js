const express = require('express');
const healthRouter = require('./routes/health');
const vendehumosRouter = require('./routes/vendehumos');

const app = express();

app.use(express.json());

app.use('/health', healthRouter);
app.use('/vendehumos', vendehumosRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
