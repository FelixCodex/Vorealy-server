import createList from '../../use-cases/createList';
import deleteList from '../../use-cases/deleteList';
import deleteListsByParent from '../../use-cases/deleteListsByParent';
import getAllLists from '../../use-cases/getAllLists';
import getListById from '../../use-cases/getListById';
import getListsByParent from '../../use-cases/getListsByParent';
import updateList from '../../use-cases/updateList';
import getFolderById from '../../../folder/use-cases/getFolderById';
import getProjectById from '../../../project/use-cases/getProjectById';
import getWorkspaceMember from '../../../workspace/use-cases/getWorkspaceMember';

export default function ListController(listRepository, workspaceRepository) {
	const getAllListsUseCase = getAllLists(listRepository);
	const getListByIdUseCase = getListById(listRepository);
	const getListsByParentUseCase = getListsByParent(listRepository);
	const createListUseCase = createList(listRepository);
	const updateListUseCase = updateList(listRepository);
	const deleteListUseCase = deleteList(listRepository);
	const deleteListsByParentUseCase = deleteListsByParent(listRepository);
	const getWorkspaceMemberUseCase = getWorkspaceMember(workspaceRepository);

	return {
		async getAllLists(req, res) {
			try {
				const lists = await getAllListsUseCase();
				return res.status(200).json({ success: true, data: lists });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener listas',
				});
			}
		},

		async getListById(req, res) {
			try {
				const { id } = req.params;
				if (!id) {
					return res.status(400).json({
						success: false,
						message: 'El ID de la lista es requerido',
					});
				}

				const list = await getListByIdUseCase(id);
				return res.status(200).json({ success: true, data: list });
			} catch (error) {
				if (error.message.includes('no encontrada')) {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener lista',
				});
			}
		},

		async getListsByParent(req, res) {
			try {
				const { parentId, parentType } = req.params;

				if (!parentId || !parentType) {
					return res.status(400).json({
						success: false,
						message: 'El ID del padre y el tipo de padre son requeridos',
					});
				}

				const lists = await getListsByParentUseCase(parentId, parentType);
				return res.status(200).json({ success: true, data: lists });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener listas',
				});
			}
		},

		async createList(req, res) {
			try {
				const listData = req.body;
				const { workspaceId } = req.params;

				if (!workspaceId) {
					return res.status(400).json({
						success: false,
						message: 'El ID del workspace es requerido',
					});
				}

				if (req.user && req.user.id) {
					listData.createdBy = req.user.id;
				}

				const newList = await createListUseCase(listData);
				return res.status(201).json({
					success: true,
					data: newList,
					message: 'Lista creada exitosamente',
				});
			} catch (error) {
				return res.status(400).json({
					success: false,
					message: error.message || 'Error al crear lista',
				});
			}
		},

		async updateList(req, res) {
			try {
				const { id, workspaceId } = req.params;
				const listData = req.body;

				if (!workspaceId || !id) {
					return res.status(400).json({
						success: false,
						message: 'El ID del workspace y el ID de la lista son requerido',
					});
				}

				const list = await getListByIdUseCase(id);
				if (list.workspace_id === workspaceId) {
					throw new Error('Esta lista no pertenece al workspace');
				}

				const updatedList = await updateListUseCase(id, listData);
				return res.status(200).json({
					success: true,
					data: updatedList,
					message: 'Lista actualizada exitosamente',
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
					message: error.message || 'Error al actualizar lista',
				});
			}
		},

		async deleteList(req, res) {
			try {
				const { id } = req.params;
				await deleteListUseCase(id);
				return res.status(200).json({
					success: true,
					message: 'Lista eliminada exitosamente',
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
					message: error.message || 'Error al eliminar lista',
				});
			}
		},

		async deleteListsByParent(req, res) {
			try {
				const { parentId, parentType } = req.params;

				if (!parentId || !parentType) {
					return res.status(400).json({
						success: false,
						message: 'El ID del padre y el tipo de padre son requeridos',
					});
				}

				await deleteListsByParentUseCase(parentId, parentType);
				return res.status(200).json({
					success: true,
					message: 'Listas eliminadas exitosamente',
				});
			} catch (error) {
				return res.status(400).json({
					success: false,
					message: error.message || 'Error al eliminar listas',
				});
			}
		},
	};
}
