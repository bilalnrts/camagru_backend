import {Response} from 'express';
import {AuthUserRequest} from '../../types';
import {withMiddleware} from '../../middleware/withMiddleware';
import {isAuth} from '../../middleware/isAuth';

export const createPost = withMiddleware(isAuth)(async (
  req: AuthUserRequest,
  res: Response
) => {
  // Burada req.user kesinlikle var
  const {userId, username} = req.user;

  console.log(userId, username);

  return res.status(200).json({message: 'success'});
});
