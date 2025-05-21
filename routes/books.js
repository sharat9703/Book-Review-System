// Book routes: add, list, get details, add review
const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Review = require('../models/review');
const auth = require('../middleware/auth');

// POST /books - Add a new book (auth required)
router.post('/', auth, async (req, res) => {
    try {
        const { title, author, genre, description } = req.body;
        const book = new Book({ title, author, genre, description, createdBy: req.user.id });
        await book.save();
        res.status(201).json({ status: 'success', data: book });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ status: 'unsuccess', message: 'Error occurred while adding book', error: err.message });
    }
});

// GET /books - List books (pagination, filter)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, author, genre } = req.query;
        const filter = {};
        if (author) filter.author = new RegExp(author, 'i');
        if (genre) filter.genre = new RegExp(genre, 'i');
        const books = await Book.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json({ status: 'success', data: books });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ status: 'unsuccess', message: 'Error occurred while fetching books', error: err.message });
    }
});

// GET /books/:id - Book details with avg rating & reviews (paginated)
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ status: 'success', message: 'Book not found' });
        const { page = 1, limit = 5 } = req.query;
        const reviews = await Review.find({ book: book._id }).populate('user', 'username').skip((page - 1) * limit).limit(Number(limit));
        const avg = await Review.aggregate([
            {
                $match: { book: book._id }
            },
            {
                $group: { _id: null, avgRating: { $avg: '$rating' } }
            }
        ]);
        res.json({ status: 'success', data: { book, averageRating: avg[0]?.avgRating || null, reviews } });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ status: 'unsuccess', message: 'error occurred while fetching book with id ' + req.params.id + '', error: err.message });
    }
});

module.exports = router;
