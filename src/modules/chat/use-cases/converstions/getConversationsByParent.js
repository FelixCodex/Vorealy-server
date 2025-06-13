export default function getConversationsByParent(chatRepository) {
	return async function ({ parentId, parentType }) {
		try {
			const conversations = await chatRepository.getConversationsByParent({
				parentId,
				parentType,
			});

			return conversations;
		} catch (error) {
			console.error('Error en ChatUseCases.getConversationsByParent:', error);
			throw error;
		}
	};
}
