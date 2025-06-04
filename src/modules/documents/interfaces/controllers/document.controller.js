import {
	documentIdParamSchema,
	documentParentParamsSchema,
} from '../../infrastructure/schemas/document.schema.js';
import createDocument from '../../use-cases/createDocument.js';
import deleteDocument from '../../use-cases/deleteDocument.js';
import deleteDocumentByParent from '../../use-cases/deleteDocumentByParent.js';
import getAllDocuments from '../../use-cases/getAllDocuments.js';
import getDocumentById from '../../use-cases/getDocumentById.js';
import getDocumentByParent from '../../use-cases/getDocumentsByParent.js';
import updateDocument from '../../use-cases/updateDocument.js';

export default function createDocumentController(docRepo) {
	const getAllDocumentsUC = getAllDocuments(docRepo);
	const getDocumentByIdUC = getDocumentById(docRepo);
	const getDocumentByParentUC = getDocumentByParent(docRepo);
	const createDocumentUC = createDocument(docRepo);
	const updateDocumentUC = updateDocument(docRepo);
	const deleteDocumentUC = deleteDocument(docRepo);
	const deleteDocumentByParentUC = deleteDocumentByParent(docRepo);

	return {
		async getAllDocuments(req, res) {
			try {
				const result = await getAllDocumentsUC();

				if (result) {
					return res.status(200).json({
						success: true,
						data: result,
					});
				}

				return res.status(500).json({
					success: false,
					error: result.error,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					error: error.message,
				});
			}
		},

		async getDocumentById(req, res) {
			try {
				const { id } = documentIdParamSchema.parse(req.params);
				const result = await getDocumentByIdUC(id);

				if (result) {
					return res.status(200).json({
						success: true,
						data: result,
					});
				}

				return res.status(404).json({
					success: false,
					error: result.error,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					error: error.message,
				});
			}
		},

		// GET /documents/parent/:parentType/:parentId - Obtener documentos por elemento padre
		async getDocumentsByParent(req, res) {
			try {
				const { parentType, parentId } = documentParentParamsSchema.parse(
					req.params
				);
				const result = await getDocumentByParentUC(parentType, parentId);

				if (result) {
					return res.status(200).json({
						success: true,
						data: result,
					});
				}

				return res.status(400).json({
					success: false,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					error: error.message,
				});
			}
		},

		// POST /documents - Crear nuevo documento
		async createDocument(req, res) {
			try {
				const { title, content, parent_type, parent_id, created_by } = req.body;

				const result = await createDocumentUC({
					title,
					content,
					parent_type,
					parent_id,
					created_by,
				});

				if (result) {
					return res.status(201).json({
						success: true,
						data: result,
					});
				}

				return res.status(400).json({
					success: false,
					error: result.error,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					error: error.message,
				});
			}
		},

		// PUT /documents/:id - Actualizar documento
		async updateDocument(req, res) {
			try {
				const { id } = documentIdParamSchema.parse(req.params);
				const updateData = req.body;

				const result = await updateDocumentUC(id, updateData);

				if (result) {
					return res.status(200).json({
						success: true,
						data: result.data,
					});
				}

				return res.status(400).json({
					success: false,
					error: result.error,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					error: error.message,
				});
			}
		},

		// DELETE /documents/:id - Eliminar documento (soft delete)
		async deleteDocument(req, res) {
			try {
				const { id } = documentIdParamSchema.parse(req.params);
				const result = await deleteDocumentUC(id);

				if (result) {
					return res.status(200).json({
						success: true,
						data: result,
					});
				}

				return res.status(400).json({
					success: false,
					error: result.error,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					error: error.message,
				});
			}
		},

		async deleteDocumentsByParent(req, res) {
			try {
				const { parentType, parentId } = documentParentParamsSchema.parse(
					req.params
				);
				const result = await deleteDocumentByParentUC(parentType, parentId);

				if (result) {
					return res.status(200).json({
						success: true,
						data: result,
					});
				}

				return res.status(statusCode).json({
					success: false,
					error: result.error,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					error: error.message,
				});
			}
		},
	};
}
