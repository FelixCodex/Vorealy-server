import crypto from 'node:crypto';

export default function createUser({ userRepository, encrypt }) {
	return async function ({ email, username, password }) {
		try {
			const encryptedPass = await encrypt(password);
			const uuid = crypto.randomUUID();

			const userFound = userRepository.getByEmail(email);
			if (userFound) throw new Error('Usuario encontrado');

			const user = { id: uuid, username, password: encryptedPass, email };
			const createdUser = await userRepository.create(user);
			return createdUser;
		} catch (err) {
			throw err;
		}
	};
}
