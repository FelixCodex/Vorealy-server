import {
	FormIdParamSchema,
	FormSubmitParamSchema,
	ProjectIdParamSchema,
} from '../../infrastructure/schemas/form.schema';
import createForm from '../../use-cases/createForm';
import deleteFormById from '../../use-cases/deleteFormById';
import getFormById from '../../use-cases/getFormById';
import getFormByProjectId from '../../use-cases/getFormsByProject';
import getFormSubmissions from '../../use-cases/getFormSubmissions';
import submitForm from '../../use-cases/submitForm';
import updateForm from '../../use-cases/updateForm';

export default function createFormController(formRepo, formSubmissionRepo) {
	const createFormUC = createForm(formRepo);
	const getFormByIdUC = getFormById(formRepo);
	const getFormByProjectIdUC = getFormByProjectId(formRepo);
	const getFormSubmissionsUC = getFormSubmissions(formSubmissionRepo);
	const submitFormUC = submitForm(formRepo, formSubmissionRepo);
	const updateFormUC = updateForm(formRepo);
	const deleteFormByIdUC = deleteFormById(formRepo);

	return {
		async createForm(req, res) {
			try {
				const { name, description, elements, projectId } = req.body;
				const createdBy = req.user.id;

				const form = await createFormUC({
					name,
					description,
					elements,
					createdBy,
					projectId,
				});

				res.status(201).json({
					success: true,
					data: form.toJSON(),
				});
			} catch (error) {
				res.status(400).json({
					success: false,
					error: error.message,
				});
			}
		},

		async getForm(req, res) {
			try {
				const { id } = FormIdParamSchema.parse(req.params);
				const form = await getFormByIdUC(id);

				if (!form) {
					return res.status(404).json({
						success: false,
						error: 'Formulario no encontrado',
					});
				}

				res.json({
					success: true,
					data: form.toJSON(),
				});
			} catch (error) {
				res.status(500).json({
					success: false,
					error: error.message,
				});
			}
		},

		async submitForm(req, res) {
			try {
				const { formId } = FormSubmitParamSchema.parse(req.params);
				const { data, taskId } = req.body;
				const submittedBy = req.user.id;

				const submission = await submitFormUC({
					formId,
					data,
					submittedBy,
					taskId,
				});

				res.status(201).json({
					success: true,
					data: submission.toJSON(),
				});
			} catch (error) {
				res.status(400).json({
					success: false,
					error: error.message,
				});
			}
		},

		async getFormSubmissions(req, res) {
			try {
				const { formId } = FormSubmitParamSchema.parse(req.params);
				const submissions = await getFormSubmissionsUC(formId);

				res.json({
					success: true,
					data: submissions.map(s => s.toJSON()),
				});
			} catch (error) {
				res.status(500).json({
					success: false,
					error: error.message,
				});
			}
		},

		async getProjectForms(req, res) {
			try {
				const { projectId } = ProjectIdParamSchema.parse(req.params);
				const forms = await getFormByProjectIdUC(projectId);

				res.json({
					success: true,
					data: forms.map(f => f.toJSON()),
				});
			} catch (error) {
				res.status(500).json({
					success: false,
					error: error.message,
				});
			}
		},

		async updateForm(req, res) {
			try {
				const { id } = FormIdParamSchema.parse(req.params);
				const { name, description, isActive, projectId } = req.body;

				const form = updateFormUC(id, {
					name,
					description,
					isActive,
					projectId,
				});

				res.json({
					success: true,
					data: form.toJSON(),
				});
			} catch (error) {
				res.status(500).json({
					success: false,
					error: error.message,
				});
			}
		},

		async delete(req, res) {
			try {
				const { id } = FormIdParamSchema.parse(req.params);
				await deleteFormByIdUC(id);

				res.json({
					success: true,
				});
			} catch (error) {
				res.status(500).json({
					success: false,
					error: error.message,
				});
			}
		},
	};
}
