export default function getConversationById(chatRepository) {
	return async function (id) {
		try {
			const conversation = await chatRepository.getConversationById(id);

			if (!conversation) {
				throw new Error('Conversación no encontrada');
			}

			return conversation;
		} catch (error) {
			console.error('Error en ChatUseCases.getConversationById:', error);
			throw error;
		}
	};
}
