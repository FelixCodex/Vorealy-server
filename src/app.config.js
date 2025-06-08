import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';

import {
	UserRepository,
	WorkspaceRepository,
	WorkspaceMemberRepository,
	ProjectRepository,
	FolderRepository,
	ListRepository,
	TaskRepository,
	SubTaskRepository,
	WorkspaceInvitationRepository,
	NotificationRepository,
} from './infrastructure/repositories/turso/index.js';
import { createGoogleAuthRouter } from './routes/authGoogle.routes.js';
import { createWorkspaceRouter } from './routes/workspace.routes.js';
import { createWorkspaceMemberRouter } from './routes/workspaceMember.routes.js';
import { createProjectRouter } from './routes/project.routes.js';
import { createFolderRouter } from './routes/folder.routes.js';
import { createListRouter } from './routes/list.routes.js';
import { createTaskRouter } from './routes/task.routes.js';
import { createSubTaskRouter } from './routes/subtask.routes.js';
import { createAuthRouter } from './routes/auth.routes.js';
import { createRegisterSocketEvents } from './modules/webSocket/application/socket.events.js';
import { configureGoogleStrategy } from './modules/auth/infrastructure/strategies/googlePassportStrategy.js';
import { SECRET_JWT_KEY, CLIENT_URL } from './config.js';
import { createWorkspaceInvitationRouter } from './routes/workspaceInvitation.routes.js';
import { WorkspaceMemberService } from './modules/taskManager/workspace/interfaces/services/workspaceMember.service.js';
import { NotificationService } from './modules/notifications/interfaces/services/notification.service.js';
import { createNotificationRouter } from './routes/notification.routes.js';

// -----------------------------------

dotenv.config();

// -----------------------------------

// --- Google Auth Configuration
// const sessionConfig = {
// 	secret: SECRET_JWT_KEY,
// 	resave: false,
// 	saveUninitialized: true,
// 	cookie: { secure: false },
// };
// configureGoogleStrategy(passport, {
// 	userRepository: UserRepository,
// 	CLIENT_URL,
// });

export function configurateApp(app) {
	// --- Google Auth Config

	// app.use(session(sessionConfig));
	// app.use(passport.initialize());
	// app.use(passport.session());
	// app.use('/app', createGoogleAuthRouter({ passport, CLIENT_URL }));

	// -----------------------------------

	// --- Services

	const MemeberService = new WorkspaceMemberService(
		WorkspaceMemberRepository,
		WorkspaceRepository
	);
	const Notification_Service = new NotificationService(NotificationRepository);

	// --- Routes
	app.use('/app', createAuthRouter(UserRepository));
	app.use('/app', createWorkspaceRouter(WorkspaceRepository));
	app.use(
		'/app',
		createWorkspaceMemberRouter(WorkspaceRepository, WorkspaceMemberRepository)
	);
	app.use('/app', createProjectRouter(ProjectRepository));
	app.use('/app', createNotificationRouter(NotificationRepository));
	app.use(
		'/app',
		createWorkspaceInvitationRouter(
			WorkspaceInvitationRepository,
			WorkspaceRepository,
			WorkspaceMemberRepository,
			UserRepository,
			MemeberService,
			Notification_Service
		)
	);
	app.use('/app', createFolderRouter(FolderRepository));
	app.use('/app', createListRouter(ListRepository));
	app.use('/app', createTaskRouter(TaskRepository));
	app.use('/app', createSubTaskRouter(SubTaskRepository));
}

// -----------------------------------

// --- WebSockets Events

// ----------------

export const registerSocketEvents = createRegisterSocketEvents({
	UserRepository,
});
