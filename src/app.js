import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import flash from 'express-flash';
import cors from 'cors';
import { CORS_CONFIG } from './config.js';

const app = express();

dotenv.config();

// --- Basic Config
app.use(cors(CORS_CONFIG));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(flash());

export default app;
