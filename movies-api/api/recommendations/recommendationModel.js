import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RecommendationSchema = new Schema({
    movieId: { type: Number, required: true, unique: true },
    recommendations: [{
        movieId: { type: Number, required: true },
        title: { type: String, default: 'No title available' },
        overview: { type: String, default: 'No overview available' },
        poster_path: { type: String, default: null },
        release_date: { type: String, default: 'Unknown' },
    }]
});

export default mongoose.model('Recommendation', RecommendationSchema);
