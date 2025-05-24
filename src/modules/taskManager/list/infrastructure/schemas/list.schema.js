import { z } from 'zod';

const uuidSchema = z.string().regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido');

const listParentTypeEnum = z.enum(['project', 'folder'], {
	errorMap: () => ({
		message: 'Tipo de padre inválido. Debe ser "project" o "folder".',
	}),
});

const listPriorityEnum = z.enum(['low', 'normal', 'high', 'urgent'], {
	errorMap: () => ({
		message: 'Prioridad inválida. Debe ser "low", "normal", "high" o "urgent".',
	}),
});

const listStatusSchema = z.object({
	name: z.string().min(1, 'El nombre del estado no puede estar vacío'),
	color: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			'Formato de color hexadecimal inválido (ej. #RRGGBB o #RGB)'
		),
});

const listCoreSchema = z.object({
	name: z.string().min(1, 'El nombre de la lista no puede estar vacío'),

	color: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			'Formato de color hexadecimal inválido (ej. #RRGGBB o #RGB)'
		)
		.default('#808080')
		.optional(),

	description: z.string().optional(),

	automation_rules: z.any().optional(),

	assigned_to: z.array(uuidSchema).optional(),

	statuses: z.any().optional(),
	priority: listPriorityEnum.default('normal').optional(),
	is_private: z.boolean().default(false).optional(),
	estimated_time: z
		.number()
		.int('El tiempo estimado debe ser un número entero')
		.positive('El tiempo estimado debe ser positivo')
		.optional(),
});

export const createListInputSchema = listCoreSchema.extend({
	parent_id: uuidSchema.nonempty(
		'El ID del padre es requerido para crear una lista'
	),
	parent_type: listParentTypeEnum,
	workspace_id: uuidSchema.nonempty('El ID del workspace es requerido'),
	created_by: uuidSchema.optional(),
});

export const updateListInputSchema = listCoreSchema.partial();

export const listIdParamSchema = z.object({
	id: uuidSchema.nonempty('El ID de la lista es requerido'),
});

export const listParentParamsSchema = z.object({
	parentId: uuidSchema.nonempty('El ID del padre es requerido'),
	parentType: listParentTypeEnum,
});

export const workspaceIdParamSchema = z.object({
	workspaceId: uuidSchema.nonempty('El ID del workspace es requerido'),
});

export const listEntitySchema = listCoreSchema.extend({
	id: uuidSchema,
	parent_id: uuidSchema,
	parent_type: listParentTypeEnum,
	workspace_id: uuidSchema,
	created_by: uuidSchema.nullable(),
	created_at: z.string().datetime(),
	statuses: z.array(listStatusSchema).optional(),
	assigned_to: z.array(uuidSchema).optional(),
});
