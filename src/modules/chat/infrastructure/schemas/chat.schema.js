const { z } = require('zod');

// ========== ESQUEMAS BASE ==========

const parentTypeSchema = z.enum(['project', 'folder', 'list']);
const conversationTypeSchema = z.enum(['group', 'ai', 'direct']);
const senderTypeSchema = z.enum(['user', 'ai']);

const uuidSchema = z.string().regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido');
const idSchema = z.string().min(1).max(36);
const optionalUuidSchema = z
	.string()
	.regex(/^[a-fA-F0-9]{32}$/, 'UUID invalido')
	.optional()
	.nullable();

export const createConversationSchema = z.object({
	parentId: uuidSchema,
	parentType: parentTypeSchema,
	name: z.string().min(1).max(255).optional().nullable(),
	description: z.string().max(1000).optional().nullable(),
	type: conversationTypeSchema.default('group'),
});

export const updateConversationSchema = z.object({
	id: idSchema,
	name: z.string().min(1).max(255).optional().nullable(),
	description: z.string().max(1000).optional().nullable(),
});

export const getConversationsByParentSchema = z.object({
	parentId: uuidSchema,
	parentType: parentTypeSchema,
});

export const conversationIdSchema = z.object({
	id: idSchema,
});

export const createMessageSchema = z.object({
	conversationId: idSchema,
	senderId: optionalUuidSchema,
	senderType: senderTypeSchema.default('user'),
	message: z.string().min(1).max(5000),
	metadata: z.record(z.any()).optional().nullable(),
	replyToId: optionalUuidSchema,
});

export const getMessagesByConversationSchema = z.object({
	conversationId: idSchema,
	limit: z.number().int().min(1).max(100).default(50),
	offset: z.number().int().min(0).default(0),
	beforeId: optionalUuidSchema,
});

export const updateMessageSchema = z.object({
	id: idSchema,
	message: z.string().min(1).max(5000),
	metadata: z.record(z.any()).optional().nullable(),
});

export const messageIdSchema = z.object({
	id: idSchema,
});

export const searchMessagesSchema = z.object({
	conversationId: idSchema,
	searchTerm: z.string().min(1).max(100),
	limit: z.number().int().min(1).max(50).default(20),
});

export const getLastMessagesSchema = z.object({
	conversationId: uuidSchema,
	limit: z.number().int().min(1).max(50).default(10),
});

export const conversationResponseSchema = z.object({
	id: z.string(),
	parentId: z.string(),
	parentType: parentTypeSchema,
	name: z.string().nullable(),
	description: z.string().nullable(),
	type: conversationTypeSchema,
	isActive: z.boolean(),
	createdBy: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const messageResponseSchema = z.object({
	id: z.string(),
	conversationId: z.string(),
	senderId: z.string().nullable(),
	senderType: senderTypeSchema,
	message: z.string(),
	messageType: messageTypeSchema,
	metadata: z.record(z.any()).nullable(),
	isEdited: z.boolean(),
	editedAt: z.string().nullable(),
	replyToId: z.string().nullable(),
	replyMessage: z.string().nullable(),
	replySenderId: z.string().nullable(),
	replySenderType: senderTypeSchema.nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const conversationStatsResponseSchema = z.object({
	totalMessages: z.number(),
	uniqueSenders: z.number(),
	lastMessageAt: z.string().nullable(),
	firstMessageAt: z.string().nullable(),
});
