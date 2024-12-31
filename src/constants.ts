import * as path from 'node:path';
import {FolderDirs} from './types';

export const PROFILE_PICS_DIR = path.join(__dirname, '../static/profile_pics');
export const POSTS_DIR = path.join(__dirname, '../static/posts');
export const STATIC_DIR = path.join(__dirname, '../static');

export const staticDirs: FolderDirs[] = [
  {
    parent: 'static',
    children: [
      {
        parent: 'posts',
      },
      {
        parent: 'profile_pics',
      },
    ],
  },
];
