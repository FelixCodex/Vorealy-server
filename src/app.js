import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import flash from 'express-flash';
import cors from 'cors';
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
	connect,
} from './infrastructure/repositories/turso/index.js';
import { configureGoogleStrategy } from './modules/auth/infrastructure/services/googlePassportStrategy.js';
import { createGoogleAuthRouter } from './routes/authGoogle.routes.js';
import { createWorkspaceRouter } from './routes/workspace.routes.js';
import { createWorkspaceMemberRouter } from './routes/workspaceMember.routes.js';
import { createProjectRouter } from './routes/project.routes.js';
import { createFolderRouter } from './routes/folder.routes.js';
import { createListRouter } from './routes/list.routes.js';
import { createTaskRouter } from './routes/task.routes.js';
import { createSubTaskRouter } from './routes/subtask.routes.js';
import { createAuthRouter } from './routes/auth.routes.js';
import { CORS_CONFIG } from './config.js';
import { createRegisterSocketEvents } from './modules/webSocket/application/socket.events.js';

// --- Repository Connection
const connection = connect();
const UserRepository = new UserRepository(connection);
const WorkspaceRepository = new WorkspaceRepository(connection);
const WorkspaceMemberRepository = new WorkspaceMemberRepository(connection);
const ProjectRepository = new ProjectRepository(connection);
const FolderRepository = new FolderRepository(connection);
const ListRepository = new ListRepository(connection);
const TaskRepository = new TaskRepository(connection);
const SubTaskRepository = new SubTaskRepository(connection);

const app = express();

dotenv.config();

// --- Basic Config
app.use(cors(CORS_CONFIG));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(flash());

// --- Google Auth Configuration
const sessionConfig = {
	secret: SECRET_JWT_KEY,
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false },
};
configureGoogleStrategy(passport, {
	userRepository: UserRepository,
	CLIENT_URL,
});
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// --- Routes
app.use('/app', createGoogleAuthRouter({ passport, CLIENT_URL }));
app.use('/app', createAuthRouter(UserRepository));
app.use(
	'/app/workspace/:workspaceId',
	createWorkspaceRouter(WorkspaceRepository)
);
app.use(
	'/app/workspace/:workspaceId',
	createWorkspaceMemberRouter(WorkspaceMemberRepository)
);
app.use('/app/workspace/:workspaceId', createProjectRouter(ProjectRepository));
app.use('/app/workspace/:workspaceId', createFolderRouter(FolderRepository));
app.use('/app/workspace/:workspaceId', createListRouter(ListRepository));
app.use('/app/workspace/:workspaceId', createTaskRouter(TaskRepository));
app.use('/app/workspace/:workspaceId', createSubTaskRouter(SubTaskRepository));

const registerSocketEvents = createRegisterSocketEvents({ UserRepository });

export default { app, registerSocketEvents };
