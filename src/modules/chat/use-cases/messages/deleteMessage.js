export default function deleteMessage(chatRepository) {
	return async function ({ id, userId }) {
		try {
			const message = await chatRepository.getMessageById(id);
			if (!message) {
				throw new Error('Mensaje no encontrada');
			}

			if (message.sender_type === 'user' && message.sender_id !== userId) {
				throw new Error('No tienes permisos para eliminar este mensaje');
			}

			await chatRepository.deleteMessage(id);

			if (eventEmitter) {
				eventEmitter.emit('message:deleted', {
					conversationId: message.conversation_id,
					messageId: id,
				});
			}

			return true;
		} catch (error) {
			console.error('Error en ChatUseCases.deleteMessage:', error);
			throw error;
		}
	};
}
