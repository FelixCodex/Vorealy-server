import createTask from '../../use-cases/createTask.js';
import deleteTask from '../../use-cases/deleteTask.js';
import deleteTasksByListId from '../../use-cases/deleteTasksByListId.js';
import getAllTasks from '../../use-cases/getAllTasks.js';
import getTaskById from '../../use-cases/getTaskById.js';
import getTasksByListId from '../../use-cases/getTasksByListId.js';
import updateTask from '../../use-cases/updateTask.js';

export default function createTaskController(taskRepository) {
	const getAllTasksUseCase = getAllTasks(taskRepository);
	const getTaskByIdUseCase = getTaskById(taskRepository);
	const getTasksByListIdUseCase = getTasksByListId(taskRepository);
	const createTaskUseCase = createTask(taskRepository);
	const updateTaskUseCase = updateTask(taskRepository);
	const deleteTaskUseCase = deleteTask(taskRepository);
	const deleteTasksByListIdUseCase = deleteTasksByListId(taskRepository);

	return {
		async getAllTasks(req, res) {
			try {
				const tasks = await getAllTasksUseCase();
				return res.status(200).json({ success: true, data: tasks });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener tareas',
				});
			}
		},

		async getTaskById(req, res) {
			try {
				const { id } = req.params;
				if (!id) {
					return res.status(400).json({
						success: false,
						message: 'El ID de la tarea es requerido',
					});
				}

				const task = await getTaskByIdUseCase(id);
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

		async getTasksByListId(req, res) {
			try {
				const { listId } = req.params;
				if (!listId) {
					return res.status(400).json({
						success: false,
						message: 'El ID de la lista es requerido',
					});
				}

				const tasks = await getTasksByListIdUseCase(listId);
				return res.status(200).json({ success: true, data: tasks });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener tareas de la lista',
				});
			}
		},

		async createTask(req, res) {
			try {
				const { workspaceId } = req.params;
				const taskData = req.body;

				if (req.user && req.user.id) {
					taskData.createdBy = req.user.id;
					taskData.updatedBy = req.user.id;
				}

				const newTask = await createTaskUseCase({ ...taskData, workspaceId });
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

		async updateTask(req, res) {
			try {
				const { id } = req.params;
				const taskData = req.body;

				if (req.user && req.user.id) {
					taskData.updatedBy = req.user.id;
				}

				const updatedTask = await updateTaskUseCase(id, taskData);
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

		async deleteTask(req, res) {
			try {
				const { id } = req.params;
				await deleteTaskUseCase(id);
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

		async deleteTasksByListId(req, res) {
			try {
				const { listId } = req.params;
				await deleteTasksByListIdUseCase(listId);
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
