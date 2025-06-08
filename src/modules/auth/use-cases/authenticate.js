export default function authenticateUser({ userRepository, compare }) {
	return async function ({ password, email }) {
		try {
			const user = await userRepository.getByEmail(email);
			if (!user) throw new Error('User not found');

			const isMatch = await compare(password, `${user.password}`);
			if (!isMatch) throw new Error('Password does not match');

			return {
				id: user.id,
				username: user.username,
				email: user.email,
				preferences: user.preferences,
			};
		} catch (error) {
			console.log(error);
			throw error;
		}
	};
}
