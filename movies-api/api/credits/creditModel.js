import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CreditSchema = new Schema({
    movieId: { type: Number, required: true },
    cast: [{
        id: { type: Number },
        name: { type: String },
        character: { type: String },
        profile_path: { type: String }
    }],
    crew: [{
        id: { type: Number },
        name: { type: String },
        job: { type: String },
        department: { type: String }
    }]
});

export default mongoose.model('Credit', CreditSchema);
