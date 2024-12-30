import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import * as path from "node:path";
import dotenv from "dotenv";
import { getAllRoutes } from './appRouter';

const app = express();
dotenv.config();


app.use(bodyParser.json());

app.use(cors());

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI as string).then(result => {
    console.log("mongouri: ", process.env.MONGO_URI);
    getAllRoutes(path.join(__dirname, "routes")).then(val => {
        app.use(val);
        app.listen(PORT, () => console.log(`Running on port ${PORT}`));
    })
})
