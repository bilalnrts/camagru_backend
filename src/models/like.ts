import mongoose, {Schema} from 'mongoose';

interface ILike {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  post?: mongoose.Types.ObjectId;
  comment?: mongoose.Types.ObjectId;
}

const likeSchema = new Schema<ILike>(
  {
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    post: {type: Schema.Types.ObjectId, ref: 'Post'},
    comment: {type: Schema.Types.ObjectId, ref: 'Comment'},
  },
  {timestamps: true}
);

likeSchema.index(
  {user: 1, post: 1},
  {
    unique: true,
    partialFilterExpression: {post: {$exists: true}},
  }
);

likeSchema.index(
  {user: 1, comment: 1},
  {
    unique: true,
    partialFilterExpression: {comment: {$exists: true}},
  }
);

likeSchema.pre('save', function (next) {
  if ((this.post && this.comment) || (!this.post && !this.comment)) {
    next(new Error('Either post or comment must be set, not both or neither.'));
  }
  next();
});

export const LikeModel = mongoose.model('Like', likeSchema);
