import { createGoal } from '../../use-cases/goals/createGoal.js';
import { deleteGoal } from '../../use-cases/goals/deleteGoal.js';
import { getGoalById } from '../../use-cases/goals/getGoalById.js';
import { getGoalsByWorkspaceId } from '../../use-cases/goals/getGoalsByWorkspaceId.js';
import { getGoalWithTargetsAndProgress } from '../../use-cases/goals/getGoalWithTargetsAndProgress.js';
import { updateGoal } from '../../use-cases/goals/updateGoal.js';
import { getProgressHistory } from '../../use-cases/history/getProgressHistory.js';
import { recordProgress } from '../../use-cases/history/recordProgress.js';
import { createTarget } from '../../use-cases/targets/createTarget.js';
import { getTargetsByGoalId } from '../../use-cases/targets/getTargetsByGoalId.js';
import { getTasksByTargetId } from '../../use-cases/targets/getTasksByTargetId.js';
import { linkTaskToTarget } from '../../use-cases/targets/linkTaskToTarget.js';
import { unlinkTaskFromTarget } from '../../use-cases/targets/unlinkTaskFromTarget.js';
import { updateTargetProgress } from '../../use-cases/targets/updateTargetProgress.js';
import {
	createGoalSchema,
	updateGoalSchema,
	createTargetSchema,
	updateTargetProgressSchema,
	recordProgressSchema,
	linkTaskToTargetSchema,
	goalParamsSchema,
	targetParamsSchema,
	workspaceParamsSchema,
	progressHistoryQuerySchema,
} from '../../infrastructure/schemas/goals.schemas.js';
import { deleteTarget } from '../../use-cases/targets/deleteTarget.js';

