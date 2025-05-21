// Search route: search books by title or author (partial, case-insensitive)
const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// GET /search?query=...
router.get('/', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: 'Query required' });
        const regex = new RegExp(query, 'i');
        const books = await Book.find({ $or: [{ title: regex }, { author: regex }] });
        res.json(books);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ status : 'unsuccess',message: 'Error occurred while searching books', error: err.message });
    }
});

module.exports = router;
