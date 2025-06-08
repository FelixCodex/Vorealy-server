import crypto from 'node:crypto';
import { getDateNow } from '../../../shared/utils/utils.js';

export default function createUser({ userRepository, encrypt }) {
	return async function ({ email, username, password }) {
		try {
			const encryptedPass = await encrypt(password);
			const uuid = crypto.randomUUID();

			const userFound = await userRepository.getByEmail(email);
			if (userFound) throw new Error('Usuario encontrado');

			const now = getDateNow();
			const user = {
				id: uuid,
				username,
				password: encryptedPass,
				email,
				createAt: now,
			};
			const createdUser = await userRepository.create(user);
			return createdUser;
		} catch (err) {
			throw err;
		}
	};
}
