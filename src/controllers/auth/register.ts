/**
 * @fileoverview Kullanıcı kaydı işlemlerini yöneten controller modülü
 * @module controllers/auth/register
 */

import {Request, Response} from 'express';
import {z} from 'zod';
import bcrypt from 'bcrypt';
import {UserModel} from '../../models/user';
import mongoose from 'mongoose';
import {UserPreferencesModel} from '../../models/preferences';

/**
 * Kullanıcı kayıt verilerinin doğrulanması için Zod şema tanımı
 * @constant {z.ZodObject}
 */
const registerSchema = z.object({
  name: z.string().min(2).max(30),
  surname: z.string().min(2).max(30),
  email: z.string().email().min(2).max(60),
  username: z.string().min(2).max(30),
  password: z.string().min(6).max(20),
});

/**
 * Yeni kullanıcı kaydı oluşturan controller fonksiyonu
 *
 * @async
 * @param {Request} req - Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @returns {Promise<Response>} JSON response ile oluşturulan kullanıcı bilgileri
 *
 * @throws {400} - Geçersiz kayıt verileri veya mevcut kullanıcı durumunda
 * @throws {500} - Sunucu hatası durumunda
 *
 * @example
 * // İstek body örneği
 * {
 *   "name": "John",
 *   "surname": "Doe",
 *   "email": "john@example.com",
 *   "username": "johndoe",
 *   "password": "123456"
 * }
 *
 * // Başarılı yanıt örneği
 * {
 *   "message": "User created successfully.",
 *   "user": {
 *     "name": "John",
 *     "surname": "Doe",
 *     "email": "john@example.com",
 *     "username": "johndoe"
 *   }
 * }
 */
export const register = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await UserModel.findOne({
      $or: [{email: validatedData.email}, {username: validatedData.username}],
    });

    if (existingUser) {
      await session.abortTransaction();
      return res.status(400).json({
        message: 'This username or email already taken.',
      });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await UserModel.create(
      [
        {
          ...validatedData,
          password: hashedPassword,
        },
      ],
      {session}
    );

    await UserPreferencesModel.create(
      [
        {
          user: user[0]._id,
        },
      ],
      {session}
    );

    await session.commitTransaction();

    const {password, ...userWithoutPassword} = user[0].toObject();

    return res.status(201).json({
      message: 'User created successfully.',
      user: userWithoutPassword,
    });
  } catch (error) {
    await session.abortTransaction();

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid data.',
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: 'An error occurred while creating user.',
    });
  } finally {
    session.endSession();
  }
};
