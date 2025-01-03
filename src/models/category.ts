import mongoose, { Schema } from "mongoose";

interface ICategory {
    _id: mongoose.Types.ObjectId;
    name: string;
    numberOfPost: number;
}

const categorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, unique: true, index: true },
        numberOfPost: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export const CategoryModel = mongoose.model("Category", categorySchema);