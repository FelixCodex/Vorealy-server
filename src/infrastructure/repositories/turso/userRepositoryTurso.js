const DEFAUL_PREFERENCES = {
	language: 'en',
	notifications: true,
};

export default class UserRepository {
	constructor(connection) {
		this.connection = connection;
	}

	async getAll() {
		const { rows } = await this.connection.execute(
			'SELECT HEX(id) id, username, email, preferences, created_at FROM users'
		);
		return parsePreferences(rows[0]);
	}

	async getByEmail(email) {
		const { rows } = await this.connection.execute(
			'SELECT HEX(id) id, username, email, preferences FROM users WHERE email = ?;',
			[email]
		);
		return parsePreferences(rows[0]);
	}

	async getById(id) {
		const { rows } = await this.connection.execute(
			'SELECT HEX(id) id, username, email, preferences FROM users WHERE id = UNHEX(?);',
			[id]
		);
		return parsePreferences(rows[0]);
	}

	async create({ id, username, password, email }) {
		try {
			const user = await this.connection.execute(
				`INSERT INTO users(id, username, password, email, preferences) 
                VALUES(UNHEX(REPLACE("${id}", "-","")),?,?,?,?)
                RETURNING HEX(id) AS id, username, email, preferences;`,
				[username, password, email, JSON.stringify(DEFAUL_PREFERENCES)]
			);
			console.log('User created successfully, sending back response');
			return { ...user, preferences: JSON.parse(user.preferences) };
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async updatePreferences({ preferences, id }) {
		await connection.execute(
			'UPDATE users SET preferences=? WHERE id = UNHEX(?);',
			[preferences, id]
		);
		return { message: 'OK' };
	}

	async delete(id) {
		try {
			await connection.execute(`DELETE FROM comments WHERE id = UNHEX(?);`, [
				id,
			]);
			return { message: 'OK' };
		} catch (e) {
			console.log(e);
			return null;
		}
	}
}

function parsePreferences(user) {
	if (!user) return null;
	try {
		return {
			...user,
			preferences: JSON.parse(user.preferences ?? '{}'),
		};
	} catch (e) {
		console.error('Failed to parse preferences: ', e);
		return {
			...user,
			preferences: {}, // valor por defecto en caso de error
		};
	}
}
