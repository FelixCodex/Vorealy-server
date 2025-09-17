import { connect } from './connection.js';

class WorkspaceRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async getAll() {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) id,HEX (owner_id) owner_id, name, icon_id, color, created_at, updated_at FROM workspaces;`
			);
			return rows;
		} catch (err) {
			console.error('Error en WorkspaceRepository.getAll:', err);
			throw err;
		}
	}

	async getAllByUserId(userId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, HEX(owner_id) AS owner_id, name, created_at, color, icon_id
         	     FROM workspaces 
         		 WHERE owner_id = UNHEX(?);`,
				[userId]
			);
			return rows;
		} catch (err) {
			console.error('Error en WorkspaceRepository.getAllByUserId:', err);
			throw err;
		}
	}

	async getById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) id, HEX (owner_id) owner_id, name, icon_id, color, created_at, updated_at FROM workspaces WHERE id = UNHEX(?);`,
				[id]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en WorkspaceRepository.getById:', err);
			throw err;
		}
	}

	async create({ id, name, owner_id, icon_id, color, created_at }) {
		const hexId = id.replace(/-/g, '');
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO workspaces(id, name, owner_id, icon_id, color, created_at, updated_at) 
                VALUES(UNHEX(?),?,UNHEX(?),?,?,?,?)
                RETURNING HEX(id) AS id, name,HEX (owner_id) owner_id, icon_id, color, created_at, updated_at;`,
				[hexId, name, owner_id, icon_id, color, created_at, created_at]
			);
			return rows[0];
		} catch (e) {
			console.error('Error en WorkspaceRepository.create:', e);
			throw e;
		}
	}

	async update(id, { name = null, icon_id = null, color = null }) {
		try {
			const updates = [];
			const values = [];

			if (!id) {
				throw new Error('El ID del workspace es requerido');
			}
			if (name !== null) {
				updates.push('name = ?');
				values.push(name);
			}
			if (color !== null) {
				updates.push('color = ?');
				values.push(color);
			}
			if (icon_id !== null) {
				updates.push('icon_id = ?');
				values.push(icon_id);
			}
			if (updates.length === 0) {
				return null; // No hay nada que actualizar
			}

			values.push(id);

			const { rows } = await this.connection.execute(
				`UPDATE workspaces SET ${updates.join(', ')} WHERE id = UNHEX(?)   
				 RETURNING HEX(id) id, name, HEX(owner_id) owner_id, created_at;`,
				values
			);
			return rows[0];
		} catch (e) {
			console.error('Error en WorkspaceRepository.update:', e);
			throw e;
		}
	}

	async delete(id) {
		try {
			await this.connection.execute(
				`DELETE FROM workspaces WHERE id = UNHEX(?);`,
				[id]
			);
			return true;
		} catch (e) {
			console.error('Error en WorkspaceRepository.delete:', e);
			throw e;
		}
	}
}

const WorkspaceRepository = new WorkspaceRepositoryClass(await connect());

export default WorkspaceRepository;
