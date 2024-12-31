import mongoose, {Schema} from 'mongoose';

interface IUserPreferences {
  user: mongoose.Types.ObjectId;
  profile: 'open' | 'hidden';
  commentMail: boolean;
}

const userPreferencesSchema = new Schema<IUserPreferences>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    profile: {
      type: String,
      enum: ['open', 'hidden'],
      default: 'open',
    },
    commentMail: {
      type: Boolean,
      default: true,
    },
  },
  {timestamps: true}
);

export const UserPreferencesModel = mongoose.model(
  'UserPreferences',
  userPreferencesSchema
);
