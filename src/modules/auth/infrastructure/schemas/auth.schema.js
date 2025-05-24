import { z } from 'zod';

export const LoginSchema = z.object({
	password: z.string().min(6),
	email: z.string(),
});
export const RegisterSchema = z.object({
	password: z.string().min(6),
	email: z.string(),
	username: z.string().min(3),
});
