import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import flash from 'express-flash';
import cors from 'cors';

import { UserRepositoryMemory } from './infrastructure/db/UserRepositoryMemory.js';
import { createUserRouter } from './modules/user/User.routes.js';

const app = express();

dotenv.config();

app.use(
	cors({
		origin: ['http://localhost:5173', 'http://localhost:5174'],
		credentials: true,
	})
);
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(flash());

app.use(
	session({
		secret: SECRET_JWT_KEY,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

app.use('/app', createUserRouter(UserRepositoryMemory));

export default app;
