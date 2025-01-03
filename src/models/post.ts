import mongoose, {Schema} from 'mongoose';

interface IPost {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  likeCount: number;
  commentCount: number;
  numberOfShows: number;
  likeShowsRate: number;
  commentShowsRate: number;
  urls: string[];
  description?: string;
  onFeed: boolean;
  status: 'active' | 'deleted' | 'hidden';
}

const postSchema = new Schema<IPost>(
  {
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    likeCount: {type: Number, default: 0},
    commentCount: {type: Number, default: 0},
    numberOfShows: {type: Number, default: 0},
    commentShowsRate: {type: Number, default: 0},
    likeShowsRate: {type: Number, default: 0},
    onFeed: {type: Boolean, default: false},
    urls: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length > 0,
        'At least one URL is required.',
      ],
    },
    description: {
      type: String,
      maxlength: 2200,
    },
    status: {
      type: String,
      enum: ['active', 'deleted', 'hidden'],
      default: 'active',
    },
  },
  {timestamps: true}
);

postSchema.index({owner: 1, createdAt: -1});
postSchema.index({status: 1});

export const PostModel = mongoose.model('Post', postSchema);
