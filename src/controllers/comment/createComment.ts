import {z} from 'zod';
import {withMiddleware} from '../../middleware/withMiddleware';
import {isAuth} from '../../middleware/isAuth';
import {AuthUserRequest} from '../../types';
import {Response} from 'express';
import {RESPONSE_INVALID_DATA, RESPONSE_SERVER_ERROR} from '../../constants';
import {CommentModel} from '../../models/comment';
import AppEventEmitter from '../../services/eventEmitter';

const createCommentSchema = z.object({
  postId: z.string(),
  content: z.string().max(300),
  parentCommentId: z.string().optional(),
});

export const createComment = withMiddleware(isAuth)(async (
  req: AuthUserRequest,
  res: Response
) => {
  try {
    const {userId} = req.user;
    const validatedData = createCommentSchema.parse(req.body);

    const commentData = {
      user: userId,
      post: validatedData.postId,
      content: validatedData.content,
      ...(validatedData.parentCommentId
        ? {parentCommment: validatedData.parentCommentId}
        : {}),
    };

    const comment = await CommentModel.create(commentData);

    AppEventEmitter.getInstance().emit('comment:created', {
      commentId: comment._id,
      userId: userId,
      postId: validatedData.postId,
      parentComment: validatedData.parentCommentId,
      content: validatedData.content,
    });

    return res.status(201).json({message: 'Created.', comment});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return RESPONSE_INVALID_DATA(res, error.errors);
    }

    console.log(error);
    return RESPONSE_SERVER_ERROR(
      res,
      'An error occurred while creating comment.'
    );
  }
});
