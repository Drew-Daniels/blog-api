import express, { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/authRoutes';
import usersRouter from './routes/usersRoutes';
import postsRouter from './routes/postsRoutes';

const app: Express = express();
const PORT = process.env.PORT;

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.listen(PORT, () => {
   console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
