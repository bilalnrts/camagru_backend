import mongoose, {Schema} from 'mongoose';

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {type: String, required: true, maxlength: 30, minlength: 2},
    surname: {type: String, required: true, maxlength: 30, minlength: 2},
    email: {type: String, required: true, maxlength: 60, minlength: 2},
    username: {type: String, required: true, maxlength: 30, minlength: 2},
    password: {type: String, required: true, maxlength: 200, minlength: 2},
  },
  {timestamps: true}
);

export const UserModel = mongoose.model('User', userSchema);
