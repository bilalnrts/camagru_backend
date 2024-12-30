import {Request, Response} from 'express';

export const createPost = async (req: Request, res: Response) => {
  try {
    return res.status(201).json({message: 'success.'});
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({error: 'An error occurred while creating post.'});
  }
};
