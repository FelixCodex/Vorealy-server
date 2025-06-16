import { z } from 'zod';

const uuidSchema = z.string().regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido');
const idSchema = z.string().min(1).max(36);

export const createGoalSchema = z.object({
	name: z
		.string()
		.min(1, 'El nombre es requerido')
		.max(255, 'El nombre es muy largo'),
	description: z.string().optional().nullable(),
	workspaceId: z.string().uuid('ID de workspace inválido'),
});

export const updateGoalSchema = z.object({
	name: z
		.string()
		.min(1, 'El nombre es requerido')
		.max(255, 'El nombre es muy largo')
		.optional(),
	description: z.string().optional().nullable(),
});

export const createTargetSchema = z.object({
	goalId: idSchema,
	name: z
		.string()
		.min(1, 'El nombre es requerido')
		.max(255, 'El nombre es muy largo'),
	description: z.string().optional().nullable(),
	targetType: z.enum(['numeric', 'boolean', 'task']).default('numeric'),
	targetValue: z
		.number()
		.int()
		.min(0, 'El valor objetivo debe ser mayor o igual a 0'),
	unit: z.string().max(50, 'La unidad es muy larga').optional().nullable(),
});

export const updateTargetProgressSchema = z.object({
	currentValue: z
		.number()
		.int()
		.min(0, 'El valor actual debe ser mayor o igual a 0'),
});

export const recordProgressSchema = z.object({
	goalId: idSchema,
	targetId: idSchema.optional().nullable(),
	previousValue: z.number().int().optional().nullable(),
	newValue: z
		.number()
		.int()
		.min(0, 'El nuevo valor debe ser mayor o igual a 0'),
	notes: z.string().optional().nullable(),
});

export const linkTaskToTargetSchema = z.object({
	targetId: idSchema,
	taskId: uuidSchema,
});

export const goalParamsSchema = z.object({
	goalId: idSchema,
});

export const targetParamsSchema = z.object({
	targetId: idSchema,
});

export const workspaceParamsSchema = z.object({
	workspaceId: uuidSchema,
});

export const progressHistoryQuerySchema = z.object({
	limit: z
		.string()
		.transform(val => parseInt(val))
		.pipe(z.number().int().min(1).max(100))
		.default('50'),
});
