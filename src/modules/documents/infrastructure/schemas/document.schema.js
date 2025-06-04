import z from 'zod';

const uuidSchema = z.string().regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido');

const documentParentTypeEnum = z.enum(['project', 'folder', 'list'], {
	errorMap: () => ({
		message: 'Tipo de padre inválido. Debe ser "project", "folder" o "list".',
	}),
});

const documentCoreSchema = z.object({
	title: z.string().min(1, 'El título del documento no puede estar vacío'),
	content: z.string().default('').optional(),
	workspace_id: uuidSchema.nonempty('El ID del workspace es requerido'),
	parent_type: documentParentTypeEnum,
	parent_id: uuidSchema.optional(),
	created_by: uuidSchema.optional(),
	version: z
		.number()
		.int('La versión debe ser un número entero')
		.positive('La versión debe ser positiva')
		.default(1)
		.optional(),
	is_deleted: z.boolean().default(false).optional(),
});

export const createDocumentInputSchema = documentCoreSchema.extend({
	workspace_id: uuidSchema.nonempty('El ID del workspace es requerido'),
	parent_type: documentParentTypeEnum,
});

export const updateDocumentInputSchema = documentCoreSchema.partial();

export const documentIdParamSchema = z.object({
	id: uuidSchema.nonempty('El ID del documento es requerido'),
});

export const documentParentParamsSchema = z.object({
	parentId: uuidSchema.nonempty('El ID del padre es requerido'),
	parentType: documentParentTypeEnum,
});

export const workspaceIdParamSchema = z.object({
	workspaceId: uuidSchema.nonempty('El ID del workspace es requerido'),
});

export const documentEntitySchema = documentCoreSchema.extend({
	id: uuidSchema,
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
	created_by: uuidSchema.nullable(),
});
