import createTask from '../../use-cases/createSubTask';
import deleteTask from '../../use-cases/deleteSubTask';
import deleteTasksByTaskId from '../../use-cases/deleteSubTasksByTaskId';
import getAllTasks from '../../use-cases/getAllSubTasks';
import getTaskById from '../../use-cases/getSubTaskById';
import getTasksByTaskId from '../../use-cases/getSubTasksByTaskId';
import updateTask from '../../use-cases/updateSubTask';

export default function createSubTaskController(subtaskRepository) {
	const getAllSubTasksUseCase = getAllTasks(subtaskRepository);
	const getSubTaskByIdUseCase = getTaskById(subtaskRepository);
	const getSubTasksByTaskIdUseCase = getTasksByTaskId(subtaskRepository);
	const createSubTaskUseCase = createTask(subtaskRepository);
	const updateSubTaskUseCase = updateTask(subtaskRepository);
	const deleteSubTaskUseCase = deleteTask(subtaskRepository);
	const deleteSubTasksByTaskIdUseCase = deleteTasksByTaskId(subtaskRepository);

	return {
		async getAllSubTasks(req, res) {
			try {
				const tasks = await getAllSubTasksUseCase();
				return res.status(200).json({ success: true, data: tasks });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener tareas',
				});
			}
		},

		async getSubTaskById(req, res) {
			try {
				const { id } = req.params;
				if (!id) {
					return res.status(400).json({
						success: false,
						message: 'El ID de la tarea es requerido',
					});
				}

				const task = await getSubTaskByIdUseCase(id);
				return res.status(200).json({ success: true, data: task });
			} catch (error) {
				if (error.message.includes('no encontrado')) {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener tarea',
				});
			}
		},

		async getSubTasksByTaskId(req, res) {
			try {
				const { listId } = req.params;
				if (!listId) {
					return res.status(400).json({
						success: false,
						message: 'El ID de la lista es requerido',
					});
				}

				const tasks = await getSubTasksByTaskIdUseCase(listId);
				return res.status(200).json({ success: true, data: tasks });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener tareas de la lista',
				});
			}
		},

		async createSubTask(req, res) {
			try {
				const { workspaceId } = req.params;
				const taskData = req.body;

				if (req.user && req.user.id) {
					taskData.createdBy = req.user.id;
					taskData.updatedBy = req.user.id;
				}

				const newTask = await createSubTaskUseCase({
					...taskData,
					workspaceId,
				});
				return res.status(201).json({
					success: true,
					data: newTask,
					message: 'Tarea creada exitosamente',
				});
			} catch (error) {
				return res.status(400).json({
					success: false,
					message: error.message || 'Error al crear tarea',
				});
			}
		},

		async updateSubTask(req, res) {
			try {
				const { id } = req.params;
				const taskData = req.body;

				if (req.user && req.user.id) {
					taskData.updatedBy = req.user.id;
				}

				const updatedTask = await updateSubTaskUseCase(id, taskData);
				return res.status(200).json({
					success: true,
					data: updatedTask,
					message: 'Proyecto actualizado exitosamente',
				});
			} catch (error) {
				if (error.message.includes('no encontrado')) {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}
				return res.status(400).json({
					success: false,
					message: error.message || 'Error al actualizar tarea',
				});
			}
		},

		async deleteSubTask(req, res) {
			try {
				const { id } = req.params;
				await deleteSubTaskUseCase(id);
				return res.status(200).json({
					success: true,
					message: 'Proyecto eliminado exitosamente',
				});
			} catch (error) {
				if (error.message.includes('no encontrado')) {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}
				return res.status(400).json({
					success: false,
					message: error.message || 'Error al eliminar tarea',
				});
			}
		},

		async deleteSubTasksByTaskId(req, res) {
			try {
				const { listId } = req.params;
				await deleteSubTasksByTaskIdUseCase(listId);
				return res.status(200).json({
					success: true,
					message: 'Tareas de la lista eliminadas exitosamente',
				});
			} catch (error) {
				return res.status(400).json({
					success: false,
					message: error.message || 'Error al eliminar tareas',
				});
			}
		},
	};
}
