import mongoose, { Schema } from "mongoose";

interface IPostCategory {
  _id: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
}

const postCategorySchema = new Schema<IPostCategory>(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
  },
  { timestamps: true }
);

// Performans için gerekli indeksler
postCategorySchema.index({ postId: 1, categoryId: 1 }, { unique: true });
postCategorySchema.index({ categoryId: 1 });

export const PostCategoryModel = mongoose.model('PostCategory', postCategorySchema);