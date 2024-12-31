import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import * as path from 'node:path';
import dotenv from 'dotenv';
import {getAllRoutes} from './appRouter';
import {POSTS_DIR, PROFILE_PICS_DIR, STATIC_DIR} from './constants';

const app = express();
dotenv.config();

app.use(bodyParser.json());

app.use(cors());

app.use(express.urlencoded({extended: true}));

app.use('/images', express.static(POSTS_DIR));
app.use('/images', express.static(PROFILE_PICS_DIR));

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI as string).then(result => {
  getAllRoutes(path.join(__dirname, 'routes')).then(val => {
    app.use(val);
    app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  });
});
