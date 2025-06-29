import {
	folderIdParamSchema,
	projectIdParamSchema,
} from '../../infrastructure/schemas/folder.schema.js';
import createFolder from '../../use-cases/createFolder.js';
import deleteFolder from '../../use-cases/deleteFolder.js';
import deleteFoldersByProjectId from '../../use-cases/deleteFoldersByProjectId.js';
import getAllFolders from '../../use-cases/getAllFolders.js';
import getFolderById from '../../use-cases/getFolderById.js';
import getFoldersByProjectId from '../../use-cases/getFoldersByProjectId.js';
import updateFolder from '../../use-cases/updateFolder.js';

export default function createFolderController(
	folderRepository,
	projectRepository
) {
	const getAllFoldersUseCase = getAllFolders(folderRepository);
	const getFolderByIdUseCase = getFolderById(folderRepository);
	const getFoldersByProjectIdUseCase = getFoldersByProjectId(
		folderRepository,
		projectRepository
	);
	const updateFolderUseCase = updateFolder(folderRepository, projectRepository);
	const createFolderUseCase = createFolder(folderRepository, projectRepository);
	const deleteFolderUseCase = deleteFolder(folderRepository);
	const deleteFoldersByProjectIdUseCase =
		deleteFoldersByProjectId(folderRepository);

	return {
		async getAllFolders(req, res) {
			try {
				const folders = await getAllFoldersUseCase();
				return res.status(200).json({ success: true, data: folders });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener carpetas',
				});
			}
		},

		async getFolderById(req, res) {
			try {
				const { id } = folderIdParamSchema.parse(req.params);
				if (!id) {
					return res.status(400).json({
						success: false,
						message: 'El ID de la carpeta es requerido',
					});
				}

				const folder = await getFolderByIdUseCase(id);
				return res.status(200).json({ success: true, data: folder });
			} catch (error) {
				if (error.message.includes('no encontrada')) {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener carpeta',
				});
			}
		},

		async getFoldersByProjectId(req, res) {
			try {
				const { projectId, workspaceId } = projectIdParamSchema.parse(
					req.params
				);
				if (!projectId) {
					return res.status(400).json({
						success: false,
						message: 'El ID del proyecto es requerido',
					});
				}

				const folders = await getFoldersByProjectIdUseCase(
					projectId,
					workspaceId
				);
				return res.status(200).json({ success: true, data: folders });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener carpetas del proyecto',
				});
			}
		},

		async createFolder(req, res) {
			try {
				const { workspaceId } = req.params;
				const folderData = req.body;

				if (req.user && req.user.id) {
					folderData.createdBy = req.user.id;
					folderData.updatedBy = req.user.id;
				}

				const newFolder = await createFolderUseCase({
					...folderData,
					workspaceId,
				});
				return res.status(201).json({
					success: true,
					data: newFolder,
					message: 'Carpeta creada exitosamente',
				});
			} catch (error) {
				return res.status(400).json({
					success: false,
					message: error.message || 'Error al crear carpeta',
				});
			}
		},

		async updateFolder(req, res) {
			try {
				const { id, workspaceId } = req.params;
				const folderData = req.body;

				if (req.user && req.user.id) {
					folderData.updatedBy = req.user.id;
				}

				const updatedFolder = await updateFolderUseCase(
					id,
					workspaceId,
					folderData
				);
				return res.status(200).json({
					success: true,
					data: updatedFolder,
					message: 'Carpeta actualizada exitosamente',
				});
			} catch (error) {
				if (error.message.includes('no encontrada')) {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}
				return res.status(400).json({
					success: false,
					message: error.message || 'Error al actualizar carpeta',
				});
			}
		},

		async deleteFolder(req, res) {
			try {
				const { id } = folderIdParamSchema.parse(req.params);
				await deleteFolderUseCase(id);
				return res.status(200).json({
					success: true,
					message: 'Carpeta eliminada exitosamente',
				});
			} catch (error) {
				if (error.message.includes('no encontrada')) {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}
				return res.status(400).json({
					success: false,
					message: error.message || 'Error al eliminar carpeta',
				});
			}
		},

		async deleteFoldersByProjectId(req, res) {
			try {
				const { projectId } = projectIdParamSchema.parse(req.params);
				await deleteFoldersByProjectIdUseCase(projectId);
				return res.status(200).json({
					success: true,
					message: 'Carpetas del proyecto eliminadas exitosamente',
				});
			} catch (error) {
				return res.status(400).json({
					success: false,
					message: error.message || 'Error al eliminar carpetas',
				});
			}
		},
	};
}
