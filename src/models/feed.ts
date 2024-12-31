import mongoose, {Schema} from 'mongoose';

interface IFeed {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  postOwner: mongoose.Types.ObjectId;
  score: number;
  type: 'following' | 'discover';
  status: 'active' | 'hidden';
}

const feedSchema = new Schema<IFeed>(
  {
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    post: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
    postOwner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    score: {type: Number, default: 0},
    type: {
      type: String,
      enum: ['following', 'discover'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'hidden'],
      default: 'active',
    },
  },
  {timestamps: true}
);

feedSchema.index({user: 1, status: 1, score: -1});
feedSchema.index({user: 1, post: 1}, {unique: true});
feedSchema.index({post: 1, status: 1});

export const FeedModel = mongoose.model('Feed', feedSchema);
