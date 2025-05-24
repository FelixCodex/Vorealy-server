import { z } from 'zod';

const uuidSchema = z.string().regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido');

const folderCoreSchema = z.object({
	name: z
		.string()
		.min(1, 'El nombre de la carpeta no puede estar vacío')
		.max(255, 'El nombre de la carpeta no puede exceder los 255 caracteres'),
	description: z.string().optional(),

	color: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			'Formato de color hexadecimal invalido'
		)
		.default('#808080')
		.optional(),

	icon: z.number().max(255).optional(),

	is_private: z.boolean().optional(),

	automation_rules: z.any().optional(),
	metadata: z.any().optional(),
});

export const createFolderInputSchema = folderCoreSchema.extend({
	project_id: uuidSchema.nonempty(
		'El ID del proyecto es requerido para crear una carpeta'
	),
});

export const updateFolderInputSchema = folderCoreSchema.partial();

export const folderIdParamSchema = z.object({
	id: uuidSchema.nonempty('El ID de la carpeta es requerido'),
});

export const projectIdParamSchema = z.object({
	projectId: uuidSchema.nonempty('El ID del proyecto es requerido'),
});

export const workspaceIdParamSchema = z.object({
	workspaceId: uuidSchema.nonempty('El ID del workspace es requerido'),
});

export const folderEntitySchema = folderCoreSchema.extend({
	id: uuidSchema,
	project_id: uuidSchema,
	workspace_id: uuidSchema,
	created_at: z.string().datetime(),
	created_by: uuidSchema,
	updated_at: z.string().datetime(),
	updated_by: uuidSchema.nullable(),
});
