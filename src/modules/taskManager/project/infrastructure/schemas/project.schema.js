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
		.default('#4169E1')
		.optional(),

	icon: z
		.string()
		.max(100, 'El icono no puede exceder los 100 caracteres')
		.optional(),

	visibility: projectVisibilityEnum.default('public').optional(),

	features_enabled: jsonVal.optional(),
	automation_rules: jsonVal.optional(),

	estimated_hours: z
		.number()
		.positive('Las horas estimadas deben ser un número positivo')
		.optional(),

	working_days: jsonVal.optional(),
	working_hours: jsonVal.optional(),
	holidays: jsonVal.optional(),
	tags: jsonVal.optional(),
	metadata: jsonVal.optional(),
});

export const createProjectInputSchema = projectCoreSchema.extend({
	workspace_id: uuidSchema.nonempty(
		'El ID del workspace es requerido para crear un proyecto'
	),
});

export const updateProjectInputSchema = projectCoreSchema.partial().extend({
	updated_by: uuidSchema.optional(),
});

export const projectIdParamSchema = z.object({
	id: uuidSchema.nonempty('El ID del proyecto es requerido'),
});

export const projectWorkspaceIdParamSchema = z.object({
	workspaceId: uuidSchema.nonempty('El ID del workspace es requerido'),
});

export const projectEntitySchema = projectCoreSchema.extend({
	id: uuidSchema,
	workspace_id: uuidSchema,
	created_at: z.string().datetime(),
	created_by: uuidSchema,
	updated_at: z.string().datetime(),
	updated_by: uuidSchema.nullable(),
	completed_at: z.string().datetime().nullable(),
});
