import express, { Express } from 'express';
import dotenv from 'dotenv';
import expander from 'dotenv-expand'
import logger from 'morgan';

var env = dotenv.config();
expander.expand(env);

var app: Express = express();
var PORT = process.env['PORT'];

import './mongoConfig';

import passport from './passportConfig';

import authRouter from './routes/authRoutes';
import usersRouter from './routes/usersRoutes';
import postsRouter from './routes/postsRoutes';

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/api/auth', authRouter);
app.use('/api/users', passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/api/posts', passport.authenticate('jwt', { session: false }), postsRouter);

app.listen(PORT, () => {
   console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
