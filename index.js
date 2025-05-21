const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api', require('./routes/reviews'));
app.use('/api/search', require('./routes/search'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Connected to MongoDB!\nServer running on port ${port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err.stack));
