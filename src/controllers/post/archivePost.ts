import {isAuth} from '../../middleware/isAuth';
import {withMiddleware} from '../../middleware/withMiddleware';
import {AuthUserRequest} from '../../types';
import {z} from 'zod';
import {Response} from 'express';
import {PostModel} from '../../models/post';
import {
  RESPONSE_INVALID_DATA,
  RESPONSE_SERVER_ERROR,
  RESPONSE_UNAUTHORIZED,
} from '../../constants';
import AppEventEmitter from '../../services/eventEmitter';

const archivePostSchema = z.object({
  postId: z.string(),
});

export const archivePost = withMiddleware(isAuth)(async (
  req: AuthUserRequest,
  res: Response
) => {
  try {
    const {userId} = req.user;

    const validatedData = archivePostSchema.parse(req.body);
    const post = await PostModel.findById(validatedData.postId);

    if (post?.owner.toString() != userId) return RESPONSE_UNAUTHORIZED(res);

    post.status = 'hidden';

    await post.save();

    AppEventEmitter.getInstance().emit('post:archived', {
      postId: post._id.toString(),
      userId: userId,
    });

    return res
      .status(200)
      .json({message: 'Archived the post.', post: post._id});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return RESPONSE_INVALID_DATA(res, error.errors);
    }
    return RESPONSE_SERVER_ERROR(
      res,
      'An error occurred while archiving a post.'
    );
  }
});
