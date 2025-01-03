import * as path from 'node:path';
import {FolderDirs} from './types';
import {Response} from 'express';

export const PROFILE_PICS_DIR = path.join(__dirname, '../static/profile_pics');
export const POSTS_DIR = path.join(__dirname, '../static/posts');
export const STATIC_DIR = path.join(__dirname, '../static');

export const RESPONSE_UNAUTHORIZED = (res: Response) =>
  res.status(401).json({message: 'Unauthorized.'});

export const RESPONSE_INVALID_DATA = (res: Response, errors?: any) =>
  res.status(400).json({message: 'Invalid data.', errors});

export const RESPONSE_SERVER_ERROR = (res: Response, message: string) =>
  res.status(500).json({message});

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

export const instagramPostCategories = [
  'travel',
  'food',
  'fashion',
  'beauty',
  'fitness',
  'lifestyle',
  'art',
  'photography',
  'music',
  'books',
  'movies',
  'gaming',
  'diy',
  'crafts',
  'quotes',
  'motivation',
  'inspiration',
  'nature',
  'animals',
  'architecture',
  'technology',
  'business',
  'marketing',
  'entrepreneurship',
  'health',
  'wellness',
  'mindfulness',
  'parenting',
  'family',
  'friendship',
  'love',
  'relationships',
  'comedy',
  'memes',
  'events',
  'celebrations',
  'holidays',
  'interiors',
  'gardening',
  'minimalism',
  'vintage',
  'streetstyle',
  'outfits',
  'makeup',
  'hair',
  'skincare',
  'reviews',
  'tutorials',
  'behindthescenes',
];
