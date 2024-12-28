import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    movieId: { type: Number, required: true }, 
    reviewId: { type: String, required: true, unique: true }, 
    author: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true }
});

export default mongoose.model('Review', ReviewSchema);
