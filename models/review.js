// Review model
const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
});
reviewSchema.index({ book: 1, user: 1 }, { unique: true }); // One review per user per book
module.exports = mongoose.model('Review', reviewSchema);
