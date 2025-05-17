import crypto from 'node:crypto';

export default function createUser({ userRepository, encrypt }) {
	return async function ({ email, username, password }) {
		const encryptedPass = await encrypt(password);
		const uuid = crypto.randomUUID();

		const user = { id: uuid, username, password: encryptedPass, email };
		const createdUser = await userRepository.create(user);
		return createdUser;
	};
}
