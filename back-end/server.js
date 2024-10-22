const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

dotenv.config({ path: 'config.env' });
const dbConnection = require('./config/db');

// Connect with DB
dbConnection();

// express app
const app = express();

// middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

// Routes
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/coursesRoutes');
const groupsRoutes = require('./routes/groupsRoutes');
const lecturesRoutes = require('./routes/lecturesRoutes');
app.use('/api/users', userRoutes);  
app.use('/api/course', courseRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/lectures', lecturesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
