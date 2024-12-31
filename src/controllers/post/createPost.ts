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
import multer from 'multer';
import MulterService from '../../services/multerService';
import AppEventEmitter from '../../services/eventEmitter';

/**
 * Post oluşturma için gerekli veri validasyon şeması
 * @constant {z.ZodObject}
 *
 * @property {string[]} urls - Post'a ait medya URL'leri (en az 1 adet gerekli)
 * @property {string} [description] - Post açıklaması (opsiyonel)
 */
const createPostSchema = z.object({
  description: z.string().max(2200).optional(),
});

const upload = multer({
  storage: MulterService.postFileStorage,
  fileFilter: MulterService.postFileFilter,
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
export const createPost = withMiddleware(
  isAuth,
  upload.array('files')
)(async (req: AuthUserRequest, res: Response) => {
  try {
    const {userId} = req.user;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'At least one file must be uploaded.',
      });
    }

    const validatedData = createPostSchema.parse(req.body);

    const fileUrls = (req.files as Express.Multer.File[]).map(file => {
      return file.filename;
    });

    const post = await PostModel.create({
      owner: userId,
      urls: fileUrls,
      description: validatedData.description,
    });

    AppEventEmitter.getInstance().emit('post:created', {
      postId: post._id.toString(),
      userId: userId,
    });

    const postObject = post.toObject();

    return res.status(200).json({
      message: 'success',
      post: {
        ...postObject,
        urls: postObject.urls.map(url => `images/${url}`),
      },
    });
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
