import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    movieId: { type: Number, required: true },
    backdrops: [{
        file_path: { type: String },
        aspect_ratio: { type: Number },
        height: { type: Number },
        width: { type: Number },
        vote_average: { type: Number },
        vote_count: { type: Number }
    }],
    posters: [{
        file_path: { type: String },
        aspect_ratio: { type: Number },
        height: { type: Number },
        width: { type: Number },
        vote_average: { type: Number },
        vote_count: { type: Number }
    }]
});

ImageSchema.statics.findByMovieId = function(movieId) {
    return this.findOne({ movieId: movieId });
};

export default mongoose.model('Images', ImageSchema);