import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ActorSchema = new Schema({
  actorId: { type: Number, required: true, unique: true }, // actorId 保持唯一性
  name: { type: String, required: true },
  character: { type: String, default: 'Unknown' }, // 角色名，适用于特定电影
  profile_path: { type: String, default: null }, // 头像路径
  biography: { type: String, default: null }, // 演员简介
  birthday: { type: String, default: null }, // 演员生日
  movies: [{
    movieId: { type: Number }, // 关联的电影ID
    title: { type: String }, // 电影名称
    character: { type: String } // 在该电影中的角色名
  }]
});

export default mongoose.model('Actor', ActorSchema);
