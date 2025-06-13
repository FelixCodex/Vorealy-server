export default function getMessagesByConversation(chatRepository) {
	return async function ({ conversationId, limit, offset, beforeId }) {
		try {
			const conversation = await chatRepository.getConversationById(
				conversationId
			);
			if (!conversation) {
				throw new Error('Conversacion no encontrada');
			}

			const messages = await chatRepository.getMessagesByConversation({
				conversationId,
				limit,
				offset,
				beforeId,
			});

			return {
				messages,
				conversation,
			};
		} catch (error) {
			console.error('Error en ChatUseCases.getMessagesByConversation:', error);
			throw error;
		}
	};
}
