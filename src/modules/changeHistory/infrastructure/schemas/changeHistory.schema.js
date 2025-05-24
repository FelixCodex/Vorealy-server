import { z } from 'zod';

const uuidSchema = z.string().regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido');

const changeHistoryEntityTypeEnum = z.enum(
	['workspace', 'project', 'folder', 'list', 'task', 'custom_property'],
	{
		errorMap: () => ({
			message:
				'Tipo de entidad inválido. Debe ser "workspace", "project", "folder", "list", "task" o "custom_property".',
		}),
	}
);

const changeTypeEnum = z.enum(['create', 'update', 'delete'], {
	errorMap: () => ({
		message: 'Tipo de cambio inválido. Debe ser "create", "update" o "delete".',
	}),
});

export const getEntityHistoryParamsSchema = z.object({
	entityType: changeHistoryEntityTypeEnum,
	entityId: uuidSchema.nonempty('El ID de la entidad es requerido'),
});

export const getEntityHistoryQuerySchema = z.object({
	limit: z
		.preprocess(
			val => parseInt(String(val), 10),
			z
				.number()
				.int()
				.positive('El límite debe ser un número entero positivo')
				.default(100)
		)
		.optional(),
	offset: z
		.preprocess(
			val => parseInt(String(val), 10),
			z.number().int().min(0, 'El offset no puede ser negativo').default(0)
		)
		.optional(),
	sortDirection: z
		.enum(['ASC', 'DESC'], {
			errorMap: () => ({
				message: 'La dirección de ordenación debe ser "ASC" o "DESC".',
			}),
		})
		.default('DESC')
		.optional(),
});

export const getUserActivityParamsSchema = z.object({
	userId: uuidSchema.nonempty('El ID del usuario es requerido'),
});

export const getUserActivityQuerySchema = z.object({
	limit: z
		.preprocess(
			val => parseInt(String(val), 10),
			z
				.number()
				.int()
				.positive('El límite debe ser un número entero positivo')
				.default(100)
		)
		.optional(),
	offset: z
		.preprocess(
			val => parseInt(String(val), 10),
			z.number().int().min(0, 'El offset no puede ser negativo').default(0)
		)
		.optional(),
	entityTypes: z
		.preprocess(
			val =>
				typeof val === 'string' && val.length > 0 ? val.split(',') : null,
			z.array(changeHistoryEntityTypeEnum).nullable().optional()
		)
		.optional(),
});

export const changeHistoryEntitySchema = z.object({
	id: z.number().int().positive(),
	entity_type: changeHistoryEntityTypeEnum,
	entity_id: uuidSchema,
	change_type: changeTypeEnum,
	field_name: z.string().nullable(),
	old_value: z.string().nullable(),
	new_value: z.string().nullable(),
	user_id: uuidSchema,
	timestamp: z.string().datetime(),
	additional_info: z.string().nullable(),
});
