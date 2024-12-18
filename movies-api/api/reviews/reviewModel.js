import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    movieId: { type: Number, required: true }, // TMDB 电影 ID
    reviewId: { type: String, required: true, unique: true }, // TMDB 评论 ID
    author: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true }
});

export default mongoose.model('Review', ReviewSchema);
