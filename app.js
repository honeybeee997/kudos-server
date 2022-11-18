const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const globalErrorHandler = require('./controllers/errors');

// Creating the app
const app = express();

app.use(express.json());
app.options('*', cors());
app.use(
  cors({
    origin: '*',
    allowedHeaders: '*',
  })
);

app.use('/api/admin', adminRoutes);

app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: "This route doesn't exist",
  });
});

app.use(globalErrorHandler);

module.exports = app;
