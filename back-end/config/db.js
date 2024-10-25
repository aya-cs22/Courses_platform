const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    console.log('Connecting to DB:', process.env.DB_URI);
    await mongoose.connect(process.env.DB_URI, {
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};
module.exports = dbConnection;
