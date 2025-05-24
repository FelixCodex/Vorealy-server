import { z } from 'zod';

const uuidSchema = z.string().regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido');

const workspaceRoleEnum = z.enum(['admin', 'member', 'guest'], {
	errorMap: () => ({
		message: 'Rol de miembro inválido. Debe ser "admin", "member" o "guest".',
	}),
});

export const workspaceIdParamSchema = z.object({
	workspaceId: uuidSchema.nonempty('El ID del workspace es requerido'),
});

export const workspaceIdAndUserIdParamsSchema = z.object({
	workspaceId: uuidSchema.nonempty('El ID del workspace es requerido'),
	userId: uuidSchema.nonempty('El ID del usuario es requerido'),
});

export const addWorkspaceMemberInputSchema = z.object({
	userId: uuidSchema.nonempty('El ID del usuario es requerido'),
	role: workspaceRoleEnum.default('guest').optional(),
	invitedBy: uuidSchema.optional(),
});

export const updateWorkspaceMemberRoleInputSchema = z.object({
	role: workspaceRoleEnum.nonempty(
		'El rol es requerido para actualizar el miembro'
	),
});

export const workspaceMemberEntitySchema = z.object({
	workspace_id: uuidSchema,
	user_id: uuidSchema,
	role: workspaceRoleEnum,
	joined_at: z.string().datetime(),
	invited_by: uuidSchema.nullable(),
});
