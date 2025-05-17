import bcrypt from 'bcryptjs';

export default async function authenticate({ userRepository }) {
	return async function ({ password, email }) {
		const user = userRepository.getByEmail(email);
		if (!user) return new Error('User not found');

		const isMatch = await bcrypt.compare(password, `${user.password}`);
		if (!isMatch) return new Error('Password does not match');

		return {
			id: user.rows[0].id,
			username: user.rows[0].username,
			email: user.rows[0].email,
			preferences: JSON.parse(user.rows[0].preferences),
		};
	};
}
