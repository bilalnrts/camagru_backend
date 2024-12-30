import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { UserModel } from '../../models/user';

// Validation şeması
const registerSchema = z.object({
  name: z.string().min(2).max(30),
  surname: z.string().min(2).max(30),
  email: z.string().email().min(2).max(60),
  username: z.string().min(2).max(30),
  password: z.string().min(6).max(200),
});

export const register = async (req: Request, res: Response) => {
  try {
    // Request body'i validate et
    const validatedData = registerSchema.parse(req.body);

    // Email ve username kontrolü
    const existingUser = await UserModel.findOne({
      $or: [
        { email: validatedData.email },
        { username: validatedData.username }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Bu email veya kullanıcı adı zaten kullanımda'
      });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Yeni kullanıcı oluştur
    const user = await UserModel.create({
      ...validatedData,
      password: hashedPassword
    });

    // Hassas bilgileri çıkar
    const { password, ...userWithoutPassword } = user.toObject();

    return res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: userWithoutPassword
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Geçersiz veri',
        errors: error.errors
      });
    }

    return res.status(500).json({
      message: 'Bir hata oluştu'
    });
  }
};