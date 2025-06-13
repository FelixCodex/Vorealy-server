import createConversation from '../../use-cases/converstions/createConversation.js';
import deleteConversation from '../../use-cases/converstions/deleteConversation.js';
import getConversationById from '../../use-cases/converstions/getConversationById.js';
import getConversationsByParent from '../../use-cases/converstions/getConversationsByParent.js';
import getConversationStats from '../../use-cases/converstions/getConversationStats.js';
import updateConversation from '../../use-cases/converstions/updateConversation.js';
import deleteMessage from '../../use-cases/messages/deleteMessage.js';
import getLastMessages from '../../use-cases/messages/getLastMessages.js';
import getMessagesByConversation from '../../use-cases/messages/getMessagesByConversation.js';
import searchMessages from '../../use-cases/messages/searchMessages.js';
import sendMessage from '../../use-cases/messages/sendMessage.js';
import updateMessage from '../../use-cases/messages/updateMessage.js';

export default function createChatController(
	chatRepository,
	projectRepository,
	folderRepository,
	listRepository
) {
	const createConversationUseCase = createConversation(
		chatRepository,
		projectRepository,
		folderRepository,
		listRepository
	);
	const deleteConversationUseCase = deleteConversation(chatRepository);
	const getConversationByIdUseCase = getConversationById(chatRepository);
	const getConversationsByParentUseCase =
		getConversationsByParent(chatRepository);
	const getConversationStatsUseCase = getConversationStats(chatRepository);
	const updateConversationUseCase = updateConversation(chatRepository);
	const deleteMessageUseCase = deleteMessage(chatRepository);
	const getLastMessagesUseCase = getLastMessages(chatRepository);
	const getMessagesByConversationUseCase =
		getMessagesByConversation(chatRepository);
	const searchMessagesUseCase = searchMessages(chatRepository);
	const sendMessageUseCase = sendMessage(chatRepository);
	const updateMessageUseCase = updateMessage(chatRepository);

	return {
		async createConversation(req, res) {
			try {
				const { parentId, parentType, name, description, type } = req.body;
				const userId = req.user.id;

				const conversation = await createConversationUseCase({
					parentId,
					parentType,
					name,
					description,
					type,
					createdBy: userId,
				});

				return res.status(201).json({
					success: true,
					data: conversation,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al crear conversación',
				});
			}
		},

		async deleteConversation(req, res) {
			try {
				const { conversationId } = req.params;

				const result = await deleteConversationUseCase(conversationId);

				return res.status(200).json({
					success: true,
					data: result,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al eliminar conversación',
				});
			}
		},

		async getConversationById(req, res) {
			try {
				const { conversationId } = req.params;

				const conversation = await getConversationByIdUseCase(conversationId);

				return res.status(200).json({
					success: true,
					data: conversation,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener conversación',
				});
			}
		},

		async getConversationsByParent(req, res) {
			try {
				const { parentId, parentType } = req.params;

				const conversations = await getConversationsByParentUseCase({
					parentId,
					parentType,
				});

				return res.status(200).json({
					success: true,
					data: conversations,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener conversaciones',
				});
			}
		},

		async getConversationStats(req, res) {
			try {
				const { conversationId } = req.params;

				const stats = await getConversationStatsUseCase(conversationId);

				return res.status(200).json({
					success: true,
					data: stats,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					message:
						error.message || 'Error al obtener estadísticas de conversación',
				});
			}
		},

		async updateConversation(req, res) {
			try {
				const { conversationId } = req.params;
				const { name, description } = req.body;

				const updatedConversation = await updateConversationUseCase({
					id: conversationId,
					name,
					description,
				});

				return res.status(200).json({
					success: true,
					data: updatedConversation,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al actualizar conversación',
				});
			}
		},

		async deleteMessage(req, res) {
			try {
				const { messageId } = req.params;
				const userId = req.user.id;

				const result = await deleteMessageUseCase({
					id: messageId,
					userId,
				});

				return res.status(200).json({
					success: true,
					data: result,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al eliminar mensaje',
				});
			}
		},

		async getLastMessages(req, res) {
			try {
				const { conversationId } = req.params;
				const { limit = 20 } = req.query;

				const messages = await getLastMessagesUseCase({
					conversationId,
					limit: parseInt(limit),
				});

				return res.status(200).json({
					success: true,
					data: messages,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener últimos mensajes',
				});
			}
		},

		async getMessagesByConversation(req, res) {
			try {
				const { conversationId } = req.params;
				const { limit = 20, offset = 0, beforeId } = req.query;

				const result = await getMessagesByConversationUseCase({
					conversationId,
					limit: parseInt(limit),
					offset: parseInt(offset),
					beforeId,
				});

				return res.status(200).json({
					success: true,
					data: result,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener mensajes de conversación',
				});
			}
		},

		async searchMessages(req, res) {
			try {
				const { conversationId } = req.params;
				const { searchTerm, limit = 20 } = req.query;

				const messages = await searchMessagesUseCase({
					conversationId,
					searchTerm,
					limit: parseInt(limit),
				});

				return res.status(200).json({
					success: true,
					data: messages,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al buscar mensajes',
				});
			}
		},

		async sendMessage(req, res) {
			try {
				const { conversationId } = req.params;
				const { message, messageType, metadata, replyToId } = req.body;
				const userId = req.user.id;

				const createdMessage = await sendMessageUseCase({
					conversationId,
					senderId: userId,
					senderType: 'user',
					message,
					messageType,
					metadata,
					replyToId,
				});

				return res.status(201).json({
					success: true,
					data: createdMessage,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al enviar mensaje',
				});
			}
		},

		async updateMessage(req, res) {
			try {
				const { messageId } = req.params;
				const { message, metadata } = req.body;
				const userId = req.user.id;

				const updatedMessage = await updateMessageUseCase({
					id: messageId,
					message,
					metadata,
					userId,
				});

				return res.status(200).json({
					success: true,
					data: updatedMessage,
				});
			} catch (error) {
				return res.status(500).json({
					success: false,
					message: error.message || 'Error al actualizar mensaje',
				});
			}
		},
	};
}
