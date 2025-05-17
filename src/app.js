import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import flash from 'express-flash';
import cors from 'cors';
import passport from 'passport';

import UserRepository from './infrastructure/repositories/turso/userRepositoryTurso.js';
import { configureGoogleStrategy } from './modules/auth/infrastructure/services/googlePassportStrategy.js';

const app = express();

dotenv.config();
const sessionConfig = {
	secret: SECRET_JWT_KEY,
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false },
};

configureGoogleStrategy(passport, {
	userRepository: UserRepository,
	CLIENT_URL,
});

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

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

export default app;
