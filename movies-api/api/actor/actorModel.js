import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ActorSchema = new Schema({
  actorId: { type: Number, required: true, unique: true }, 
  name: { type: String, required: true },
  character: { type: String, default: 'Unknown' }, 
  profile_path: { type: String, default: null }, 
  biography: { type: String, default: null }, 
  birthday: { type: String, default: null }, 
  movies: [{
    movieId: { type: Number }, 
    title: { type: String },
    character: { type: String } 
  }]
});

export default mongoose.model('Actor', ActorSchema);
