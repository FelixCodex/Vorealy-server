import { z } from 'zod';

const uuidSchema = z.string().regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido');

const entityTypeEnum = z.enum(
	['workspace', 'project', 'folder', 'list', 'task'],
	{
		errorMap: () => ({
			message:
				'Tipo de entidad inválido. Debe ser "workspace", "project", "folder", "list" o "task".',
		}),
	}
);

export const createCustomPropertyInputSchema = z.object({
	name: z
		.string()
		.min(1, 'El nombre de la propiedad personalizada no puede estar vacío'),

	type: z
		.string()
		.min(1, 'El tipo de la propiedad personalizada no puede estar vacío'),

	defaultValue: z.string().optional(),
	options: z.any().optional(),
});

export const assignCustomPropertyInputSchema = z.object({
	definitionId: z
		.number()
		.int('El ID de la definición debe ser un número entero')
		.positive('El ID de la definición debe ser positivo'),

	entityType: entityTypeEnum,
	entityId: uuidSchema.nonempty('El ID de la entidad es requerido'),

	value: z.any().optional(),

	overrideParent: z.boolean().optional(),
});

export const getEntityPropertiesParamsSchema = z.object({
	entityType: entityTypeEnum,
	entityId: uuidSchema.nonempty('El ID de la entidad es requerido'),
});

export const getEntityPropertiesQuerySchema = z.object({
	includeInherited: z
		.preprocess(val => val === 'true', z.boolean().default(false))
		.optional(),
});

export const customPropertyDefinitionEntitySchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	type: z.string(),
	defaultValue: z.string().nullable(),
	options: z.string().nullable(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});

export const customPropertyAssignmentEntitySchema = z.object({
	id: z.number().int().positive(),
	definition_id: z.number().int().positive(),
	entity_type: entityTypeEnum,
	entity_id: uuidSchema,
	value: z.string().nullable(),
	is_inherited: z.boolean(),
	override_parent: z.boolean(),
	parent_entity_type: z.string().nullable(),
	parent_entity_id: uuidSchema.nullable(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});
