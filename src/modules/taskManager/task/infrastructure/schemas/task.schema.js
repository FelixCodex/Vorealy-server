import { z } from 'zod';

const uuidSchema = z.string().regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido');

const taskPriorityEnum = z.enum(['low', 'normal', 'high', 'urgent', null], {
	errorMap: () => ({
		message: 'Prioridad inválida. Debe ser "low", "normal", "high" o "urgent".',
	}),
});

const taskCoreSchema = z.object({
	title: z.string().min(1, 'El título de la tarea no puede estar vacío'),

	startDate: z.string().datetime().optional(),

	endDate: z.string().datetime().optional(),
	state: z.string().default('todo').optional(),

	priority: taskPriorityEnum.default(null).optional(),

	estimatedTime: z
		.number()
		.int('El tiempo estimado debe ser un número entero')
		.positive('El tiempo estimado debe ser positivo')
		.optional(),
});

export const createTaskInputSchema = taskCoreSchema.extend({
	listId: uuidSchema.nonempty(
		'El ID de la lista es requerido para crear una tarea'
	),
});

export const updateTaskInputSchema = taskCoreSchema.partial();

export const taskIdParamSchema = z.object({
	id: uuidSchema.nonempty('El ID de la tarea es requerido'),
});

export const taskListIdParamSchema = z.object({
	listId: uuidSchema.nonempty('El ID de la lista es requerido'),
});

export const taskWorkspaceIdParamSchema = z.object({
	workspaceId: uuidSchema.nonempty('El ID del workspace es requerido'),
});

export const taskEntitySchema = taskCoreSchema.extend({
	id: uuidSchema,
	list_id: uuidSchema,
	workspace_id: uuidSchema,
	created_by: uuidSchema.nullable(),
	created_at: z.string().datetime(),
	assigned_to: uuidSchema.nullable(),
	state: z.string(),
	priority: taskPriorityEnum,
	estimated_time: z.number().int().positive().nullable(),
	updated_at: z.string().datetime().optional(),
	updated_by: uuidSchema.nullable().optional(),
});
