const UPDATEABLE_PROPERTIES = ['name', 'icon_id', 'color'];

export default class WorkspaceRepository {
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
				`SELECT HEX(id) AS id, HEX(owner_id) AS owner_id, name, created_at 
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
			return rows[0] || null;
		} catch (err) {
			console.error('Error en WorkspaceRepository.getById:', err);
			throw err;
		}
	}

	async create({ id, name, owner_id, icon_id, color, created_at }) {
		const hexId = id.replace(/-/g, '');
		try {
			const task = await this.connection.execute(
				`INSERT INTO workspaces(id, name, owner_id, icon_id, color, created_at, updated_at) 
                VALUES(UNHEX(?),?,UNHEX(?),?,?,?,?)
                RETURNING HEX(id) AS id, name,HEX (owner_id) owner_id, icon_id, color, created_at, updated_at;`,
				[hexId, name, owner_id, icon_id, color, created_at, created_at]
			);
			return task;
		} catch (e) {
			console.error('Error en WorkspaceRepository.create:', err);
			throw e;
		}
	}

	async update(id, { name = null, icon = null, color = null }) {
		try {
			const updates = [];
			const values = [];

			if (name !== null) {
				updates.push('name = ?');
				values.push(name);
			}
			if (color !== null) {
				updates.push('color = ?');
				values.push(color);
			}
			if (icon !== null) {
				updates.push('icon = ?');
				values.push(icon);
			}
			if (updates.length === 0) {
				return null; // No hay nada que actualizar
			}

			values.push(id);

			const workspace = await db.execute(
				`UPDATE workspaces SET ${updates.join(', ')} WHERE id = UNHEX(?)   
				 RETURNING HEX(id) AS id, name, HEX(owner_id) AS owner_id, created_at;`,
				values
			);
			return workspace;
		} catch (e) {
			console.error('Error en WorkspaceRepository.updatePropertie:', err);
			console.error('Propertie to update: ', property);
			console.error('Value to update: ', value);
			throw e;
		}
	}

	async delete(id) {
		try {
			await connection.execute(`DELETE FROM workspaces WHERE id = UNHEX(?);`, [
				id,
			]);
			return { success: true, message: 'Workspace eliminado correctamente' };
		} catch (e) {
			console.error('Error en WorkspaceRepository.delete:', err);
			throw e;
		}
	}
}
