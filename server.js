require('dotenv').config({path: './.config.env'});
const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.MONGO_URI, () => {
  console.log('Database Connected');
  app.listen(process.env.PORT || '3000', () => {
    console.log('Server Started');
  });
});
