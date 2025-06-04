// ===== DOMINIO =====
// src/domains/documents/entities/Document.js
class Document {
	constructor({
		id,
		title,
		content,
		parentType, // 'project', 'folder', 'list', 'standalone'
		parentId, // null si es standalone
		projectId, // siempre debe tener proyecto padre
		createdBy,
		createdAt,
		updatedAt,
		version = 1,
		isDeleted = false,
	}) {
		this.id = id;
		this.title = title;
		this.content = content;
		this.parentType = parentType;
		this.parentId = parentId;
		this.projectId = projectId;
		this.createdBy = createdBy;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.version = version;
		this.isDeleted = isDeleted;
	}

	static create(data) {
		return new Document({
			...data,
			id: data.id || crypto.randomUUID(),
			createdAt: data.createdAt || new Date(),
			updatedAt: data.updatedAt || new Date(),
		});
	}

	update(data) {
		const updatedData = {
			...this,
			...data,
			updatedAt: new Date(),
			version: this.version + 1,
		};
		return new Document(updatedData);
	}

	isStandalone() {
		return this.parentType === 'standalone';
	}

	belongsToProject(projectId) {
		return this.projectId === projectId;
	}
}

// src/domains/documents/repositories/DocumentRepository.js
class DocumentRepository {
	async save(document) {
		throw new Error('Method must be implemented');
	}

	async findById(id) {
		throw new Error('Method must be implemented');
	}

	async findByParent(parentType, parentId) {
		throw new Error('Method must be implemented');
	}

	async findByProject(projectId) {
		throw new Error('Method must be implemented');
	}

	async findStandaloneByProject(projectId) {
		throw new Error('Method must be implemented');
	}

	async delete(id) {
		throw new Error('Method must be implemented');
	}

	async search(projectId, query) {
		throw new Error('Method must be implemented');
	}
}

// ===== CASOS DE USO =====
// src/domains/documents/usecases/CreateDocumentUseCase.js
class CreateDocumentUseCase {
	constructor(documentRepository, projectRepository) {
		this.documentRepository = documentRepository;
		this.projectRepository = projectRepository;
	}

	async execute({
		title,
		content = '',
		parentType,
		parentId,
		projectId,
		userId,
	}) {
		// Validaciones
		if (!title?.trim()) {
			throw new Error('El título es requerido');
		}

		if (!projectId) {
			throw new Error('El proyecto es requerido');
		}

		// Verificar que el proyecto existe
		const project = await this.projectRepository.findById(projectId);
		if (!project) {
			throw new Error('Proyecto no encontrado');
		}

		// Validar permisos del usuario en el proyecto
		if (!project.hasPermission(userId, 'write')) {
			throw new Error('Sin permisos para crear documentos en este proyecto');
		}

		// Si tiene parent, validar que existe
		if (parentId && parentType !== 'standalone') {
			await this._validateParent(parentType, parentId, projectId);
		}

		const document = Document.create({
			title: title.trim(),
			content,
			parentType: parentType || 'standalone',
			parentId: parentType === 'standalone' ? null : parentId,
			projectId,
			createdBy: userId,
		});

		return await this.documentRepository.save(document);
	}

	async _validateParent(parentType, parentId, projectId) {
		// Aquí validarías según el tipo de padre
		// Ejemplo simplificado
		const parentRepo = this._getParentRepository(parentType);
		const parent = await parentRepo.findById(parentId);

		if (!parent) {
			throw new Error(`${parentType} padre no encontrado`);
		}

		if (parent.projectId !== projectId) {
			throw new Error(`${parentType} no pertenece al proyecto especificado`);
		}
	}

	_getParentRepository(parentType) {
		// Retornar el repositorio apropiado según el tipo
		// Esta lógica dependerá de tu implementación específica
	}
}

// src/domains/documents/usecases/UpdateDocumentUseCase.js
class UpdateDocumentUseCase {
	constructor(documentRepository) {
		this.documentRepository = documentRepository;
	}

	async execute(documentId, updates, userId) {
		const document = await this.documentRepository.findById(documentId);

		if (!document) {
			throw new Error('Documento no encontrado');
		}

		// Validar permisos
		if (!this._hasPermission(document, userId)) {
			throw new Error('Sin permisos para editar este documento');
		}

		const updatedDocument = document.update({
			title: updates.title?.trim() || document.title,
			content: updates.content ?? document.content,
		});

		return await this.documentRepository.save(updatedDocument);
	}

