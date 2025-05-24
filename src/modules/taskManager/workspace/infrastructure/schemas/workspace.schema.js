import { z } from 'zod';

const uuidSchema = z.string().regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido');

export const createWorkspaceInputSchema = z.object({
	name: z
		.string()
		.min(1, 'El nombre del workspace no puede estar vacío')
		.max(255, 'El nombre del workspace no puede exceder los 255 caracteres'),
	color: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			'Formato de color hexadecimal inválido (ej. #RRGGBB o #RGB)'
		)
		.default('#4169E1')
		.optional(),
	icon: z
		.string()
		.max(10, 'El ID del icono no puede exceder los 10 caracteres')
		.optional(),
});

export const updateWorkspaceInputSchema = z.object({
	name: z
		.string()
		.min(1, 'El nombre del workspace no puede estar vacío')
		.max(255, 'El nombre del workspace no puede exceder los 255 caracteres')
		.optional(),
	color: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			'Formato de color hexadecimal inválido (ej. #RRGGBB o #RGB)'
		)
		.optional(),
	icon_id: z
		.string()
		.max(10, 'El ID del icono no puede exceder los 10 caracteres')
		.optional(),
});

export const userIdParamSchema = z.object({
	userId: uuidSchema.nonempty('El ID del usuario es requerido'),
});

export const workspaceIdParamForUpdateDeleteSchema = z.object({
	workspaceId: uuidSchema.nonempty('El ID del workspace es requerido'),
});

export const workspaceEntitySchema = z.object({
	id: uuidSchema,
	owner_id: uuidSchema,
	name: z.string(),
	icon_id: z.string().nullable(),
	color: z.string(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});
