import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CreditSchema = new Schema({
  movieId: { type: Number, required: true, unique: true }, 
  cast: [{
    actorId: { type: Number, required: true }, 
    name: { type: String, required: true },
    character: { type: String, default: 'Unknown' },
    profile_path: { type: String, default: null }
  }],
  crew: [{
    crewId: { type: Number, required: true }, 
    name: { type: String, required: true },
    job: { type: String }, 
    department: { type: String } 
  }]
});

export default mongoose.model('Credit', CreditSchema);
