import { Router } from 'express';
import createGoalsController from '../modules/goals/interfaces/controllers/goals.controller.js';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspaceMatch.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';
import {
	createGoalSchema,
	createTargetSchema,
	updateGoalSchema,
	updateTargetProgressSchema,
} from '../modules/goals/infrastructure/schemas/goals.schemas.js';

export default function createGoalsRoutes(goalsRepo) {
	const router = Router();

	const goalsController = createGoalsController(goalsRepo);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	// ---- ----

	router.post(
		'/workspaces/:workspaceId/goals',
		workspacePermissionMiddleware(['admin', 'member']),
		validateSchema(createGoalSchema),
		goalsController.createGoal
	);
	router.get(
		'/workspaces/:workspaceId/goals',
		workspacePermissionMiddleware(['admin', 'member']),
		goalsController.getGoalsByWorkspaceId
	);
	router.get(
		'/workspaces/:workspaceId/goals/:goalId',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(goalsRepo, 'goalId', 'getGoalById'),
		goalsController.getGoalById
	);
	router.put(
		'/workspaces/:workspaceId/goals/:goalId',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(goalsRepo, 'goalId', 'getGoalById'),
		validateSchema(updateGoalSchema),
		goalsController.updateGoal
	);
	router.delete(
		'/workspaces/:workspaceId/goals/:goalId',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(goalsRepo, 'goalId', 'getGoalById'),
		goalsController.deleteGoal
	);
	router.get(
		'/workspaces/:workspaceId/goals/:goalId/complete',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(goalsRepo, 'goalId', 'getGoalById'),
		goalsController.getGoalWithTargetsAndProgress
	);

	// ---- ----

	router.get(
		'/workspaces/:workspaceId/goals/:goalId/targets',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(goalsRepo, 'goalId', 'getGoalById'),
		goalsController.getTargetsByGoalId
	);
	router.get(
		'/workspaces/:workspaceId/goals/:goalId/progress',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(goalsRepo, 'goalId', 'getGoalById'),
		goalsController.getProgressHistory
	);
	router.post(
		'/workspaces/:workspaceId/targets',
		workspacePermissionMiddleware(['admin', 'member']),
		validateSchema(createTargetSchema),
		goalsController.createTarget
	);
	router.put(
		'/workspaces/:workspaceId/targets/:targetId/progress',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(goalsRepo, 'targetId', 'getTargetById'),
		validateSchema(updateTargetProgressSchema),
		goalsController.updateTargetProgress
	);
	router.delete(
		'/workspaces/:workspaceId/targets/:targetId/progress',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(goalsRepo, 'targetId', 'getTargetById'),
		goalsController.deleteTarget
	);

	// ---- ----

	router.post(
		'/workspaces/:workspaceId/targets/:targetId/link-task/:taskId',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(goalsRepo, 'targetId', 'getTargetById'),
		goalsController.linkTaskToTarget
	);
	router.put(
		'/workspaces/:workspaceId/targets/:targetId/unlink-task/:taskId',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(goalsRepo, 'targetId', 'getTargetById'),
		goalsController.unlinkTaskFromTarget
	);
	router.get(
		'/workspaces/:workspaceId/targets/:targetId/tasks',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(goalsRepo, 'targetId', 'getTargetById'),
		goalsController.getTasksByTargetId
	);

	return router;
}
