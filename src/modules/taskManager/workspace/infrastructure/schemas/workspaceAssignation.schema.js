const { z } = require('zod');

const parentTypes = ['project', 'folder', 'list', 'task', 'subtask'];

const uuidSchema = z.string().regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido');

export const createAssignationSchema = z.object({
	userId: uuidSchema,
	workspaceId: uuidSchema,
	parentType: z.enum(parentTypes, {
		errorMap: () => ({
			message: `Parent type debe ser uno de: ${parentTypes.join(', ')}`,
		}),
	}),
	parentId: uuidSchema,
	assignedBy: z.string().uuid('Assigned by debe ser un UUID válido'),
});

export const getAssignationsByWorkspaceSchema = z.object({
	workspaceId: uuidSchema,
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});

export const getAssignationsByUserSchema = z.object({
	userId: z.string().uuid('User ID debe ser un UUID válido'),
	workspaceId: uuidSchema.optional(),
});

export const getAssignationsByParentSchema = z.object({
	parentType: z.enum(parentTypes),
	parentId: uuidSchema,
});

export const deleteAssignationSchema = z.object({
	id: z.string().uuid('ID debe ser un UUID válido'),
});
