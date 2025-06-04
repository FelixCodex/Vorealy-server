// ===== CONTROLADORES =====
// src/interfaces/controllers/FormsController.js
class FormsController {
	constructor(
		createFormUseCase,
		submitFormUseCase,
		formRepository,
		formSubmissionRepository
	) {
		this.createFormUseCase = createFormUseCase;
		this.submitFormUseCase = submitFormUseCase;
		this.formRepository = formRepository;
		this.formSubmissionRepository = formSubmissionRepository;
	}

	async createForm(req, res) {
		try {
			const { name, description, elements, projectId, workspaceId } = req.body;
			const createdBy = req.user.id;

			const form = await this.createFormUseCase.execute({
				name,
				description,
				elements,
				createdBy,
				projectId,
				workspaceId,
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
	}

	async getForm(req, res) {
		try {
			const { id } = req.params;
			const form = await this.formRepository.getById(id);

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
	}

	async submitForm(req, res) {
		try {
			const { formId } = req.params;
			const { data } = req.body;
			const submittedBy = req.user.id;

			const submission = await this.submitFormUseCase.execute({
				formId,
				data,
				submittedBy,
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
	}

	async getFormSubmissions(req, res) {
		try {
			const { formId } = req.params;
			const submissions = await this.formSubmissionRepository.getByFormId(
				formId
			);

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
	}

	async getProjectForms(req, res) {
		try {
			const { projectId } = req.params;
			const forms = await this.formRepository.getByProjectId(projectId);

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
	}

	async getWorkspaceForms(req, res) {
		try {
			const { workspaceId } = req.params;
			const forms = await this.formRepository.getByWorkspaceId(workspaceId);

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
	}

	async updateForm(req, res) {
		try {
			const { id } = req.params;
			const updates = req.body;

			const result = await this.formRepository.update(id, updates);

			if (!result) {
				return res.status(404).json({
					success: false,
					error: 'Formulario no encontrado o sin cambios',
				});
			}

			res.json({
				success: true,
				data: result,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				error: error.message,
			});
		}
	}

	async deleteForm(req, res) {
		try {
			const { id } = req.params;
			await this.formRepository.delete(id);

			res.json({
				success: true,
				message: 'Formulario eliminado correctamente',
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				error: error.message,
			});
		}
	}
} // ===== DOMINIO =====
// src/domain/entities/FormElement.js
class FormElement {
	constructor({
		id,
		type,
		label,
		required = false,
		placeholder = '',
		options = [],
		validation = {},
		order = 0,
		metadata = {},
	}) {
		this.id = id;
		this.type = type;
		this.label = label;
		this.required = required;
		this.placeholder = placeholder;
		this.options = options;
		this.validation = validation;
		this.order = order;
		this.metadata = metadata;
	}

	static TYPES = {
		TEXT: 'text',
		EMAIL: 'email',
		NUMBER: 'number',
		TEXTAREA: 'textarea',
		SELECT: 'select',
		CHECKBOX: 'checkbox',
		RADIO: 'radio',
		DATE: 'date',
		FILE: 'file',
		MULTISELECT: 'multiselect',
	};

	validate(value) {
		if (this.required && (!value || value === '')) {
			return { isValid: false, error: `${this.label} es requerido` };
		}

		if (this.validation.minLength && value.length < this.validation.minLength) {
			return {
				isValid: false,
				error: `${this.label} debe tener al menos ${this.validation.minLength} caracteres`,
			};
		}

		if (this.validation.maxLength && value.length > this.validation.maxLength) {
			return {
				isValid: false,
				error: `${this.label} no puede tener más de ${this.validation.maxLength} caracteres`,
			};
		}

		if (
			this.validation.pattern &&
			!new RegExp(this.validation.pattern).test(value)
		) {
			return {
				isValid: false,
				error:
					this.validation.patternMessage ||
					`${this.label} tiene formato inválido`,
			};
		}

		return { isValid: true };
	}
}

// src/domain/entities/Form.js
class Form {
	constructor({
		id,
		name,
		description = '',
		elements = [],
		isActive = true,
		createdAt = new Date(),
		updatedAt = new Date(),
		createdBy,
		projectId,
		workspaceId,
	}) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.elements = elements.map(el => new FormElement(el));
		this.isActive = isActive;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.createdBy = createdBy;
		this.projectId = projectId;
		this.workspaceId = workspaceId;
	}

	addElement(element) {
		this.elements.push(new FormElement(element));
		this.updateTimestamp();
	}

	removeElement(elementId) {
		this.elements = this.elements.filter(el => el.id !== elementId);
		this.updateTimestamp();
	}

	updateElement(elementId, updates) {
		const index = this.elements.findIndex(el => el.id === elementId);
		if (index !== -1) {
			this.elements[index] = new FormElement({
				...this.elements[index],
				...updates,
			});
			this.updateTimestamp();
		}
	}

	reorderElements(elementIds) {
		const orderedElements = [];
		elementIds.forEach((id, index) => {
			const element = this.elements.find(el => el.id === id);
			if (element) {
				element.order = index;
				orderedElements.push(element);
			}
		});
		this.elements = orderedElements;
		this.updateTimestamp();
	}

	validateSubmission(data) {
		const errors = {};
		let isValid = true;

		this.elements.forEach(element => {
			const validation = element.validate(data[element.id]);
			if (!validation.isValid) {
				errors[element.id] = validation.error;
				isValid = false;
			}
		});

		return { isValid, errors };
	}

	updateTimestamp() {
		this.updatedAt = new Date();
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			elements: this.elements.map(el => ({
				id: el.id,
				type: el.type,
				label: el.label,
				required: el.required,
				placeholder: el.placeholder,
				options: el.options,
				validation: el.validation,
				order: el.order,
				metadata: el.metadata,
			})),
			isActive: this.isActive,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			createdBy: this.createdBy,
			projectId: this.projectId,
			workspaceId: this.workspaceId,
		};
	}
}

// src/domain/entities/FormSubmission.js
class FormSubmission {
	constructor({
		id,
		formId,
		data,
		submittedBy,
		submittedAt = new Date(),
		status = 'submitted',
	}) {
		this.id = id;
		this.formId = formId;
		this.data = data;
		this.submittedBy = submittedBy;
		this.submittedAt = submittedAt;
		this.status = status;
	}

	toJSON() {
		return {
			id: this.id,
			formId: this.formId,
			data: this.data,
			submittedBy: this.submittedBy,
			submittedAt: this.submittedAt,
			status: this.status,
		};
	}
}

// ===== CASOS DE USO =====
// src/application/usecases/forms/CreateFormUseCase.js
class CreateFormUseCase {
	constructor(formRepository, userRepository) {
		this.formRepository = formRepository;
		this.userRepository = userRepository;
	}

	async execute({
		name,
		description,
		elements,
		createdBy,
		projectId,
		workspaceId,
	}) {
		// Validar que el usuario existe
		const user = await this.userRepository.findById(createdBy);
		if (!user) {
			throw new Error('Usuario no encontrado');
		}

		// Crear el formulario
		const form = new Form({
			id: this.generateId(),
			name,
			description,
			elements,
			createdBy,
			projectId,
			workspaceId,
		});

		// Guardar en la base de datos
		await this.formRepository.create(form.id, form);

		return form;
	}

	generateId() {
		return Date.now().toString() + Math.random().toString(36).substr(2, 9);
	}
}

// src/application/usecases/forms/SubmitFormUseCase.js
class SubmitFormUseCase {
	constructor(formRepository, formSubmissionRepository) {
		this.formRepository = formRepository;
		this.formSubmissionRepository = formSubmissionRepository;
	}

	async execute({ formId, data, submittedBy }) {
		// Obtener el formulario
		const form = await this.formRepository.getById(formId);
		if (!form) {
			throw new Error('Formulario no encontrado');
		}

		// Validar los datos
		const validation = form.validateSubmission(data);
		if (!validation.isValid) {
			throw new Error(`Datos inválidos: ${JSON.stringify(validation.errors)}`);
		}

		// Crear la submisión
		const submission = new FormSubmission({
			id: this.generateId(),
			formId,
			data,
			submittedBy,
		});

		// Guardar en la base de datos
		await this.formSubmissionRepository.create(submission.id, submission);

		return submission;
	}

	generateId() {
		return Date.now().toString() + Math.random().toString(36).substr(2, 9);
	}
}

// ===== REPOSITORIOS =====
// src/infrastructure/repositories/SQLiteFormRepository.js
class SQLiteFormRepository {
	constructor(connection) {
		this.connection = connection;
	}

	async getById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, name, description, elements, is_active, 
                HEX(workspace_id) AS workspace_id, project_id, HEX(created_by) AS created_by, 
                created_at, updated_at, version
         FROM forms 
         WHERE id = UNHEX(?);`,
				[id]
			);

			if (!rows[0]) return null;

			const row = rows[0];
			return new Form({
				id: row.id,
				name: row.name,
				description: row.description,
				elements: JSON.parse(row.elements),
				isActive: row.is_active === 1,
				workspaceId: row.workspace_id,
				projectId: row.project_id,
				createdBy: row.created_by,
				createdAt: new Date(row.created_at),
				updatedAt: new Date(row.updated_at),
			});
		} catch (err) {
			console.error('Error en FormRepository.getById:', err);
			throw err;
		}
	}

	async create(id, form) {
		const hexId = id.replace(/-/g, '');

		try {
			const result = await this.connection.execute(
				`INSERT INTO forms(id, name, description, elements, is_active, workspace_id, project_id, created_by, created_at, updated_at, version)
         VALUES(UNHEX(?), ?, ?, ?, ?, UNHEX(?), ?, UNHEX(?), ?, ?, 1)
         RETURNING HEX(id) AS id, name, description, elements, is_active, 
                   HEX(workspace_id) AS workspace_id, project_id, HEX(created_by) AS created_by, 
                   created_at, updated_at, version;`,
				[
					hexId,
					form.name,
					form.description,
					JSON.stringify(form.elements),
					form.isActive ? 1 : 0,
					form.workspaceId,
					form.projectId,
					form.createdBy,
					form.createdAt.toISOString(),
					form.updatedAt.toISOString(),
				]
			);
			return result;
		} catch (err) {
			console.error('Error en FormRepository.create:', err);
			throw err;
		}
	}

	async update(
		id,
		{
			name = null,
			description = null,
			elements = null,
			isActive = null,
			projectId = null,
		}
	) {
		try {
			const updates = [];
			const values = [];

			if (!id) {
				throw new Error('El ID del formulario es requerido');
			}

			if (name !== null) {
				updates.push('name = ?');
				values.push(name);
			}

			if (description !== null) {
				updates.push('description = ?');
				values.push(description);
			}

			if (elements !== null) {
				updates.push('elements = ?');
				values.push(JSON.stringify(elements));
			}

			if (isActive !== null) {
				updates.push('is_active = ?');
				values.push(isActive ? 1 : 0);
			}

			if (projectId !== null) {
				updates.push('project_id = ?');
				values.push(projectId);
			}

			if (updates.length === 0) {
				return null;
			}

			updates.push('version = version + 1');
			const now = new Date().toISOString();

			updates.push('updated_at = ?');
			values.push(now);

			values.push(id);

			const result = await this.connection.execute(
				`UPDATE forms SET ${updates.join(', ')} WHERE id = UNHEX(?)
         RETURNING HEX(id) AS id, name, description, elements, is_active, 
                   HEX(workspace_id) AS workspace_id, project_id, HEX(created_by) AS created_by, 
                   created_at, updated_at, version;`,
				values
			);
			return result;
		} catch (err) {
			console.error('Error en FormRepository.update:', err);
			throw err;
		}
	}

	async getByProjectId(projectId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, name, description, elements, is_active, 
                HEX(workspace_id) AS workspace_id, project_id, HEX(created_by) AS created_by, 
                created_at, updated_at, version
         FROM forms 
         WHERE project_id = ? AND is_active = 1 
         ORDER BY created_at DESC;`,
				[projectId]
			);

			return rows.map(
				row =>
					new Form({
						id: row.id,
						name: row.name,
						description: row.description,
						elements: JSON.parse(row.elements),
						isActive: row.is_active === 1,
						workspaceId: row.workspace_id,
						projectId: row.project_id,
						createdBy: row.created_by,
						createdAt: new Date(row.created_at),
						updatedAt: new Date(row.updated_at),
					})
			);
		} catch (err) {
			console.error('Error en FormRepository.getByProjectId:', err);
			throw err;
		}
	}

	async getByWorkspaceId(workspaceId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, name, description, elements, is_active, 
                HEX(workspace_id) AS workspace_id, project_id, HEX(created_by) AS created_by, 
                created_at, updated_at, version
         FROM forms 
         WHERE workspace_id = UNHEX(?) AND is_active = 1 
         ORDER BY created_at DESC;`,
				[workspaceId]
			);

			return rows.map(
				row =>
					new Form({
						id: row.id,
						name: row.name,
						description: row.description,
						elements: JSON.parse(row.elements),
						isActive: row.is_active === 1,
						workspaceId: row.workspace_id,
						projectId: row.project_id,
						createdBy: row.created_by,
						createdAt: new Date(row.created_at),
						updatedAt: new Date(row.updated_at),
					})
			);
		} catch (err) {
			console.error('Error en FormRepository.getByWorkspaceId:', err);
			throw err;
		}
	}

	async delete(id) {
		try {
			const result = await this.connection.execute(
				'UPDATE forms SET is_active = 0, version = version + 1 WHERE id = UNHEX(?)',
				[id]
			);
			return result;
		} catch (err) {
			console.error('Error en FormRepository.delete:', err);
			throw err;
		}
	}
}

// src/infrastructure/repositories/SQLiteFormSubmissionRepository.js
class SQLiteFormSubmissionRepository {
	constructor(connection) {
		this.connection = connection;
	}

	async getById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, HEX(form_id) AS form_id, data, HEX(submitted_by) AS submitted_by, 
                submitted_at, status
         FROM form_submissions 
         WHERE id = UNHEX(?);`,
				[id]
			);

			if (!rows[0]) return null;

			const row = rows[0];
			return new FormSubmission({
				id: row.id,
				formId: row.form_id,
				data: JSON.parse(row.data),
				submittedBy: row.submitted_by,
				submittedAt: new Date(row.submitted_at),
				status: row.status,
			});
		} catch (err) {
			console.error('Error en FormSubmissionRepository.getById:', err);
			throw err;
		}
	}

	async create(id, submission) {
		const hexId = id.replace(/-/g, '');

		try {
			const result = await this.connection.execute(
				`INSERT INTO form_submissions(id, form_id, data, submitted_by, submitted_at, status)
         VALUES(UNHEX(?), UNHEX(?), ?, UNHEX(?), ?, ?)
         RETURNING HEX(id) AS id, HEX(form_id) AS form_id, data, HEX(submitted_by) AS submitted_by, 
                   submitted_at, status;`,
				[
					hexId,
					submission.formId,
					JSON.stringify(submission.data),
					submission.submittedBy,
					submission.submittedAt.toISOString(),
					submission.status,
				]
			);
			return result;
		} catch (err) {
			console.error('Error en FormSubmissionRepository.create:', err);
			throw err;
		}
	}

	async getByFormId(formId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(id) AS id, HEX(form_id) AS form_id, data, HEX(submitted_by) AS submitted_by, 
                submitted_at, status
         FROM form_submissions 
         WHERE form_id = UNHEX(?) 
         ORDER BY submitted_at DESC;`,
				[formId]
			);

			return rows.map(
				row =>
					new FormSubmission({
						id: row.id,
						formId: row.form_id,
						data: JSON.parse(row.data),
						submittedBy: row.submitted_by,
						submittedAt: new Date(row.submitted_at),
						status: row.status,
					})
			);
		} catch (err) {
			console.error('Error en FormSubmissionRepository.getByFormId:', err);
			throw err;
		}
	}

	async update(id, { status = null }) {
		try {
			const updates = [];
			const values = [];

			if (!id) {
				throw new Error('El ID de la submisión es requerido');
			}

			if (status !== null) {
				updates.push('status = ?');
				values.push(status);
			}

			if (updates.length === 0) {
				return null;
			}

			values.push(id);

			const result = await this.connection.execute(
				`UPDATE form_submissions SET ${updates.join(', ')} WHERE id = UNHEX(?)
         RETURNING HEX(id) AS id, HEX(form_id) AS form_id, data, HEX(submitted_by) AS submitted_by, 
                   submitted_at, status;`,
				values
			);
			return result;
		} catch (err) {
			console.error('Error en FormSubmissionRepository.update:', err);
			throw err;
		}
	}
}

// ===== CONTROLADORES =====
// src/interfaces/controllers/FormsController.js
class FormsController {
	constructor(
		createFormUseCase,
		submitFormUseCase,
		formRepository,
		formSubmissionRepository
	) {
		this.createFormUseCase = createFormUseCase;
		this.submitFormUseCase = submitFormUseCase;
		this.formRepository = formRepository;
		this.formSubmissionRepository = formSubmissionRepository;
	}

	async createForm(req, res) {
		try {
			const { name, description, elements, projectId } = req.body;
			const createdBy = req.user.id;

			const form = await this.createFormUseCase.execute({
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
	}

	async getForm(req, res) {
		try {
			const { id } = req.params;
			const form = await this.formRepository.findById(id);

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
	}

	async submitForm(req, res) {
		try {
			const { formId } = req.params;
			const { data, taskId } = req.body;
			const submittedBy = req.user.id;

			const submission = await this.submitFormUseCase.execute({
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
	}

	async getFormSubmissions(req, res) {
		try {
			const { formId } = req.params;
			const submissions = await this.formSubmissionRepository.findByFormId(
				formId
			);

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
	}

	async getProjectForms(req, res) {
		try {
			const { projectId } = req.params;
			const forms = await this.formRepository.findByProjectId(projectId);

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
	}
}

// ===== ESQUEMAS DE BASE DE DATOS =====
// src/infrastructure/database/migrations/forms.sql
const createFormsTable = `
  CREATE TABLE IF NOT EXISTS forms (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    elements JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    workspace_id BINARY(16) NOT NULL,
    project_id VARCHAR(255),
    created_by BINARY(16) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    version INT DEFAULT 1,
    INDEX idx_forms_workspace_id (workspace_id),
    INDEX idx_forms_project_id (project_id),
    INDEX idx_forms_created_by (created_by),
    INDEX idx_forms_is_active (is_active),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
  );
`;

const createFormSubmissionsTable = `
  CREATE TABLE IF NOT EXISTS form_submissions (
    id BINARY(16) PRIMARY KEY,
    form_id BINARY(16) NOT NULL,
    data JSON NOT NULL,
    submitted_by BINARY(16) NOT NULL,
    submitted_at DATETIME NOT NULL,
    status ENUM('submitted', 'reviewed', 'approved', 'rejected') DEFAULT 'submitted',
    INDEX idx_form_submissions_form_id (form_id),
    INDEX idx_form_submissions_submitted_by (submitted_by),
    INDEX idx_form_submissions_status (status),
    INDEX idx_form_submissions_submitted_at (submitted_at),
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
    FOREIGN KEY (submitted_by) REFERENCES users(id)
  );
`;

// ===== RUTAS =====
// src/interfaces/routes/formsRoutes.js
const express = require('express');
const router = express.Router();

// Configurar dependencias (esto lo harías en tu archivo de configuración)
const setupFormRoutes = formsController => {
	router.post('/forms', formsController.createForm.bind(formsController));
	router.get('/forms/:id', formsController.getForm.bind(formsController));
	router.put('/forms/:id', formsController.updateForm.bind(formsController));
	router.delete('/forms/:id', formsController.deleteForm.bind(formsController));
	router.post(
		'/forms/:formId/submit',
		formsController.submitForm.bind(formsController)
	);
	router.get(
		'/forms/:formId/submissions',
		formsController.getFormSubmissions.bind(formsController)
	);
	router.get(
		'/projects/:projectId/forms',
		formsController.getProjectForms.bind(formsController)
	);
	router.get(
		'/workspaces/:workspaceId/forms',
		formsController.getWorkspaceForms.bind(formsController)
	);

	return router;
};

// ===== RUTAS CON VALIDACIÓN =====
// src/interfaces/routes/formsRoutesWithValidation.js
const express = require('express');
const {
	CreateFormSchema,
	UpdateFormSchema,
	SubmitFormSchema,
	UpdateSubmissionSchema,
	FormIdParamSchema,
	FormSubmitParamSchema,
	ProjectIdParamSchema,
	WorkspaceIdParamSchema,
	validateSchema,
} = require('../validators/formSchemas');

const setupValidatedFormRoutes = formsController => {
	const router = express.Router();

	// Crear formulario
	router.post(
		'/forms',
		validateSchema(CreateFormSchema),
		formsController.createForm.bind(formsController)
	);

	// Obtener formulario por ID
	router.get(
		'/forms/:id',
		validateSchema(FormIdParamSchema, 'params'),
		formsController.getForm.bind(formsController)
	);

	// Actualizar formulario
	router.put(
		'/forms/:id',
		validateSchema(FormIdParamSchema, 'params'),
		validateSchema(UpdateFormSchema),
		formsController.updateForm.bind(formsController)
	);

	// Eliminar formulario
	router.delete(
		'/forms/:id',
		validateSchema(FormIdParamSchema, 'params'),
		formsController.deleteForm.bind(formsController)
	);

	// Enviar formulario
	router.post(
		'/forms/:formId/submit',
		validateSchema(FormSubmitParamSchema, 'params'),
		validateSchema(SubmitFormSchema),
		formsController.submitForm.bind(formsController)
	);

	// Obtener envíos de formulario
	router.get(
		'/forms/:formId/submissions',
		validateSchema(FormSubmitParamSchema, 'params'),
		formsController.getFormSubmissions.bind(formsController)
	);

	// Obtener formularios por proyecto
	router.get(
		'/projects/:projectId/forms',
		validateSchema(ProjectIdParamSchema, 'params'),
		formsController.getProjectForms.bind(formsController)
	);

	// Obtener formularios por workspace
	router.get(
		'/workspaces/:workspaceId/forms',
		validateSchema(WorkspaceIdParamSchema, 'params'),
		formsController.getWorkspaceForms.bind(formsController)
	);

	return router;
};

// ===== EJEMPLO DE USO =====
// Ejemplo de cómo crear un formulario
const formExample = {
	name: 'Solicitud de Funcionalidad',
	description: 'Formulario para solicitar nuevas funcionalidades',
	workspaceId: 'workspace-123',
	projectId: 'project-123',
	elements: [
		{
			id: 'title',
			type: 'text',
			label: 'Título de la funcionalidad',
			required: true,
			placeholder: 'Describe brevemente la funcionalidad',
			validation: {
				minLength: 5,
				maxLength: 100,
			},
			order: 0,
		},
		{
			id: 'description',
			type: 'textarea',
			label: 'Descripción detallada',
			required: true,
			placeholder: 'Explica en detalle qué necesitas',
			validation: {
				minLength: 20,
				maxLength: 1000,
			},
			order: 1,
		},
		{
			id: 'priority',
			type: 'select',
			label: 'Prioridad',
			required: true,
			options: [
				{ value: 'low', label: 'Baja' },
				{ value: 'medium', label: 'Media' },
				{ value: 'high', label: 'Alta' },
				{ value: 'urgent', label: 'Urgente' },
			],
			order: 2,
		},
		{
			id: 'category',
			type: 'multiselect',
			label: 'Categorías',
			required: false,
			options: [
				{ value: 'ui', label: 'Interfaz de Usuario' },
				{ value: 'api', label: 'API' },
				{ value: 'database', label: 'Base de Datos' },
				{ value: 'performance', label: 'Rendimiento' },
			],
			order: 3,
		},
		{
			id: 'deadline',
			type: 'date',
			label: 'Fecha límite deseada',
			required: false,
			order: 4,
		},
		{
			id: 'attachments',
			type: 'file',
			label: 'Archivos adjuntos',
			required: false,
			metadata: {
				allowedTypes: ['image/*', '.pdf', '.doc', '.docx'],
				maxSize: '10MB',
				multiple: true,
			},
			order: 5,
		},
	],
};

module.exports = {
	setupValidatedFormRoutes,
	formExample,
};

// ===== ESQUEMAS ZOD =====
// src/interfaces/validators/formSchemas.js
const { z } = require('zod');

// Esquema para validación de elementos de formulario
const FormElementValidationSchema = z
	.object({
		minLength: z.number().min(0).optional(),
		maxLength: z.number().min(1).optional(),
		pattern: z.string().optional(),
		patternMessage: z.string().optional(),
		min: z.number().optional(), // Para números y fechas
		max: z.number().optional(), // Para números y fechas
	})
	.optional();

const FormElementOptionSchema = z.object({
	value: z.string(),
	label: z.string(),
});

const FormElementSchema = z.object({
	id: z.string().min(1, 'ID del elemento es requerido'),
	type: z.enum([
		'text',
		'email',
		'number',
		'textarea',
		'select',
		'checkbox',
		'radio',
		'date',
		'file',
		'multiselect',
	]),
	label: z.string().min(1, 'Label es requerido'),
	required: z.boolean().default(false),
	placeholder: z.string().default(''),
	options: z.array(FormElementOptionSchema).default([]),
	validation: FormElementValidationSchema,
	order: z.number().min(0).default(0),
	metadata: z.record(z.any()).default({}),
});

// Esquema para crear formulario
const CreateFormSchema = z.object({
	name: z
		.string()
		.min(1, 'El nombre es requerido')
		.max(255, 'El nombre no puede exceder 255 caracteres'),
	description: z
		.string()
		.max(1000, 'La descripción no puede exceder 1000 caracteres')
		.default(''),
	elements: z
		.array(FormElementSchema)
		.min(1, 'El formulario debe tener al menos un elemento'),
	projectId: z.string().optional(),
	workspaceId: z.string().min(1, 'El workspace ID es requerido'),
});

// Esquema para actualizar formulario
const UpdateFormSchema = z.object({
	name: z
		.string()
		.min(1, 'El nombre es requerido')
		.max(255, 'El nombre no puede exceder 255 caracteres')
		.optional(),
	description: z
		.string()
		.max(1000, 'La descripción no puede exceder 1000 caracteres')
		.optional(),
	elements: z
		.array(FormElementSchema)
		.min(1, 'El formulario debe tener al menos un elemento')
		.optional(),
	isActive: z.boolean().optional(),
	projectId: z.string().optional(),
});

// Esquema para envío de formulario
const SubmitFormSchema = z.object({
	data: z.record(z.any()).refine(data => Object.keys(data).length > 0, {
		message: 'Los datos del formulario no pueden estar vacíos',
	}),
});

// Esquema para actualizar estado de envío
const UpdateSubmissionSchema = z.object({
	status: z.enum(['submitted', 'reviewed', 'approved', 'rejected']),
});

// Esquemas de parámetros de rutas
const FormIdParamSchema = z.object({
	id: z.string().min(1, 'ID del formulario es requerido'),
});

const FormSubmitParamSchema = z.object({
	formId: z.string().min(1, 'ID del formulario es requerido'),
});

const ProjectIdParamSchema = z.object({
	projectId: z.string().min(1, 'ID del proyecto es requerido'),
});

const WorkspaceIdParamSchema = z.object({
	workspaceId: z.string().min(1, 'ID del workspace es requerido'),
});

// Middleware de validación genérico
const validateSchema = (schema, source = 'body') => {
	return (req, res, next) => {
		try {
			const dataToValidate =
				source === 'params'
					? req.params
					: source === 'query'
					? req.query
					: req.body;

			const validatedData = schema.parse(dataToValidate);

			if (source === 'params') {
				req.params = validatedData;
			} else if (source === 'query') {
				req.query = validatedData;
			} else {
				req.body = validatedData;
			}

			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				return res.status(400).json({
					success: false,
					error: 'Datos de entrada inválidos',
					details: error.errors.map(err => ({
						field: err.path.join('.'),
						message: err.message,
						code: err.code,
					})),
				});
			}

			return res.status(500).json({
				success: false,
				error: 'Error interno del servidor',
			});
		}
	};
};

module.exports = {
	FormElementSchema,
	CreateFormSchema,
	UpdateFormSchema,
	SubmitFormSchema,
	UpdateSubmissionSchema,
	FormIdParamSchema,
	FormSubmitParamSchema,
	ProjectIdParamSchema,
	WorkspaceIdParamSchema,
	validateSchema,
};

module.exports = {
	FormElement,
	Form,
	FormSubmission,
	CreateFormUseCase,
	SubmitFormUseCase,
	SQLiteFormRepository,
	SQLiteFormSubmissionRepository,
	FormsController,
	createFormsTable,
	createFormSubmissionsTable,
	setupFormRoutes,
	setupValidatedFormRoutes,
	formExample,
};
