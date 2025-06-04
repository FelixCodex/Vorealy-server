import { connect } from './connection';

class DocumentRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async getAll() {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, title, content, workspace_id, parent_type, HEX(parent_id) AS parent_id, 
				        HEX(created_by) AS created_by, created_at, updated_at, version, is_deleted 
				 FROM documents 
				 WHERE is_deleted = FALSE;`
			);
			return rows;
		} catch (err) {
			console.error('Error en DocumentRepository.getAll:', err);
			throw err;
		}
	}

	async getByParent(parentType, parentId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, title, content, workspace_id, parent_type, HEX(parent_id) AS parent_id, 
				        HEX(created_by) AS created_by, created_at, updated_at, version, is_deleted 
				 FROM documents 
				 WHERE parent_type = ? AND parent_id = UNHEX(?) AND is_deleted = FALSE;`,
				[parentType, parentId]
			);
			return rows;
		} catch (err) {
			console.error('Error en DocumentRepository.getAllByParent:', err);
			throw err;
		}
	}

	async getById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, title, content, workspace_id, parent_type, HEX(parent_id) AS parent_id, 
				        HEX(created_by) AS created_by, created_at, updated_at, version, is_deleted  
				 FROM documents 
				 WHERE id = UNHEX(?);`,
				[id]
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en DocumentRepository.getById:', err);
			throw err;
		}
	}

	async create(
		id,
		{
			title,
			content = '',
			parentType,
			parentId,
			workspaceId,
			createdBy,
			createdAt,
			updatedAt,
		}
	) {
		const hexId = id.replace(/-/g, '');

		try {
			const document = await this.connection.execute(
				`INSERT INTO documents(id, title, workspace_id, content, parent_type, parent_id, created_by, created_at, updated_at, version, is_deleted)
				 VALUES(UNHEX(?), ?,UNHEX(?), ?, ?,UNHEX(?), UNHEX(?), ?, ?, 1, FALSE)
				 RETURNING HEX(id) AS id, title, content, workspace_id, parent_type, HEX(parent_id) AS parent_id, 
				          HEX(created_by) AS created_by, created_at, updated_at, version, is_deleted;`,
				[
					hexId,
					title,
					workspaceId,
					content,
					parentType,
					parentId,
					createdBy,
					createdAt,
					updatedAt,
				]
			);
			return document;
		} catch (err) {
			console.error('Error en DocumentRepository.create:', err);
			throw err;
		}
	}

	async update(
		id,
		{ title = null, content = null, parent_type = null, parent_id = null }
	) {
		try {
			const updates = [];
			const values = [];

			if (!id) {
				throw new Error('El ID del documento es requerido');
			}

			if (title !== null) {
				updates.push('title = ?');
				values.push(title);
			}

			if (content !== null) {
				updates.push('content = ?');
				values.push(content);
			}

			if (parent_type !== null) {
				updates.push('parent_type = ?');
				values.push(parent_type);
			}

			if (parent_id !== null) {
				updates.push('parent_id = UNHEX(?)');
				const hexParentId = parent_id.replace(/-/g, '');
				values.push(hexParentId);
			}

			if (updates.length === 0) {
				return null;
			}

			updates.push('version = version + 1');
			const now = new Date().toISOString();

			updates.push('updated_at = ?');
			values.push(now);

			values.push(id);

			const document = await this.connection.execute(
				`UPDATE documents SET ${updates.join(', ')} WHERE id = UNHEX(?)
				 RETURNING HEX(id) AS id, title, content, workspace_id, parent_type, HEX(parent_id) AS parent_id, 
				          HEX(created_by) AS created_by, created_at, updated_at, version, is_deleted;`,
				values
			);
			return document;
		} catch (err) {
			console.error('Error en DocumentRepository.update:', err);
			throw err;
		}
	}

	async delete(id) {
		try {
			await this.connection.execute(
				`DELETE FROM documents WHERE id = UNHEX(?);`,
				[id]
			);
			return true;
		} catch (err) {
			console.error('Error en DocumentRepository.delete:', err);
			throw err;
		}
	}

	async deleteByParent(parentType, parentId) {
		try {
			await this.connection.execute(
				`DELETE FROM documents WHERE parent_id = UNHEX(?) AND parent_type = ?;`,
				[parentId, parentType]
			);
			return true;
		} catch (err) {
			console.error('Error en DocumentRepository.deleteByParent:', err);
			throw err;
		}
	}
}

const DocumentRepository = new DocumentRepositoryClass(connect());

export default DocumentRepository;