	_hasPermission(document, userId) {
		// Implementar lógica de permisos
		return true; // Simplificado
	}
}

// ===== INFRAESTRUCTURA =====
// src/infrastructure/database/repositories/SQLiteDocumentRepository.js
const Database = require('better-sqlite3');

class SQLiteDocumentRepository extends DocumentRepository {
	constructor(db) {
		super();
		this.db = db;
		this._createTables();
	}

	_createTables() {
		const createDocumentsTable = `
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT DEFAULT '',
        parent_type TEXT CHECK(parent_type IN ('project', 'folder', 'list', 'standalone')),
        parent_id TEXT,
        project_id TEXT NOT NULL,
        created_by TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        version INTEGER DEFAULT 1,
        is_deleted BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (project_id) REFERENCES projects (id),
        FOREIGN KEY (created_by) REFERENCES users (id)
      )
    `;

		const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_documents_project ON documents(project_id);
      CREATE INDEX IF NOT EXISTS idx_documents_parent ON documents(parent_type, parent_id);
      CREATE INDEX IF NOT EXISTS idx_documents_created_by ON documents(created_by);
    `;

		this.db.exec(createDocumentsTable);
		this.db.exec(createIndexes);
	}

	async save(document) {
		const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO documents (
        id, title, content, parent_type, parent_id, project_id,
        created_by, created_at, updated_at, version, is_deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

		stmt.run(
			document.id,
			document.title,
			document.content,
			document.parentType,
			document.parentId,
			document.projectId,
			document.createdBy,
			document.createdAt.toISOString(),
			document.updatedAt.toISOString(),
			document.version,
			document.isDeleted
		);

		return document;
	}

	async findById(id) {
		const stmt = this.db.prepare(`
      SELECT * FROM documents WHERE id = ? AND is_deleted = FALSE
    `);

		const row = stmt.get(id);
		return row ? this._mapRowToDocument(row) : null;
	}

	async findByParent(parentType, parentId) {
		const stmt = this.db.prepare(`
      SELECT * FROM documents 
      WHERE parent_type = ? AND parent_id = ? AND is_deleted = FALSE
      ORDER BY created_at ASC
    `);

		const rows = stmt.all(parentType, parentId);
		return rows.map(row => this._mapRowToDocument(row));
	}

	async findByProject(projectId) {
		const stmt = this.db.prepare(`
      SELECT * FROM documents 
      WHERE project_id = ? AND is_deleted = FALSE
      ORDER BY parent_type, created_at ASC
    `);

		const rows = stmt.all(projectId);
		return rows.map(row => this._mapRowToDocument(row));
	}

	async findStandaloneByProject(projectId) {
		const stmt = this.db.prepare(`
      SELECT * FROM documents 
      WHERE project_id = ? AND parent_type = 'standalone' AND is_deleted = FALSE
      ORDER BY created_at ASC
    `);

		const rows = stmt.all(projectId);
		return rows.map(row => this._mapRowToDocument(row));
	}

	async delete(id) {
		const stmt = this.db.prepare(`
      UPDATE documents SET is_deleted = TRUE, updated_at = ? WHERE id = ?
    `);

		stmt.run(new Date().toISOString(), id);
	}

	async search(projectId, query) {
		const stmt = this.db.prepare(`
      SELECT * FROM documents 
      WHERE project_id = ? 
        AND (title LIKE ? OR content LIKE ?)
        AND is_deleted = FALSE
      ORDER BY created_at DESC
    `);

		const searchTerm = `%${query}%`;
		const rows = stmt.all(projectId, searchTerm, searchTerm);
		return rows.map(row => this._mapRowToDocument(row));
	}

	_mapRowToDocument(row) {
		return new Document({
			id: row.id,
			title: row.title,
			content: row.content,
			parentType: row.parent_type,
			parentId: row.parent_id,
			projectId: row.project_id,
			createdBy: row.created_by,
			createdAt: new Date(row.created_at),
			updatedAt: new Date(row.updated_at),
			version: row.version,
			isDeleted: row.is_deleted,
		});
	}
}

// ===== CONTROLADORES =====
// src/interfaces/http/controllers/DocumentController.js
class DocumentController {
	constructor(
		createDocumentUseCase,
		updateDocumentUseCase,
		documentRepository
	) {
		this.createDocumentUseCase = createDocumentUseCase;
		this.updateDocumentUseCase = updateDocumentUseCase;
		this.documentRepository = documentRepository;
	}

	async create(req, res) {
		try {
			const { title, content, parentType, parentId, projectId } = req.body;
			const userId = req.user.id;

			const document = await this.createDocumentUseCase.execute({
				title,
				content,
				parentType,
				parentId,
				projectId,
				userId,
			});

			res.status(201).json({
				success: true,
				data: document,
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				error: error.message,
			});
		}
	}

	async getByProject(req, res) {
		try {
			const { projectId } = req.params;
			const documents = await this.documentRepository.findByProject(projectId);

			// Organizar documentos por tipo de padre
			const organized = {
				standalone: [],
				byParent: {},
			};

			documents.forEach(doc => {
				if (doc.isStandalone()) {
					organized.standalone.push(doc);
				} else {
					const key = `${doc.parentType}-${doc.parentId}`;
					if (!organized.byParent[key]) {
						organized.byParent[key] = [];
					}
					organized.byParent[key].push(doc);
				}
			});

			res.json({
				success: true,
				data: organized,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				error: error.message,
			});
		}
	}

	async update(req, res) {
		try {
			const { id } = req.params;
			const updates = req.body;
			const userId = req.user.id;

			const document = await this.updateDocumentUseCase.execute(
				id,
				updates,
				userId
			);

			res.json({
				success: true,
				data: document,
			});
		} catch (error) {
			res.status(400).json({
				success: false,
				error: error.message,
			});
		}
	}

	async delete(req, res) {
		try {
			const { id } = req.params;
			await this.documentRepository.delete(id);

			res.json({
				success: true,
				message: 'Documento eliminado correctamente',
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				error: error.message,
			});
		}
	}

	async search(req, res) {
		try {
			const { projectId } = req.params;
			const { q: query } = req.query;

			if (!query) {
				return res.status(400).json({
					success: false,
					error: 'Query de búsqueda requerida',
				});
			}

			const documents = await this.documentRepository.search(projectId, query);

			res.json({
				success: true,
				data: documents,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				error: error.message,
			});
		}
	}
}

// ===== RUTAS =====
// src/interfaces/http/routes/documentRoutes.js
const express = require('express');
const router = express.Router();

// Middleware de autenticación (implementar según tu sistema)
const authenticate = (req, res, next) => {
	// Tu lógica de autenticación
	next();
};

module.exports = documentController => {
	router.use(authenticate);

	// Crear documento
	router.post('/', documentController.create.bind(documentController));

	// Obtener documentos por proyecto
	router.get(
		'/project/:projectId',
		documentController.getByProject.bind(documentController)
	);

	// Buscar documentos
	router.get(
		'/project/:projectId/search',
		documentController.search.bind(documentController)
	);

	// Obtener documento específico
	router.get('/:id', async (req, res) => {
		try {
			const document = await documentController.documentRepository.findById(
				req.params.id
			);
			if (!document) {
				return res.status(404).json({
					success: false,
					error: 'Documento no encontrado',
				});
			}
			res.json({ success: true, data: document });
		} catch (error) {
			res.status(500).json({ success: false, error: error.message });
		}
	});

	// Actualizar documento
	router.put('/:id', documentController.update.bind(documentController));

	// Eliminar documento
	router.delete('/:id', documentController.delete.bind(documentController));

	return router;
};

// ===== CONFIGURACIÓN E INYECCIÓN DE DEPENDENCIAS =====
// src/config/dependencies/documentDependencies.js
const SQLiteDocumentRepository = require('../../infrastructure/database/repositories/SQLiteDocumentRepository');
const CreateDocumentUseCase = require('../../domains/documents/usecases/CreateDocumentUseCase');
const UpdateDocumentUseCase = require('../../domains/documents/usecases/UpdateDocumentUseCase');
const DocumentController = require('../../interfaces/http/controllers/DocumentController');

function setupDocumentDependencies(db, projectRepository) {
	// Repositorio
	const documentRepository = new SQLiteDocumentRepository(db);

	// Casos de uso
	const createDocumentUseCase = new CreateDocumentUseCase(
		documentRepository,
		projectRepository
	);
	const updateDocumentUseCase = new UpdateDocumentUseCase(documentRepository);

	// Controlador
	const documentController = new DocumentController(
		createDocumentUseCase,
		updateDocumentUseCase,
		documentRepository
	);

	return {
		documentRepository,
		createDocumentUseCase,
		updateDocumentUseCase,
		documentController,
	};
}

module.exports = { setupDocumentDependencies };
