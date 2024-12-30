import {Request, Response} from 'express';
import {z} from 'zod';
import bcrypt from 'bcrypt';
import {UserModel} from '../../models/user';

const registerSchema = z.object({
  name: z.string().min(2).max(30),
  surname: z.string().min(2).max(30),
  email: z.string().email().min(2).max(60),
  username: z.string().min(2).max(30),
  password: z.string().min(6).max(20),
});

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await UserModel.findOne({
      $or: [{email: validatedData.email}, {username: validatedData.username}],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'This username or email already taken.',
      });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await UserModel.create({
      ...validatedData,
      password: hashedPassword,
    });

    const {password, ...userWithoutPassword} = user.toObject();

    return res.status(201).json({
      message: 'User created successfully.',
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid data.',
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: 'An error occurred while creating user.',
    });
  }
};
