import { z } from 'zod';

const uuidSchema = z.string().regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido');

const jsonVal = z.string().refine(
	val => {
		try {
			JSON.parse(val);
			return true;
		} catch {
			return false;
		}
	},
	{
		message: 'Debe ser una cadena JSON válida',
	}
);

const projectVisibilityEnum = z.enum(['public', 'private'], {
	errorMap: () => ({
		message: 'Visibilidad inválida. Debe ser "public" o "private".',
	}),
});

const projectCoreSchema = z.object({
	name: z
		.string()
		.min(1, 'El nombre del proyecto no puede estar vacío')
		.max(255, 'El nombre del proyecto no puede exceder los 255 caracteres'),

	description: z.string().optional(),

	color: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			'Formato de color hexadecimal inválido (ej. #RRGGBB o #RGB)'
		)
		.default('#D1D5DB')
		.optional(),

	icon: z.number().max(255).optional(),

	visibility: projectVisibilityEnum.default('public').optional(),

	featuresEnabled: jsonVal.optional(),
	automationRules: jsonVal.optional(),

	estimatedHours: z
		.number()
		.positive('Las horas estimadas deben ser un número positivo')
		.optional(),

	workingDays: jsonVal.optional(),
	workingHours: jsonVal.optional(),
	holidays: jsonVal.optional(),
	tags: jsonVal.optional(),
	metadata: jsonVal.optional(),
});

export const createProjectInputSchema = projectCoreSchema.extend({
	workspaceId: uuidSchema.nonempty(
		'El ID del workspace es requerido para crear un proyecto'
	),
});

export const updateProjectInputSchema = projectCoreSchema.partial().extend({
	updatedBy: uuidSchema.optional(),
});

export const projectIdParamSchema = z.object({
	id: uuidSchema.nonempty('El ID del proyecto es requerido'),
});

export const projectWorkspaceIdParamSchema = z.object({
	workspaceId: uuidSchema.nonempty('El ID del workspace es requerido'),
});

export const projectEntitySchema = projectCoreSchema.extend({
	id: uuidSchema,
	workspaceId: uuidSchema,
	createdAt: z.string().datetime(),
	createdBy: uuidSchema,
	updatedAt: z.string().datetime(),
	updatedBy: uuidSchema.nullable(),
	completedAt: z.string().datetime().nullable(),
});
