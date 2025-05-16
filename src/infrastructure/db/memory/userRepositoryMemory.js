const users = [];

export const UserRepositoryMemory = {
	async save(user) {
		user.id = users.length + 1;
		users.push(user);
	},
	async getAll() {
		return users;
	},
};
