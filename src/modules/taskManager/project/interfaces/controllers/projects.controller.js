import createProject from '../../use-cases/createProject.js';
import deleteProject from '../../use-cases/deleteProject.js';
import deleteProjectsByWorkspaceId from '../../use-cases/deleteProjectsByWorkspaceId.js';
import getAllProjects from '../../use-cases/getAllProjects.js';
import getProjectById from '../../use-cases/getProjectById.js';
import getProjectsByWorkspaceId from '../../use-cases/getProjectsByWorkspaceId.js';
import updateProject from '../../use-cases/updateProject.js';

export default function createProjectController(projectRepository) {
	const getAllProjectsUseCase = getAllProjects(projectRepository);
	const getProjectByIdUseCase = getProjectById(projectRepository);
	const getProjectsByWorkspaceIdUseCase =
		getProjectsByWorkspaceId(projectRepository);
	const createProjectUseCase = createProject(projectRepository);
	const updateProjectUseCase = updateProject(projectRepository);
	const deleteProjectUseCase = deleteProject(projectRepository);
	const deleteProjectsByWorkspaceIdUseCase =
		deleteProjectsByWorkspaceId(projectRepository);

	return {
		async getAllProjects(req, res) {
			try {
				const projects = await getAllProjectsUseCase();
				return res.status(200).json({ success: true, data: projects });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener proyectos',
				});
			}
		},

		async getProjectById(req, res) {
			try {
				const { id } = req.params;
				if (!id) {
					return res.status(400).json({
						success: false,
						message: 'El ID del proyecto es requerido',
					});
				}
				const project = await getProjectByIdUseCase(id);

				return res.status(200).json({ success: true, data: project });
			} catch (error) {
				if (error.message.includes('no encontrado')) {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener proyecto',
				});
			}
		},

		async getProjectsByWorkspaceId(req, res) {
			try {
				const { workspaceId } = req.params;
				if (!workspaceId) {
					return res.status(400).json({
						success: false,
						message: 'El ID del workspace es requerido',
					});
				}

				const projects = await getProjectsByWorkspaceIdUseCase(workspaceId);
				return res.status(200).json({ success: true, data: projects });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener proyectos del workspace',
				});
			}
		},

		async createProject(req, res) {
			try {
				const { workspaceId } = req.params;
				const projectData = req.body;

				if (req.user && req.user.id) {
					projectData.createdBy = req.user.id;
					projectData.updatedBy = req.user.id;
				}

				const newProject = await createProjectUseCase({
					...projectData,
					workspaceId,
				});
				return res.status(201).json({
					success: true,
					data: newProject,
					message: 'Proyecto creado exitosamente',
				});
			} catch (error) {
				return res.status(400).json({
					success: false,
					message: error.message || 'Error al crear proyecto',
				});
			}
		},

		async updateProject(req, res) {
			try {
				const { id } = req.params;
				const projectData = req.body;

				if (req.user && req.user.id) {
					projectData.updatedBy = req.user.id;
				}

				const updatedProject = await updateProjectUseCase(id, projectData);
				return res.status(200).json({
					success: true,
					data: updatedProject,
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
					message: error.message || 'Error al actualizar proyecto',
				});
			}
		},

		async deleteProject(req, res) {
			try {
				const { id } = req.params;
				await deleteProjectUseCase(id);
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
					message: error.message || 'Error al eliminar proyecto',
				});
			}
		},

		async deleteProjectsByWorkspaceId(req, res) {
			try {
				const { workspaceId } = req.params;
				await deleteProjectsByWorkspaceIdUseCase(workspaceId);
				return res.status(200).json({
					success: true,
					message: 'Proyectos del workspace eliminados exitosamente',
				});
			} catch (error) {
				return res.status(400).json({
					success: false,
					message: error.message || 'Error al eliminar proyectos',
				});
			}
		},
	};
}
