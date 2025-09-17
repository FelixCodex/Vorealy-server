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
		.default('#D1D5DB')
		.optional(),

	description: z.string().optional(),

	automationRules: z.any().optional(),

	todoColor: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			'Formato de color hexadecimal inválido (ej. #RRGGBB o #RGB)'
		)
		.default('#E74C3C')
		.optional(),
	todoName: z.string().default('TODO').optional(),
	doneName: z.string().default('Done').optional(),

	priority: listPriorityEnum.default('normal').optional(),
	isPrivate: z.boolean().default(false).optional(),
	estimatedTime: z
		.number()
		.int('El tiempo estimado debe ser un número entero')
		.positive('El tiempo estimado debe ser positivo')
		.optional(),
});

export const createListInputSchema = listCoreSchema.extend({
	parentId: uuidSchema.nonempty(
		'El ID del padre es requerido para crear una lista'
	),
	parentType: listParentTypeEnum,
});

export const createStatusInputSchema = z.object({
	listId: uuidSchema.nonempty(
		'El ID del padre es requerido para crear una lista'
	),
	name: z.string().min(1, 'El nombre de la lista no puede estar vacío'),
	color: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			'Formato de color hexadecimal inválido (ej. #RRGGBB o #RGB)'
		)
		.default('#D1D5DB')
		.optional(),
});

export const updateStatusInputSchema = z.object({
	name: z.string().min(1, 'El nombre de la lista no puede estar vacío'),
	color: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			'Formato de color hexadecimal inválido (ej. #RRGGBB o #RGB)'
		)
		.default('#D1D5DB')
		.optional(),
});

export const updateListInputSchema = listCoreSchema.partial();

export const idParamSchema = z.object({
	id: uuidSchema.nonempty('El ID de la lista es requerido'),
});

export const listIdParamSchema = z.object({
	listId: uuidSchema.nonempty('El ID de la lista es requerido'),
});

export const folderIdParamSchema = z.object({
	folderId: uuidSchema.nonempty('El ID de la lista es requerido'),
});

export const projectIdParamSchema = z.object({
	projectId: uuidSchema.nonempty('El ID de la lista es requerido'),
});

export const listParentInputSchema = z.object({
	parentId: uuidSchema.nonempty('El ID del padre es requerido'),
	parentType: listParentTypeEnum,
});

export const listParentParamsSchema = z.object({
	parentId: uuidSchema.nonempty('El ID del padre es requerido'),
	parentType: listParentTypeEnum,
});

export const workspaceIdParamSchema = z.object({
	workspaceId: uuidSchema.nonempty('El ID del workspace es requerido'),
});

export const statusIdParamSchema = z.object({
	statusId: uuidSchema.nonempty('El ID del status es requerido'),
});

export const listEntitySchema = listCoreSchema.extend({
	id: uuidSchema,
	parentId: uuidSchema,
	parentType: listParentTypeEnum,
	workspaceId: uuidSchema,
	createdBy: uuidSchema.nullable(),
	createdAt: z.string().datetime(),
	statuses: z.array(listStatusSchema).optional(),
	assignedTo: z.array(uuidSchema).optional(),
});
