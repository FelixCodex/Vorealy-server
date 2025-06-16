import { Router } from 'express';
import createGoalsController from '../modules/goals/interfaces/controllers/goals.controller';

export default function createGoalsRoutes(goalsRepo) {
	const router = Router();

	const goalsController = createGoalsController(repositories);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	// Goals routes
	router.post(
		'/workspaces/:workspaceId/goals',
		workspacePermissionMiddleware(['admin', 'member']),
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
		goalsController.createTarget
	);
	router.put(
		'/workspaces/:workspaceId/targets/:targetId/progress',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(goalsRepo, 'targetId', 'getTargetById'),
		goalsController.updateTargetProgress
	);
	router.delete(
		'/workspaces/:workspaceId/targets/:targetId/progress',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(goalsRepo, 'targetId', 'getTargetById'),
		goalsController.deleteTarget
	);

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
