export default function searchMessages(chatRepository) {
	return async function ({ conversationId, searchTerm, limit }) {
		try {
			const conversation = await chatRepository.getConversationById(
				conversationId
			);
			if (!conversation) {
				throw new Error('Conversacion no encontrada');
			}

			const messages = await chatRepository.searchMessages({
				conversationId,
				searchTerm,
				limit,
			});

			return messages;
		} catch (error) {
			console.error('Error en ChatUseCases.searchMessages:', error);
			throw error;
		}
	};
}