export default function createGoalsController(repositories) {
	const createGoalUseCase = createGoal(repositories);
	const getGoalByIdUseCase = getGoalById(repositories);
	const getGoalsByWorkspaceIdUseCase = getGoalsByWorkspaceId(repositories);
	const updateGoalUseCase = updateGoal(repositories);
	const deleteGoalUseCase = deleteGoal(repositories);
	const deleteTargetUseCase = deleteTarget(repositories);
	const createTargetUseCase = createTarget(repositories);
	const getTargetsByGoalIdUseCase = getTargetsByGoalId(repositories);
	const updateTargetProgressUseCase = updateTargetProgress(repositories);
	const recordProgressUseCase = recordProgress(repositories);
	const getProgressHistoryUseCase = getProgressHistory(repositories);
	const linkTaskToTargetUseCase = linkTaskToTarget(repositories);
	const unlinkTaskFromTargetUseCase = unlinkTaskFromTarget(repositories);
	const getTasksByTargetIdUseCase = getTasksByTargetId(repositories);
	const getGoalWithTargetsAndProgressUseCase =
		getGoalWithTargetsAndProgress(repositories);

	return {
		async createGoal(req, res) {
			try {
				const { workspaceId } = workspaceParamsSchema.parse(req.params);
				const goalData = createGoalSchema.parse(req.body);
				const userId = req.user.id;

				const data = await createGoalUseCase({
					...goalData,
					workspaceId,
					userId,
				});
				return res.status(201).json({ success: true, data });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al crear el goal',
				});
			}
		},

		async getGoalById(req, res) {
			try {
				const { goalId } = goalParamsSchema.parse(req.params);

				const data = await getGoalByIdUseCase(goalId);
				if (!data) {
					return res.status(404).json({
						success: false,
						message: 'Goal no encontrado',
					});
				}
				return res.status(200).json({ success: true, data });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener el goal',
				});
			}
		},

		async getGoalsByWorkspaceId(req, res) {
			try {
				const { workspaceId } = workspaceParamsSchema.parse(req.params);

				const data = await getGoalsByWorkspaceIdUseCase(workspaceId);
				return res.status(200).json({ success: true, data });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener los goals',
				});
			}
		},

		async updateGoal(req, res) {
			try {
				const { goalId } = goalParamsSchema.parse(req.params);
				const updateData = updateGoalSchema.parse(req.body);
				const userId = req.user.id;

				const data = await updateGoalUseCase({ goalId, updateData, userId });
				if (!data) {
					return res.status(404).json({
						success: false,
						message: 'Goal no encontrado o no se pudo actualizar',
					});
				}
				return res.status(200).json({ success: true, data });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al actualizar el goal',
				});
			}
		},

		async deleteGoal(req, res) {
			try {
				const { goalId } = goalParamsSchema.parse(req.params);

				const data = await deleteGoalUseCase(goalId);
				if (!data) {
					return res.status(404).json({
						success: false,
						message: 'Goal no encontrado o no se pudo eliminar',
					});
				}
				return res
					.status(200)
					.json({ success: true, message: 'Goal eliminado correctamente' });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al eliminar el goal',
				});
			}
		},

		async createTarget(req, res) {
			try {
				const targetData = createTargetSchema.parse(req.body);
				const { workspaceId } = workspaceParamsSchema.parse(req.params);

				const data = await createTargetUseCase({ ...targetData, workspaceId });
				return res.status(201).json({ success: true, data });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al crear el target',
				});
			}
		},

		async getTargetsByGoalId(req, res) {
			try {
				const { goalId } = goalParamsSchema.parse(req.params);

				const data = await getTargetsByGoalIdUseCase(goalId);
				return res.status(200).json({ success: true, data });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener los targets',
				});
			}
		},

		async updateTargetProgress(req, res) {
			try {
				const { targetId } = targetParamsSchema.parse(req.params);
				const { currentValue } = updateTargetProgressSchema.parse(req.body);

				const data = await updateTargetProgressUseCase({
					targetId,
					currentValue,
				});
				if (!data) {
					return res.status(404).json({
						success: false,
						message: 'Target no encontrado o no se pudo actualizar',
					});
				}
				return res.status(200).json({ success: true, data });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message:
						error.message || 'Error al actualizar el progreso del target',
				});
			}
		},

		async deleteTarget(req, res) {
			try {
				const { targetId } = targetParamsSchema.parse(req.params);

				const data = await deleteTargetUseCase(targetId);
				if (!data) {
					return res.status(404).json({
						success: false,
						message: 'Goal no encontrado o no se pudo eliminar',
					});
				}
				return res
					.status(200)
					.json({ success: true, message: 'Goal eliminado correctamente' });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al eliminar el goal',
				});
			}
		},

		async recordProgress(req, res) {
			try {
				const progressData = recordProgressSchema.parse(req.body);
				const userId = req.user.id;

				const data = await recordProgressUseCase({ ...progressData, userId });
				return res.status(201).json({ success: true, data });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al registrar el progreso',
				});
			}
		},

		async getProgressHistory(req, res) {
			try {
				const { goalId } = goalParamsSchema.parse(req.params);
				const { limit } = progressHistoryQuerySchema.parse(req.query);

				const data = await getProgressHistoryUseCase(goalId, limit);
				return res.status(200).json({ success: true, data });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener el historial de progreso',
				});
			}
		},

		async linkTaskToTarget(req, res) {
			try {
				const { targetId, taskId } = linkTaskToTargetSchema.parse(req.params);
				const userId = req.user.id;

				const data = await linkTaskToTargetUseCase({
					targetId,
					taskId,
					userId,
				});
				return res.status(201).json({ success: true, data });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al vincular la task al target',
				});
			}
		},

		async unlinkTaskFromTarget(req, res) {
			try {
				const { targetId, taskId } = targetParamsSchema.parse(req.params);

				const data = await unlinkTaskFromTargetUseCase(targetId, taskId);
				if (!data) {
					return res.status(404).json({
						success: false,
						message: 'Vinculación no encontrada o no se pudo desvincular',
					});
				}
				return res
					.status(200)
					.json({ success: true, message: 'Task desvinculada correctamente' });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al desvincular la task del target',
				});
			}
		},

		async getTasksByTargetId(req, res) {
			try {
				const { targetId } = targetParamsSchema.parse(req.params);

				const data = await getTasksByTargetIdUseCase(targetId);
				return res.status(200).json({ success: true, data });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener las tasks del target',
				});
			}
		},

		async getGoalWithTargetsAndProgress(req, res) {
			try {
				const { goalId } = goalParamsSchema.parse(req.params);

				const data = await getGoalWithTargetsAndProgressUseCase(goalId);
				if (!data) {
					return res.status(404).json({
						success: false,
						message: 'Goal no encontrado',
					});
				}
				return res.status(200).json({ success: true, data });
			} catch (error) {
				return res.status(500).json({
					success: false,
					message:
						error.message || 'Error al obtener el goal con targets y progreso',
				});
			}
		},
	};
}
