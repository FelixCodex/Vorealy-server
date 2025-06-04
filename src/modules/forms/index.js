// ===== DOMINIO =====
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
				metadata: el.metadata,
			})),
			isActive: this.isActive,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			createdBy: this.createdBy,
			projectId: this.projectId,
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

	async execute({ name, description, elements, createdBy, projectId }) {
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
		});

		// Guardar en la base de datos
		await this.formRepository.save(form);

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
		const form = await this.formRepository.findById(formId);
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
		await this.formSubmissionRepository.save(submission);

		return submission;
	}

	generateId() {
		return Date.now().toString() + Math.random().toString(36).substr(2, 9);
	}
}

// ===== REPOSITORIOS =====
// src/infrastructure/repositories/SQLiteFormRepository.js
class SQLiteFormRepository {
	constructor(database) {
		this.db = database;
	}

	async save(form) {
		const query = `
      INSERT OR REPLACE INTO forms (
        id, name, description, elements, isActive, createdAt, updatedAt, createdBy, projectId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

		const params = [
			form.id,
			form.name,
			form.description,
			JSON.stringify(form.elements),
			form.isActive ? 1 : 0,
			form.createdAt.toISOString(),
			form.updatedAt.toISOString(),
			form.createdBy,
			form.projectId,
		];

		await this.db.run(query, params);
		return form;
	}

	async findById(id) {
		const query = 'SELECT * FROM forms WHERE id = ?';
		const row = await this.db.get(query, [id]);

		if (!row) return null;

		return new Form({
			id: row.id,
			name: row.name,
			description: row.description,
			elements: JSON.parse(row.elements),
			isActive: row.isActive === 1,
			createdAt: new Date(row.createdAt),
			updatedAt: new Date(row.updatedAt),
			createdBy: row.createdBy,
			projectId: row.projectId,
		});
	}

	async findByProjectId(projectId) {
		const query =
			'SELECT * FROM forms WHERE projectId = ? AND isActive = 1 ORDER BY createdAt DESC';
		const rows = await this.db.all(query, [projectId]);

		return rows.map(
			row =>
				new Form({
					id: row.id,
					name: row.name,
					description: row.description,
					elements: JSON.parse(row.elements),
					isActive: row.isActive === 1,
					createdAt: new Date(row.createdAt),
					updatedAt: new Date(row.updatedAt),
					createdBy: row.createdBy,
					projectId: row.projectId,
				})
		);
	}

	async delete(id) {
		const query = 'UPDATE forms SET isActive = 0 WHERE id = ?';
		await this.db.run(query, [id]);
	}
}

// src/infrastructure/repositories/SQLiteFormSubmissionRepository.js
class SQLiteFormSubmissionRepository {
	constructor(database) {
		this.db = database;
	}

	async save(submission) {
		const query = `
      INSERT INTO form_submissions (
        id, formId, data, submittedBy, submittedAt, taskId, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

		const params = [
			submission.id,
			submission.formId,
			JSON.stringify(submission.data),
			submission.submittedBy,
			submission.submittedAt.toISOString(),
			submission.taskId,
			submission.status,
		];

		await this.db.run(query, params);
		return submission;
	}

	async findByFormId(formId) {
		const query =
			'SELECT * FROM form_submissions WHERE formId = ? ORDER BY submittedAt DESC';
		const rows = await this.db.all(query, [formId]);

		return rows.map(
			row =>
				new FormSubmission({
					id: row.id,
					formId: row.formId,
					data: JSON.parse(row.data),
					submittedBy: row.submittedBy,
					submittedAt: new Date(row.submittedAt),
					taskId: row.taskId,
					status: row.status,
				})
		);
	}

	async findByTaskId(taskId) {
		const query =
			'SELECT * FROM form_submissions WHERE taskId = ? ORDER BY submittedAt DESC';
		const rows = await this.db.all(query, [taskId]);

		return rows.map(
			row =>
				new FormSubmission({
					id: row.id,
					formId: row.formId,
					data: JSON.parse(row.data),
					submittedBy: row.submittedBy,
					submittedAt: new Date(row.submittedAt),
					taskId: row.taskId,
					status: row.status,
				})
		);
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
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    elements TEXT NOT NULL, -- JSON
    isActive INTEGER DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    createdBy TEXT NOT NULL,
    projectId TEXT,
    FOREIGN KEY (createdBy) REFERENCES users(id),
    FOREIGN KEY (projectId) REFERENCES projects(id)
  );
`;

const createFormSubmissionsTable = `
  CREATE TABLE IF NOT EXISTS form_submissions (
    id TEXT PRIMARY KEY,
    formId TEXT NOT NULL,
    data TEXT NOT NULL, -- JSON
    submittedBy TEXT NOT NULL,
    submittedAt TEXT NOT NULL,
    taskId TEXT,
    status TEXT DEFAULT 'submitted',
    FOREIGN KEY (formId) REFERENCES forms(id),
    FOREIGN KEY (submittedBy) REFERENCES users(id),
    FOREIGN KEY (taskId) REFERENCES tasks(id)
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

	return router;
};

module.exports = { setupFormRoutes };

// ===== EJEMPLO DE USO =====
// Ejemplo de cómo crear un formulario
const formExample = {
	name: 'Solicitud de Funcionalidad',
	description: 'Formulario para solicitar nuevas funcionalidades',
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
	formExample,
};
