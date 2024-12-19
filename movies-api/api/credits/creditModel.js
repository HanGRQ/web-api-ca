import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CreditSchema = new Schema({
  movieId: { type: Number, required: true, unique: true }, // 确保每部电影的 Credit 数据唯一
  cast: [{
    actorId: { type: Number, required: true }, // 关联演员的唯一ID
    name: { type: String, required: true },
    character: { type: String, default: 'Unknown' },
    profile_path: { type: String, default: null }
  }],
  crew: [{
    crewId: { type: Number, required: true }, // 关联工作人员的唯一ID
    name: { type: String, required: true },
    job: { type: String }, // 工作职位，例如导演、编剧等
    department: { type: String } // 工作部门，例如摄影、音效等
  }]
});

export default mongoose.model('Credit', CreditSchema);
