import { connect } from './connection';

class FolderRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async getAll() {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(id) AS id, 
          HEX(project_id) AS project_id,
          HEX(workspace_id) AS workspace_id,  
          name, 
          description, 
          color, 
          icon, 
          position, 
          is_private, 
          automation_rules, 
          created_at, 
          HEX(created_by) AS created_by, 
          updated_at, 
          HEX(updated_by) AS updated_by, 
          metadata 
        FROM folders;`
			);
			return rows;
		} catch (err) {
			console.error('Error en FolderRepository.getAll:', err);
			throw err;
		}
	}

	async getById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(id) AS id, 
          HEX(project_id) AS project_id, 
          HEX(workspace_id) AS workspace_id, 
          name, 
          description, 
          color, 
          icon, 
          position, 
          is_private, 
          automation_rules, 
          created_at, 
          HEX(created_by) AS created_by, 
          updated_at, 
          HEX(updated_by) AS updated_by, 
          metadata 
        FROM folders 
        WHERE id = UNHEX(?);`,
				[id]
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en FolderRepository.getById:', err);
			throw err;
		}
	}

	async getByProjectId(projectId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(id) AS id, 
          HEX(project_id) AS project_id, 
          HEX(workspace_id) AS workspace_id, 
          name, 
          description, 
          color, 
          icon, 
          position, 
          is_private, 
          automation_rules, 
          created_at, 
          HEX(created_by) AS created_by, 
          updated_at, 
          HEX(updated_by) AS updated_by, 
          metadata 
        FROM folders 
        WHERE project_id = UNHEX(?) 
        ORDER BY position ASC;`,
				[projectId]
			);
			return rows;
		} catch (err) {
			console.error('Error en FolderRepository.getByProjectId:', err);
			throw err;
		}
	}

	async create({
		id,
		projectId,
		workspaceId,
		name,
		description = null,
		color = '#808080',
		icon = null,
		position = 0,
		isPrivate = false,
		automationRules = null,
		createdAt,
		createdBy,
		updatedAt,
		updatedBy = null,
		metadata = null,
	}) {
		const hexId = id.replace(/-/g, '');
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO folders(
          id, 
          project_id, 
          workspace_id, 
          name, 
          description, 
          color, 
          icon, 
          position, 
          is_private, 
          automation_rules, 
          created_at, 
          created_by, 
          updated_at, 
          updated_by, 
          metadata
        ) VALUES(
          UNHEX(?), 
          UNHEX(?), 
		  UNHEX(?),
          ?, 
          ?, 
          ?, 
          ?, 
          ?, 
          ?, 
          ?, 
          ?, 
          UNHEX(?), 
          ?, 
          UNHEX(?), 
          ?
        ) RETURNING 
          HEX(id) AS id, 
          HEX(project_id) AS project_id, 
          HEX(workspace_id) AS workspace_id, 
          name, 
          description, 
          color, 
          icon, 
          position, 
          is_private, 
          automation_rules, 
          created_at, 
          HEX(created_by) AS created_by, 
          updated_at, 
          HEX(updated_by) AS updated_by, 
          metadata;`,
				[
					hexId,
					projectId,
					workspaceId,
					name,
					description,
					color,
					icon,
					position,
					isPrivate,
					JSON.stringify(automationRules),
					createdAt,
					createdBy,
					updatedAt,
					updatedBy,
					JSON.stringify(metadata),
				]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en FolderRepository.create:', err);
			throw err;
		}
	}

	async update({
		id,
		name = null,
		description = null,
		color = null,
		icon = null,
		position = null,
		isPrivate = null,
		automationRules = null,
		updatedAt,
		updatedBy,
		metadata = null,
	}) {
		try {
			// Construir la consulta SQL dinámicamente
			const updates = [];
			const values = [];

			if (name !== null) {
				updates.push('name = ?');
				values.push(name);
			}
			if (description !== null) {
				updates.push('description = ?');
				values.push(description);
			}
			if (color !== null) {
				updates.push('color = ?');
				values.push(color);
			}
			if (icon !== null) {
				updates.push('icon = ?');
				values.push(icon);
			}
			if (position !== null) {
				updates.push('position = ?');
				values.push(position);
			}
			if (isPrivate !== null) {
				updates.push('is_private = ?');
				values.push(isPrivate);
			}
			if (automationRules !== null) {
				updates.push('automation_rules = ?');
				values.push(JSON.stringify(automationRules));
			}
			if (updatedAt !== null) {
				updates.push('updated_at = ?');
				values.push(updatedAt);
			}
			if (updatedBy !== null) {
				updates.push('updated_by = UNHEX(?)');
				values.push(updatedBy);
			}
			if (metadata !== null) {
				updates.push('metadata = ?');
				values.push(JSON.stringify(metadata));
			}

			if (updates.length === 0) {
				return null; // No hay nada que actualizar
			}

			values.push(id); // Para la condición WHERE id = UNHEX(?)

			const { rows } = await this.connection.execute(
				`UPDATE folders 
         SET ${updates.join(', ')} 
         WHERE id = UNHEX(?) 
         RETURNING 
           HEX(id) AS id, 
           HEX(project_id) AS project_id, 
          HEX(workspace_id) AS workspace_id, 
           name, 
           description, 
           color, 
           icon, 
           position, 
           is_private, 
           automation_rules, 
           created_at, 
           HEX(created_by) AS created_by, 
           updated_at, 
           HEX(updated_by) AS updated_by, 
           metadata;`,
				values
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en FolderRepository.update:', err);
			throw err;
		}
	}

	async delete(id) {
		try {
			await this.connection.execute(
				`DELETE FROM folders WHERE id = UNHEX(?);`,
				[id]
			);
			return { success: true, message: 'Carpeta eliminada correctamente' };
		} catch (err) {
			console.error('Error en FolderRepository.delete:', err);
			throw err;
		}
	}

	async deleteByProjectId(projectId) {
		try {
			await this.connection.execute(
				`DELETE FROM folders WHERE project_id = UNHEX(?);`,
				[projectId]
			);
			return { success: true, message: 'Carpetas eliminadas correctamente' };
		} catch (err) {
			console.error('Error en FolderRepository.deleteByProjectId:', err);
			throw err;
		}
	}
}
const FolderRepository = new FolderRepositoryClass(connect());

export default FolderRepository;
