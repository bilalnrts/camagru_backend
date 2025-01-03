import mongoose, { Schema } from "mongoose";

interface IUserCategoryInteraction {
    user: mongoose.Types.ObjectId;
    category: mongoose.Types.ObjectId;
    weight: number;
    lastInteraction: Date | null;
}

const userCategoryInteractionSchema = new Schema<IUserCategoryInteraction>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        weight: {type: Number, default: 0.0},
        lastInteraction: {type: Date || null, default: null}
    },
    { timestamps: true }
);

export const UserCategoryInteractionModel = mongoose.model("UserCategoryInteraction", userCategoryInteractionSchema);