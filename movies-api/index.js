import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usersRouter from './api/users';
import './db';
import defaultErrHandler from './caller/errHandler';
import moviesRouter from './api/movies';   
import authenticate from './authenticate';
import reviewsRouter from './api/reviews';
import recommendationsRouter from './api/recommendations';
import creditsRouter from './api/credits';
import actorsRouter from './api/actor';
import imagesRouter from './api/images';

dotenv.config();

const app = express();
const port = process.env.PORT; 

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/movies', authenticate, moviesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/credits', creditsRouter);
app.use('/api/actors', actorsRouter);
app.use('/api/images', imagesRouter);

app.use(defaultErrHandler);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});
