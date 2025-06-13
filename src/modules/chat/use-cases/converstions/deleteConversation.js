import { getDateNow } from '../../../../shared/utils/utils.js';

export default function deleteConversation({ chatRepository, eventEmitter }) {
	return async function (id) {
		try {
			const conversation = await chatRepository.getConversationById(id);
			if (!conversation) {
				throw new Error('Conversación no encontrada');
			}

			const now = getDateNow();

			await chatRepository.deactivateConversation(id, now);

			if (eventEmitter) {
				eventEmitter.emit('conversation:deleted', {
					conversationId: id,
				});
			}

			return true;
		} catch (error) {
			console.error('Error en ChatUseCases.deleteConversation:', error);
			throw error;
		}
	};
}
