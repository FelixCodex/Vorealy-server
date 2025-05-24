import { z } from 'zod';

const uuidSchema = z.string().regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido');

const subtaskPriorityEnum = z.enum(['low', 'normal', 'high', 'urgent'], {
	errorMap: () => ({
		message: 'Prioridad inválida. Debe ser "low", "normal", "high" o "urgent".',
	}),
});

const dateOnlySchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)');

const subtaskCoreSchema = z.object({
	title: z.string().min(1, 'El título de la subtarea no puede estar vacío'),
	completed: z.boolean().default(false).optional(),

	start_date: dateOnlySchema.optional(),

	end_date: dateOnlySchema.optional(),

	assigned_to: z.array(uuidSchema).optional(),

	priority: subtaskPriorityEnum.default('normal').optional(),
	estimated_time: z
		.number()
		.int('El tiempo estimado debe ser un número entero')
		.positive('El tiempo estimado debe ser positivo')
		.optional(),
});

export const createSubTaskInputSchema = subtaskCoreSchema.extend({
	task_id: uuidSchema.nonempty(
		'El ID de la tarea padre es requerido para crear una subtarea'
	),
	workspace_id: uuidSchema.nonempty(
		'El ID del workspace es requerido para crear una subtarea'
	),
});

export const updateSubTaskInputSchema = subtaskCoreSchema.partial();

export const subtaskIdParamSchema = z.object({
	id: uuidSchema.nonempty('El ID de la subtarea es requerido'),
});

export const subtaskTaskIdParamSchema = z.object({
	taskId: uuidSchema.nonempty('El ID de la tarea padre (listId) es requerido'),
});

export const subtaskEntitySchema = subtaskCoreSchema.extend({
	id: uuidSchema,
	task_id: uuidSchema,
	workspace_id: uuidSchema,
	completed: z.boolean(),
	start_date: dateOnlySchema.nullable(),
	end_date: dateOnlySchema.nullable(),
	assigned_to: uuidSchema.nullable(),
	priority: subtaskPriorityEnum,
	estimated_time: z.number().int().positive().nullable(),
	created_by: uuidSchema,
	updated_by: uuidSchema.nullable(),
});
