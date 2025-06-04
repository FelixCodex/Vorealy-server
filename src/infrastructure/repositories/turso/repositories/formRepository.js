import { connect } from './connection';

class FormRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async getById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, name, description, elements, is_active, 
                HEX(workspace_id) AS workspace_id, project_id, HEX(created_by) AS created_by, 
                created_at, updated_at, version
         FROM forms 
         WHERE id = UNHEX(?);`,
				[id]
			);

			if (!rows[0]) return null;

			const row = rows[0];
			return new Form({
				id: row.id,
				name: row.name,
				description: row.description,
				elements: JSON.parse(row.elements),
				isActive: row.is_active === 1,
				workspaceId: row.workspace_id,
				projectId: row.project_id,
				createdBy: row.created_by,
				createdAt: new Date(row.created_at),
				updatedAt: new Date(row.updated_at),
			});
		} catch (err) {
			console.error('Error en FormRepository.getById:', err);
			throw err;
		}
	}

	async create(form) {
		const hexId = form.id.replace(/-/g, '');

		try {
			const result = await this.connection.execute(
				`INSERT INTO forms(id, name, description, elements, is_active, workspace_id, project_id, created_by, created_at, updated_at, version)
         VALUES(UNHEX(?), ?, ?, ?, ?, UNHEX(?), ?, UNHEX(?), ?, ?, 1)
         RETURNING HEX(id) AS id, name, description, elements, is_active, 
                   HEX(workspace_id) AS workspace_id, project_id, HEX(created_by) AS created_by, 
                   created_at, updated_at, version;`,
				[
					hexId,
					form.name,
					form.description,
					JSON.stringify(form.elements),
					form.isActive ? 1 : 0,
					form.workspaceId,
					form.projectId,
					form.createdBy,
					form.createdAt.toISOString(),
					form.updatedAt.toISOString(),
				]
			);
			return result;
		} catch (err) {
			console.error('Error en FormRepository.create:', err);
			throw err;
		}
	}

	async update(
		id,
		{ name = null, description = null, isActive = null, projectId = null }
	) {
		try {
			const updates = [];
			const values = [];

			if (!id) {
				throw new Error('El ID del formulario es requerido');
			}

			if (name !== null) {
				updates.push('name = ?');
				values.push(name);
			}

			if (description !== null) {
				updates.push('description = ?');
				values.push(description);
			}

			if (isActive !== null) {
				updates.push('is_active = ?');
				values.push(isActive ? 1 : 0);
			}

			if (projectId !== null) {
				updates.push('project_id = ?');
				values.push(projectId);
			}

			if (updates.length === 0) {
				return null;
			}

			updates.push('version = version + 1');
			const now = new Date().toISOString();

			updates.push('updated_at = ?');
			values.push(now);

			values.push(id);

			const result = await this.connection.execute(
				`UPDATE forms SET ${updates.join(', ')} WHERE id = UNHEX(?)
         RETURNING HEX(id) AS id, name, description, elements, is_active, 
                   HEX(workspace_id) AS workspace_id, project_id, HEX(created_by) AS created_by, 
                   created_at, updated_at, version;`,
				values
			);
			return result;
		} catch (err) {
			console.error('Error en FormRepository.update:', err);
			throw err;
		}
	}

	async getByProjectId(projectId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, name, description, elements, is_active, 
                HEX(workspace_id) AS workspace_id, project_id, HEX(created_by) AS created_by, 
                created_at, updated_at, version
         FROM forms 
         WHERE project_id = ? AND is_active = 1 
         ORDER BY created_at DESC;`,
				[projectId]
			);

			return rows.map(
				row =>
					new Form({
						id: row.id,
						name: row.name,
						description: row.description,
						elements: JSON.parse(row.elements),
						isActive: row.is_active === 1,
						workspaceId: row.workspace_id,
						projectId: row.project_id,
						createdBy: row.created_by,
						createdAt: new Date(row.created_at),
						updatedAt: new Date(row.updated_at),
					})
			);
		} catch (err) {
			console.error('Error en FormRepository.getByProjectId:', err);
			throw err;
		}
	}

	async getByWorkspaceId(workspaceId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, name, description, elements, is_active, 
                HEX(workspace_id) AS workspace_id, project_id, HEX(created_by) AS created_by, 
                created_at, updated_at, version
         FROM forms 
         WHERE workspace_id = UNHEX(?) AND is_active = 1 
         ORDER BY created_at DESC;`,
				[workspaceId]
			);

			return rows.map(
				row =>
					new Form({
						id: row.id,
						name: row.name,
						description: row.description,
						elements: JSON.parse(row.elements),
						isActive: row.is_active === 1,
						workspaceId: row.workspace_id,
						projectId: row.project_id,
						createdBy: row.created_by,
						createdAt: new Date(row.created_at),
						updatedAt: new Date(row.updated_at),
					})
			);
		} catch (err) {
			console.error('Error en FormRepository.getByWorkspaceId:', err);
			throw err;
		}
	}

	async delete(id) {
		try {
			const result = await this.connection.execute(
				'UPDATE forms SET is_active = 0, version = version + 1 WHERE id = UNHEX(?)',
				[id]
			);
			return result;
		} catch (err) {
			console.error('Error en FormRepository.delete:', err);
			throw err;
		}
	}
}

const FormRepository = new FormRepositoryClass(connect());

export default FormRepository;
