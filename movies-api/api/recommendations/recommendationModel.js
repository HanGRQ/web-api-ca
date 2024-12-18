import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RecommendationSchema = new Schema({
    movieId: { type: Number, required: true },
    recommendations: [{
        id: { type: Number },
        title: { type: String },
        overview: { type: String },
        poster_path: { type: String },
        release_date: { type: String }
    }]
});

export default mongoose.model('Recommendation', RecommendationSchema);
