import { z } from 'zod';

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

export const CreateFormInputSchema = z.object({
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

export const UpdateFormInputSchema = z.object({
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

export const SubmitFormInputSchema = z.object({
	data: z.record(z.any()).refine(data => Object.keys(data).length > 0, {
		message: 'Los datos del formulario no pueden estar vacíos',
	}),
});

export const UpdateSubmissionSchema = z.object({
	status: z.enum(['submitted', 'reviewed', 'approved', 'rejected']),
});

export const FormIdParamSchema = z.object({
	id: z.string().min(1, 'ID del formulario es requerido'),
});

export const FormSubmitParamSchema = z.object({
	formId: z.string().min(1, 'ID del formulario es requerido'),
});

export const ProjectIdParamSchema = z.object({
	projectId: z.string().min(1, 'ID del proyecto es requerido'),
});
