import { Router } from 'express';
import createChatController from '../modules/chat/interfaces/controllers/chat.controller.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspaceMatch.js';

export const createChatRouter = (
	chatRepository,
	workspaceRepository,
	memberRepository,
	projectRepository,
	folderRepository,
	listRepository
) => {
	const router = Router();

	const chatController = createChatController(
		chatRepository,
		projectRepository,
		folderRepository,
		listRepository
	);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/workspaces/:workspaceId/chat/:id',
		workspacePermissionMiddleware(
			memberRepository,
			['admin', 'member'],
			workspaceRepository
		),
		workspaceMatchMiddleware(chatRepository, 'id', 'getConversationById'),
		chatController.getConversationById
	);

	router.get(
		'/workspaces/:workspaceId/chat/parent/:parentId/:parentType',
		workspacePermissionMiddleware(
			memberRepository,
			['admin', 'member'],
			workspaceRepository
		),
		workspaceMatchMiddleware(
			chatRepository,
			['parentId', 'parentType'],
			'getConversationsByParent'
		),
		chatController.getConversationsByParent
	);

	router.post(
		'/workspaces/:workspaceId/chat',
		workspacePermissionMiddleware(
			memberRepository,
			['admin'],
			workspaceRepository
		),
		chatController.createConversation
	);

	router.put(
		'/workspaces/:workspaceId/chat/:id',
		workspacePermissionMiddleware(
			memberRepository,
			['admin'],
			workspaceRepository
		),
		workspaceMatchMiddleware(chatRepository, 'id', 'getConversationById'),
		chatController.updateConversation
	);

	router.delete(
		'/workspaces/:workspaceId/chat/:id',
		workspacePermissionMiddleware(
			memberRepository,
			['admin'],
			workspaceRepository
		),
		workspaceMatchMiddleware(chatRepository, 'id', 'getConversationById'),
		chatController.updateConversation
	);

	// ------  ------  ------  ------

	router.get(
		'/workspaces/:workspaceId/chat/conversations/:id/messages/search',
		workspacePermissionMiddleware(
			memberRepository,
			['admin'],
			workspaceRepository
		),
		workspaceMatchMiddleware(chatRepository, 'id', 'getConversationById'),
		chatController.searchMessages
	);

	// ------  ------  ------  ------

	router.get(
		'/workspaces/:workspaceId/chat/conversations/:id/messages',
		workspacePermissionMiddleware(
			memberRepository,
			['admin'],
			workspaceRepository
		),
		workspaceMatchMiddleware(chatRepository, 'id', 'getConversationById'),
		chatController.getMessagesByConversation
	);

	router.post(
		'/workspaces/:workspaceId/chat/conversations/:id/messages',
		workspacePermissionMiddleware(
			memberRepository,
			['admin'],
			workspaceRepository
		),
		workspaceMatchMiddleware(chatRepository, 'id', 'getConversationById'),
		chatController.sendMessage
	);

	router.put(
		'/chat/messages/:id',
		workspacePermissionMiddleware(
			memberRepository,
			['admin'],
			workspaceRepository
		),
		chatController.updateMessage
	);

	router.delete(
		'/chat/messages/:id',
		workspacePermissionMiddleware(
			memberRepository,
			['admin'],
			workspaceRepository
		),
		chatController.deleteMessage
	);

	return router;
};
