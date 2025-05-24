import dotenv from 'dotenv';

dotenv.config();

export const CORS_CONFIG = {
	origin: [
		'http://localhost:5173',
		'http://localhost:5174',
		'https://modelstore.pages.dev',
		'https://adminmodelstore.pages.dev',
		'https://javierdavid.org',
		'https://javier-david.com',
	],
	credentials: true,
};

export const CLIENT_URL = process.env.CLIENT_URL;

export const SERVER_URL = process.env.SERVER_URL;

export const TURSO_URL = process.env.TURSO_URL;
export const TURSO_AUTH = process.env.TURSO_AUTH;

export const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;

export const TPP_CLIENT_ID = process.env.TPP_CLIENT_ID;
export const TPP_CLIENT_SECRET = process.env.TPP_CLIENT_SECRET;

export const QVAPAY_CLIENT_ID = process.env.QVAPAY_CLIENT_ID;
export const QVAPAY_CLIENT_SECRET = process.env.QVAPAY_CLIENT_SECRET;
