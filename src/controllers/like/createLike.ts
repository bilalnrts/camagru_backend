import {Response} from 'express';
import {AuthUserRequest} from '../../types';
import {withMiddleware} from '../../middleware/withMiddleware';
import {isAuth} from '../../middleware/isAuth';
import {z} from 'zod';
import {LikeModel} from '../../models/like';
import {PostModel} from '../../models/post';
import {CommentModel} from '../../models/comment';
import AppEventEmitter from '../../services/eventEmitter';
import {RESPONSE_INVALID_DATA, RESPONSE_SERVER_ERROR} from '../../constants';

const createLikeSchema = z
  .object({
    postId: z.string().optional(),
    commentId: z.string().optional(),
  })
  .refine(data => data.postId || data.commentId, {
    message: 'Either postId or commentId must be provided',
  });

export const createLike = withMiddleware(isAuth)(async (
  req: AuthUserRequest,
  res: Response
) => {
  try {
    const {userId} = req.user;
    const validatedData = createLikeSchema.parse(req.body);

    // Like nesnesini oluştur
    const likeData = {
      user: userId,
      ...(validatedData.postId ? {post: validatedData.postId} : {}),
      ...(validatedData.commentId ? {comment: validatedData.commentId} : {}),
    };

    const like = await LikeModel.create(likeData);

    // Like sayısını güncelle
    if (validatedData.postId) {
      await PostModel.findByIdAndUpdate(validatedData.postId, {
        $inc: {likeCount: 1},
      });
    } else if (validatedData.commentId) {
      await CommentModel.findByIdAndUpdate(validatedData.commentId, {
        $inc: {likes: 1},
      });
    }

    // Event'i tetikle
    AppEventEmitter.getInstance().emit('like:created', {
      likeId: like._id.toString(),
      userId: userId,
      postId: validatedData.postId,
      commentId: validatedData.commentId,
    });

    return res.status(201).json({
      message: 'Like created successfully',
      like,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return RESPONSE_INVALID_DATA(res, error.errors);
    }

    console.log(error);
    return RESPONSE_SERVER_ERROR(res, 'An error occurred while creating like.');
  }
});
