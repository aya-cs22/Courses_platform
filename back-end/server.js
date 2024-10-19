const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' })
const morgan = require('morgan');
const mongoose = require('mongoose');
// Connect with DB
const dbConnection = require("./config/db");
dbConnection();
// express app
const app = express();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`)
}
// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
