import { z } from 'zod';

export const CreateWorkspaceSchema = z.object({
	name: z.string().min(3),
	icon: z.number().min(0),
	color: z.string().min(7),
});

export const UpdateWorkspaceSchema = z.object({
	name: z.string().min(3).optional(),
	icon: z.number().min(0).optional(),
	color: z.string().min(7).optional(),
});
