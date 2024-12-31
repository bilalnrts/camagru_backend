import mongoose, {Schema} from 'mongoose';

interface IFollow {
  _id: mongoose.Types.ObjectId;
  follower: mongoose.Types.ObjectId;
  following: mongoose.Types.ObjectId;
  status: 'active' | 'blocked';
}

const followSchema = new Schema<IFollow>(
  {
    follower: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    following: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
  },
  {timestamps: true}
);

followSchema.index({follower: 1, following: 1}, {unique: true});
followSchema.index({follower: 1, status: 1});
followSchema.index({following: 1, status: 1});

export const FollowModel = mongoose.model('Follow', followSchema);
