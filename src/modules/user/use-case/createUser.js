import User from '../domain/entities/User';

export function createUser(userRepo) {
	return async userData => {
		const user = new User(userData);
		await userRepo.save(user);
		return user;
	};
}
