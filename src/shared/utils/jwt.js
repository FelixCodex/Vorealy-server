import { SECRET_JWT_KEY } from '../config.js';
import jwt from 'jsonwebtoken';

export async function createAccessToken(payload) {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ payload },
			SECRET_JWT_KEY,
			{
				expiresIn: '2d',
			},
			(err, token) => {
				if (err) reject(err);
				resolve(token);
			}
		);
	});
}

export async function authenticateUser(req) {
	const { token } = req.cookies;

	if (!token) return { error: ['User not authenticated'], status: 403 };

	return jwt.verify(token, SECRET_JWT_KEY, async (err, user) => {
		if (err) {
			console.log('Something went wrong');
			console.log('Err: ', err);
			return { error: ['User not authenticated from token'], status: 401 };
		}
		if (user.payload.id) {
			return user.payload;
		}
		return { error: ['User not authenticated from token'], status: 401 };
	});
}
