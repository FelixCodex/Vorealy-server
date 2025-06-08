import { z } from 'zod';

const uuidSchema = z
	.string()
	.regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido')
	.min(1, 'El ID es requerido');

const workspaceRoleEnum = z.enum(['admin', 'member', 'guest'], {
	errorMap: () =>
		({
			message: 'Rol de miembro inválido. Debe ser "admin", "member" o "guest".',
		}.min(1, 'El rol es requerido para actualizar el miembro')),
});

export const workspaceIdParamSchema = z.object({
	workspaceId: uuidSchema,
});

export const workspaceIdAndUserIdParamsSchema = z.object({
	workspaceId: uuidSchema,
	userId: uuidSchema,
});

export const addWorkspaceMemberInputSchema = z.object({
	userId: uuidSchema,
	role: workspaceRoleEnum.default('guest').optional(),
	invitedBy: uuidSchema.optional(),
});

export const updateWorkspaceMemberRoleInputSchema = z.object({
	role: workspaceRoleEnum,
});

export const workspaceMemberEntitySchema = z.object({
	workspace_id: uuidSchema,
	user_id: uuidSchema,
	role: workspaceRoleEnum,
	joined_at: z.string().datetime(),
	invited_by: uuidSchema.nullable(),
});
