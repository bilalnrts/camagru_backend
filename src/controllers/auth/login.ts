import {Request, Response} from 'express';
import {z} from 'zod';
import {UserModel} from '../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const loginSchema = z.object({
  username: z.string().min(2).max(30),
  password: z.string().min(6).max(30),
});

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await UserModel.findOne({username: validatedData.username});

    if (!user) {
      return res.status(404).json({message: 'Wrong username or password.'});
    }

    const matchedPass = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!matchedPass) {
      return res.status(404).json({message: 'Wrong username or password.'});
    }

    const token = jwt.sign(
      {userId: user._id, username: user.username},
      process.env.JWT_SECRET || 'secretKey',
      {expiresIn: '24h'}
    );

    res.cookie('camagru-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login successful.',
      token: token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid data.',
        errors: err.errors,
      });
    }

    return res.status(500).json({
      message: 'An error occurred while logging in.',
    });
  }
};
