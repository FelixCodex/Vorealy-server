import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../../../config.js';

export async function asignAccessToken(res, config, payload) {
	const token = await createAccessToken(payload);
	res.cookie('token', token, config);
}

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

export async function validateToken(req) {
	const { token } = req.cookies;
	if (!token) return new Error('User not authenticated');

	return jwt.verify(token, SECRET_JWT_KEY, async (err, user) => {
		if (err) {
			console.log('Error validating token: ', err);
			return new Error('User not authenticated from token');
		}
		return user.payload ?? new Error('User not authenticated from token');
	});
}
