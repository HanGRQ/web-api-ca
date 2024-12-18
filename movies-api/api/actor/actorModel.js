import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ActorSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    profile_path: { type: String },
    known_for: [{ type: String }],
    popularity: { type: Number },
    movie_credits: [{ type: Number }]
});

export default mongoose.model('Actor', ActorSchema);
