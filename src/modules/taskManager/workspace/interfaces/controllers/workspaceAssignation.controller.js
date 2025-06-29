import {
	createAssignationSchema,
	deleteAssignationSchema,
	getAssignationsByParentSchema,
	getAssignationsByUserSchema,
	getAssignationsByWorkspaceSchema,
} from '../../infrastructure/schemas/workspaceAssignation.schema';
import createAssignation from '../../use-cases/workspaceAssignation/createAssignation';
import deleteAssignation from '../../use-cases/workspaceAssignation/deleteAssignation';
import getAssignationsByWorkspace from '../../use-cases/workspaceAssignation/getAssignationByWorkspace';
import getAssignationsByParent from '../../use-cases/workspaceAssignation/getAssignationsByParent';
import getAssignationsByUser from '../../use-cases/workspaceAssignation/getAssignationsByUser';

export default function createWorkspaceAssignationController(
	assignationRepo,
	memberRepo
) {
	const createAssignationUseCase = createAssignation(
		assignationRepo,
		memberRepo
	);
	const getAssignationsByWorkspaceUseCase = getAssignationsByWorkspace(
		assignationRepo,
		memberRepo
	);
	const getAssignationsByUserUseCase = getAssignationsByUser(
		assignationRepo,
		memberRepo
	);
	const getAssignationsByParentUseCase = getAssignationsByParent(
		assignationRepo,
		memberRepo
	);
	const deleteAssignationUseCase = deleteAssignation(
		assignationRepo,
		memberRepo
	);

	return {
		async createAssignation(req, res) {
			try {
				const validatedData = req.body;
				const userId = req.user.id;

				const assignation = await createAssignationUseCase({
					...validatedData,
					assignedBy: userId,
				});

				res.status(201).json({
					success: true,
					data: assignation,
					message: 'Asignación creada exitosamente',
				});
			} catch (err) {
				if (err.errors) {
					// Error de validación Zod
					return res.status(400).json({
						success: false,
						message: 'Datos de entrada inválidos',
						errors: err.errors,
					});
				}

				res.status(400).json({
					success: false,
					message: err.message || 'Error al crear la asignación',
				});
			}
		},

		async getAssignationsByWorkspace(req, res) {
			try {
				const { workspaceId } = req.params;
				const { limit, offset } = req.query;

				const validatedData = getAssignationsByWorkspaceSchema.parse({
					workspaceId,
					limit: limit ? parseInt(limit) : undefined,
					offset: offset ? parseInt(offset) : undefined,
				});

				const assignations = await getAssignationsByWorkspaceUseCase(
					validatedData.workspaceId,
					{ limit: validatedData.limit, offset: validatedData.offset }
				);

				res.json({
					success: true,
					data: assignations,
				});
			} catch (err) {
				if (err.errors) {
					return res.status(400).json({
						success: false,
						message: 'Parámetros inválidos',
						errors: err.errors,
					});
				}

				res.status(500).json({
					success: false,
					message: 'Error al obtener asignaciones del workspace',
				});
			}
		},

		async getAssignationsByUser(req, res) {
			try {
				const { userId, workspaceId } = getAssignationsByUserSchema.parse(
					req.params
				);

				const assignations = await getAssignationsByUserUseCase(
					userId,
					workspaceId
				);

				res.json({
					success: true,
					data: assignations,
				});
			} catch (err) {
				if (err.errors) {
					return res.status(400).json({
						success: false,
						message: 'Parámetros inválidos',
						errors: err.errors,
					});
				}

				res.status(500).json({
					success: false,
					message: 'Error al obtener asignaciones del usuario',
				});
			}
		},

		async getAssignationsByParent(req, res) {
			try {
				const { parentType, parentId } = getAssignationsByParentSchema.parse(
					req.params
				);

				const assignations = await getAssignationsByParentUseCase(
					parentType,
					parentId
				);

				res.json({
					success: true,
					data: assignations,
				});
			} catch (err) {
				if (err.errors) {
					return res.status(400).json({
						success: false,
						message: 'Parámetros inválidos',
						errors: err.errors,
					});
				}

				res.status(500).json({
					success: false,
					message: 'Error al obtener asignaciones del elemento',
				});
			}
		},

		async deleteAssignation(req, res) {
			try {
				const { id } = deleteAssignationSchema.parse(req.params);

				const deleted = await deleteAssignationUseCase(id);

				if (!deleted) {
					return res.status(404).json({
						success: false,
						message: 'Asignación no encontrada',
					});
				}

				res.json({
					success: true,
					message: 'Asignación eliminada exitosamente',
				});
			} catch (err) {
				if (err.errors) {
					return res.status(400).json({
						success: false,
						message: 'ID inválido',
						errors: err.errors,
					});
				}

				res.status(400).json({
					success: false,
					message: err.message || 'Error al eliminar la asignación',
				});
			}
		},
	};
}
