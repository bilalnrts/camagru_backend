import multer from 'multer';
import {POSTS_DIR} from '../constants';
import {v4 as uuidv4} from 'uuid';
import {Request} from 'express';

class MulterService {
  static postFileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, POSTS_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueFileName = `${uuidv4()}-${file.originalname}`;
      cb(null, uniqueFileName);
    },
  });

  static postFileFilter(
    req: Request,
    file: any,
    cb: (param1: null, param2: boolean) => any
  ) {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
}

export default MulterService;
