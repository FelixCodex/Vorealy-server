export default function updateConversation(chatRepository) {
	return async function ({ id, name, description }) {
		try {
			const existingConversation = await chatRepository.getConversationById(id);
			if (!existingConversation) {
				throw new Error('Conversación no encontrada');
			}

			const updatedConversation = await chatRepository.updateConversation({
				id,
				name,
				description,
			});

			if (eventEmitter) {
				eventEmitter.emit('conversation:updated', {
					conversationId: id,
					changes: { name, description },
				});
			}

			return updatedConversation;
		} catch (error) {
			console.error('Error en ChatUseCases.updateConversation:', error);
			throw error;
		}
	};
}
