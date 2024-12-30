import mongoose, {Schema} from 'mongoose';

interface IPost {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  likeCount: number;
  commentCount: number;
  urls: string[];
}

const postSchema = new Schema<IPost>(
  {
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    likeCount: {type: Number, default: 0},
    commentCount: {type: Number, default: 0},
    urls: Array<String>,
  },
  {timestamps: true}
);

export const PostModel = mongoose.model('Post', postSchema);
