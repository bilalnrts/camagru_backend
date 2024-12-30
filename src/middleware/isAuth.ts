import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {AuthUserRequest} from '../types';

interface JwtPayload {
  userId: string;
  username: string;
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Artık sadece Promise<void> dönüyor
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        message: 'Unauthorized. Authorization header must start with Bearer',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({message: 'Unauthorized. Token not found.'});
      return;
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secretKey'
    ) as JwtPayload;

    (req as AuthUserRequest).user = {
      userId: decodedToken.userId,
      username: decodedToken.username,
    };

    next();
  } catch (error) {
    res.status(401).json({message: 'Invalid token.'});
  }
};
