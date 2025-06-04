import { Router } from 'express';
import { createFormController } from '../modules/workspaces/:workspaceId/forms/interfaces/controllers/form.controller';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired';
import { SECRET_JWT_KEY } from '../config';
import {
	CreateFormInputSchema,
	SubmitFormInputSchema,
	UpdateFormInputSchema,
} from '../modules/forms/infrastructure/schemas/form.schema';

export function createFormRoutes(formRepo, formSubmissionRepo) {
	const router = Router();

	const formsController = createFormController(formRepo, formSubmissionRepo);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/workspaces/:workspaceId/forms/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(formRepo),
		formsController.getForm
	);

	router.get(
		'/workspaces/:workspaceId/forms/:formId/submissions',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(formRepo, 'formId'),
		formsController.getFormSubmissions
	);

	router.get(
		'/workspaces/:workspaceId/forms/projects/:projectId',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(formRepo, 'projectId', 'getByProjectId'),
		formsController.getProjectForms
	);

	router.post(
		'/workspaces/:workspaceId/forms',
		validateSchema(CreateFormInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		formsController.createForm
	);

	router.post(
		'/workspaces/:workspaceId/forms/:formId/submit',
		validateSchema(SubmitFormInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(formRepo, 'formId'),
		formsController.submitForm
	);

	router.put(
		'/workspaces/:workspaceId/forms/:id',
		validateSchema(UpdateFormInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(formRepo),
		formsController.updateForm
	);

	router.delete(
		'/workspaces/:workspaceId/forms/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(formRepo),
		formsController.deleteForm
	);

	return router;
}
