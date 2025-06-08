import { connect } from './connection.js';

const DEFAUL_PREFERENCES = {
	language: 'en',
	notifications: true,
};

const RETURNING_OBJ = 'HEX(id) AS id, username, email, preferences';

class UserRepositoryClass {
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
			`SELECT HEX(id) AS id, username, email, password, preferences FROM users WHERE email = ?;`,
			[email]
		);
		return parsePreferences(rows[0]);
	}

	async getById(id) {
		const { rows } = await this.connection.execute(
			`SELECT ${RETURNING_OBJ} FROM users WHERE id = UNHEX(?);`,
			[id]
		);
		return parsePreferences(rows[0]);
	}

	async create({ id, username, password, email, createdAt }) {
		const hexId = id.replace(/-/g, '');
		const preferences = JSON.stringify(DEFAUL_PREFERENCES);
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO users(id, username, password, email, preferences) 
                VALUES(UNHEX(?),?,?,?,?)
                RETURNING ${RETURNING_OBJ};`,
				[hexId, username, password, email, preferences]
			);
			return { ...rows[0], preferences: DEFAUL_PREFERENCES };
		} catch (e) {
			console.log(e);
			throw e;
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
			preferences: {},
		};
	}
}

const connection = await connect();
const UserRepository = new UserRepositoryClass(connection);

export default UserRepository;
