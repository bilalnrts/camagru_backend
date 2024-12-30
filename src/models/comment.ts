import mongoose, {Schema} from 'mongoose';

interface IComment {
  _id: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  likes: number;
  parentComment?: mongoose.Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    post: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true, maxlength: 300, minlength: 1},
    likes: {type: Number, default: 0},
    parentComment: {type: Schema.Types.ObjectId, ref: 'Comment'},
  },
  {timestamps: true}
);

commentSchema.index({post: 1, createdAt: -1});
commentSchema.index({user: 1, createdAt: -1});

export const CommentModel = mongoose.model('Comment', commentSchema);
