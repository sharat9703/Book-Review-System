// Review routes: add, update, delete
const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const Book = require('../models/book');
const auth = require('../middleware/auth');

// POST /books/:id/reviews - Add review (auth, one per user per book)
router.post('/books/:id/reviews', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const bookId = req.params.id;
        const existing = await Review.findOne({ book: bookId, user: req.user.id });
        if (existing) return res.status(400).json({ status : 'unsuccess', message: 'You already reviewed this book' });
        const review = new Review({ book: bookId, user: req.user.id, rating, comment });
        await review.save();
        res.status(201).json({status : 'success', data : review});
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ status : 'unsuccess', message: 'Error occurred while adding review', error: err.message });
    }
});

// PUT /reviews/:id - Update own review
router.put('/reviews/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ status : 'unsuccess', message: 'Review not found!' });
        if (review.user.toString() !== req.user.id) return res.status(403).json({ status : 'unsuccess', message: 'Cannot update others review except yours!' });
        review.rating = req.body.rating ?? review.rating;
        review.comment = req.body.comment ?? review.comment;
        await review.save();
        res.json({status : 'success', data : review});
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ status : 'unsuccess', message: 'Error Occurred while updating review', error: err.message });
    }
});

// DELETE /reviews/:id - Delete own review
router.delete('/reviews/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ status : 'unsuccess', message: 'Review not found!' });
        if (review.user.toString() !== req.user.id) return res.status(403).json({ status : 'unsuccess', message: 'Cannot delete others review except yours!' });
        await review.deleteOne();
        res.json({ status : 'success', message: 'Review with id '+req.params.id+' deleted!'});
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ status : 'unsuccess', message: 'Error occurred while deleting review', error: err.message });
    }
});

module.exports = router;
