export default function getLastMessages(chatRepository) {
	return async function ({ conversationId, limit }) {
		try {
			const conversation = await chatRepository.getConversationById(
				conversationId
			);
			if (!conversation) {
				throw new Error('Conversacion no encontrada');
			}

			const messages = await chatRepository.getLastMessages({
				conversationId,
				limit,
			});

			return messages;
		} catch (error) {
			console.error('Error en ChatUseCases.getLastMessages:', error);
			throw error;
		}
	};
}
