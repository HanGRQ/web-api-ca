// userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String, 
    required: true
  },
  photoURL: {
    type: String,
    required: false
  },
  favorites: [{
    type: Number,
    default: []
  }],
  watchlist: [{
    type: Number,
    default: []
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add to favorites
UserSchema.methods.addToFavorites = async function(movieId) {
  if (!this.favorites.includes(movieId)) {
    this.favorites.push(movieId);
    await this.save();
  }
  return this.favorites;
};

// Remove from favorites
UserSchema.methods.removeFromFavorites = async function(movieId) {
  this.favorites = this.favorites.filter(id => id !== movieId);
  await this.save();
  return this.favorites;
};

// Add to watchlist
UserSchema.methods.addToWatchlist = async function(movieId) {
  if (!this.watchlist.includes(movieId)) {
    this.watchlist.push(movieId);
    await this.save();
  }
  return this.watchlist;
};

// Remove from watchlist
UserSchema.methods.removeFromWatchlist = async function(movieId) {
  this.watchlist = this.watchlist.filter(id => id !== movieId);
  await this.save();
  return this.watchlist;
};

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Find user by email
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email });
};

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  const saltRounds = 10;
  if (this.isModified('password') || this.isNew) {
    try {
      const hash = await bcrypt.hash(this.password, saltRounds);
      this.password = hash;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export default mongoose.model('User', UserSchema);