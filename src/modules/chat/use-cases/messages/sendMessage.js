import {
	generateRandomCharacters,
	getDateNow,
} from '../../../../shared/utils/utils.js';
import { Message } from '../../domain/entities/Message.js';
export default function sendMessage(chatRepository) {
	return async function ({
		conversationId,
		senderId,
		senderType,
		message,
		messageType,
		metadata,
		replyToId,
	}) {
		try {
			const conversation = await chatRepository.getConversationById(
				conversationId
			);
			if (!conversation) {
				throw new Error('Conversacion no encontrada');
			}

			if (replyToId) {
				const replyMessage = await chatRepository.getMessageById(replyToId);
				if (!replyMessage) {
					throw new Error('Mensaje de respuesta no encontrada');
				}
			}

			const now = getDateNow();
			const messageId = generateRandomCharacters();

			const messageCreated = new Message(
				messageId,
				conversationId,
				senderId,
				senderType,
				message,
				messageType,
				metadata,
				replyToId,
				now,
				now
			);

			await chatRepository.createMessage(message);

			if (eventEmitter) {
				eventEmitter.emit('message:sent', {
					conversationId,
					message: createdMessage,
					parentId: conversation.parent_id,
					parentType: conversation.parent_type,
				});
			}

			return messageCreated;
		} catch (error) {
			console.error('Error en ChatUseCases.sendMessage:', error);
			throw error;
		}
	};
}
