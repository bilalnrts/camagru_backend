/**
 * @fileoverview Post oluşturma işlemlerini yöneten controller modülü
 * @module controllers/post/createPost
 */

import {Response} from 'express';
import {AuthUserRequest} from '../../types';
import {withMiddleware} from '../../middleware/withMiddleware';
import {isAuth} from '../../middleware/isAuth';
import {z} from 'zod';
import {PostModel} from '../../models/post';

/**
 * Post oluşturma için gerekli veri validasyon şeması
 * @constant {z.ZodObject}
 *
 * @property {string[]} urls - Post'a ait medya URL'leri (en az 1 adet gerekli)
 * @property {string} [description] - Post açıklaması (opsiyonel)
 */
const createPostSchema = z.object({
  urls: z.string().array().min(1),
  description: z.string().optional(),
});

/**
 * Yeni post oluşturan controller fonksiyonu
 *
 * @async
 * @param {AuthUserRequest} req - Kimlik doğrulaması yapılmış Express request nesnesi
 * @param {Response} res - Express response nesnesi
 * @returns {Promise<Response>} JSON response ile oluşturulan post bilgileri
 *
 * @throws {400} - Geçersiz post verileri durumunda (Zod validasyon hatası)
 * @throws {500} - Sunucu hatası durumunda
 *
 * @example
 * // İstek body örneği
 * {
 *   "urls": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
 *   "description": "Bu benim yeni postum!"
 * }
 *
 * // Başarılı yanıt örneği
 * {
 *   "message": "success",
 *   "post": {
 *     "_id": "post-id",
 *     "owner": "user-id",
 *     "urls": ["https://example.com/image1.jpg"],
 *     "description": "Bu benim yeni postum!",
 *     "likeCount": 0,
 *     "commentCount": 0,
 *     "status": "active",
 *     "createdAt": "2024-03-21T10:00:00.000Z",
 *     "updatedAt": "2024-03-21T10:00:00.000Z"
 *   }
 * }
 *
 * @security Bearer Token gerektirir (isAuth middleware üzerinden)
 */
export const createPost = withMiddleware(isAuth)(async (
  req: AuthUserRequest,
  res: Response
) => {
  try {
    const {userId} = req.user;

    const validatedData = createPostSchema.parse(req.body);

    const post = await PostModel.create({
      owner: userId,
      urls: validatedData.urls,
      description: validatedData.description,
    });

    return res.status(200).json({message: 'success', post: post});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid data.',
        errors: error.errors,
      });
    }
    return res
      .status(500)
      .json({message: 'An error occurred while creating a post.'});
  }
});
