import { connect } from './connection';

class ProjectRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async getAll() {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(id) AS id, 
          HEX(workspace_id) AS workspace_id, 
          name, 
          description, 
          color, 
          icon, 
          visibility, 
          features_enabled, 
          automation_rules, 
          created_at, 
          HEX(created_by) AS created_by, 
          updated_at, 
          HEX(updated_by) AS updated_by, 
          completed_at, 
          estimated_hours, 
          working_days, 
          working_hours, 
          holidays, 
          tags, 
          metadata 
        FROM projects;`
			);
			return rows;
		} catch (err) {
			console.error('Error en ProjectRepository.getAll:', err);
			throw err;
		}
	}

	async getById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(id) AS id, 
          HEX(workspace_id) AS workspace_id, 
          name, 
          description, 
          color, 
          icon, 
          visibility, 
          features_enabled, 
          automation_rules, 
          created_at, 
          HEX(created_by) AS created_by, 
          updated_at, 
          HEX(updated_by) AS updated_by, 
          completed_at, 
          estimated_hours, 
          working_days, 
          working_hours, 
          holidays, 
          tags, 
          metadata 
        FROM projects 
        WHERE id = UNHEX(?);`,
				[id]
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en ProjectRepository.getById:', err);
			throw err;
		}
	}

	async getByWorkspaceId(workspaceId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(id) AS id, 
          HEX(workspace_id) AS workspace_id, 
          name, 
          description, 
          color, 
          icon, 
          visibility, 
          features_enabled, 
          automation_rules, 
          created_at, 
          HEX(created_by) AS created_by, 
          updated_at, 
          HEX(updated_by) AS updated_by, 
          completed_at, 
          estimated_hours, 
          working_days, 
          working_hours, 
          holidays, 
          tags, 
          metadata 
        FROM projects 
        WHERE workspace_id = UNHEX(?);`,
				[workspaceId]
			);
			return rows;
		} catch (err) {
			console.error('Error en ProjectRepository.getByWorkspaceId:', err);
			throw err;
		}
	}

	async create({
		id,
		workspaceId,
		name,
		description = null,
		color = '#4169E1',
		icon = null,
		visibility = 'workspace',
		featuresEnabled = null,
		automationRules = null,
		createdAt,
		createdBy,
		updatedAt,
		updatedBy = null,
		completedAt = null,
		estimatedHours = null,
		workingDays = null,
		workingHours = null,
		holidays = null,
		tags = null,
		metadata = null,
	}) {
		const hexId = id.replace(/-/g, '');
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO projects(
          id, 
          workspace_id, 
          name, 
          description, 
          color, 
          icon, 
          visibility, 
          features_enabled, 
          automation_rules, 
          created_at, 
          created_by, 
          updated_at, 
          updated_by, 
          completed_at, 
          estimated_hours, 
          working_days, 
          working_hours, 
          holidays, 
          tags, 
          metadata
        ) VALUES(
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
          ?, 
          ?, 
          ?, 
          ?, 
          ?, 
          ?, 
          ?
        ) RETURNING 
          HEX(id) AS id, 
          HEX(workspace_id) AS workspace_id, 
          name, 
          description, 
          color, 
          icon, 
          visibility, 
          features_enabled, 
          automation_rules, 
          created_at, 
          HEX(created_by) AS created_by, 
          updated_at, 
          HEX(updated_by) AS updated_by, 
          completed_at, 
          estimated_hours, 
          working_days, 
          working_hours, 
          holidays, 
          tags, 
          metadata;`,
				[
					hexId,
					workspaceId,
					name,
					description,
					color,
					icon,
					visibility,
					JSON.stringify(featuresEnabled),
					JSON.stringify(automationRules),
					createdAt,
					createdBy,
					updatedAt,
					updatedBy,
					completedAt,
					estimatedHours,
					JSON.stringify(workingDays),
					JSON.stringify(workingHours),
					JSON.stringify(holidays),
					JSON.stringify(tags),
					JSON.stringify(metadata),
				]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en ProjectRepository.create:', err);
			throw err;
		}
	}

	async update({
		id,
		name = null,
		description = null,
		color = null,
		icon = null,
		visibility = null,
		featuresEnabled = null,
		automationRules = null,
		updatedAt,
		updatedBy,
		completedAt = null,
		estimatedHours = null,
		workingDays = null,
		workingHours = null,
		holidays = null,
		tags = null,
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
			if (visibility !== null) {
				updates.push('visibility = ?');
				values.push(visibility);
			}
			if (featuresEnabled !== null) {
				updates.push('features_enabled = ?');
				values.push(JSON.stringify(featuresEnabled));
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
			if (completedAt !== null) {
				updates.push('completed_at = ?');
				values.push(completedAt);
			}
			if (estimatedHours !== null) {
				updates.push('estimated_hours = ?');
				values.push(estimatedHours);
			}
			if (workingDays !== null) {
				updates.push('working_days = ?');
				values.push(JSON.stringify(workingDays));
			}
			if (workingHours !== null) {
				updates.push('working_hours = ?');
				values.push(JSON.stringify(workingHours));
			}
			if (holidays !== null) {
				updates.push('holidays = ?');
				values.push(JSON.stringify(holidays));
			}
			if (tags !== null) {
				updates.push('tags = ?');
				values.push(JSON.stringify(tags));
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
				`UPDATE projects 
         SET ${updates.join(', ')} 
         WHERE id = UNHEX(?) 
         RETURNING 
           HEX(id) AS id, 
           HEX(workspace_id) AS workspace_id, 
           name, 
           description, 
           color, 
           icon, 
           visibility, 
           features_enabled, 
           automation_rules, 
           created_at, 
           HEX(created_by) AS created_by, 
           updated_at, 
           HEX(updated_by) AS updated_by, 
           completed_at, 
           estimated_hours, 
           working_days, 
           working_hours, 
           holidays, 
           tags, 
           metadata;`,
				values
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en ProjectRepository.update:', err);
			throw err;
		}
	}

	async delete(id) {
		try {
			await this.connection.execute(
				`DELETE FROM projects WHERE id = UNHEX(?);`,
				[id]
			);
			return { success: true, message: 'Proyecto eliminado correctamente' };
		} catch (err) {
			console.error('Error en ProjectRepository.delete:', err);
			throw err;
		}
	}

	async deleteByWorkspaceId(workspaceId) {
		try {
			await this.connection.execute(
				`DELETE FROM projects WHERE workspace_id = UNHEX(?);`,
				[workspaceId]
			);
			return { success: true, message: 'Proyectos eliminados correctamente' };
		} catch (err) {
			console.error('Error en ProjectRepository.deleteByWorkspaceId:', err);
			throw err;
		}
	}
}
const ProjectRepository = new ProjectRepositoryClass(connect());
export default ProjectRepository;
