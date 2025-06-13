export default function getConversationStats(chatRepository) {
	return async function (id) {
		try {
			const conversation = await chatRepository.getConversationById(id);
			if (!conversation) {
				throw new Error('Conversación no encontrada');
			}

			const stats = await chatRepository.getConversationStats(id);

			return stats;
		} catch (error) {
			console.error('Error en ChatUseCases.getConversationStats:', error);
			throw error;
		}
	};
}
