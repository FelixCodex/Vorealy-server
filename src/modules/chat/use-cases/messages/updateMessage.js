export default function updateMessage(chatRepository) {
	return async function ({ id, message, metadata, userId }) {
		try {
			const existingMessage = await chatRepository.getMessageById(id);
			if (!existingMessage) {
				throw new Error('Mensaje no encontrado');
			}

			if (
				existingMessage.sender_type === 'user' &&
				existingMessage.sender_id !== userId
			) {
				throw new Error('No tienes permisos para editar este mensaje');
			}

			const updatedMessage = await chatRepository.updateMessage({
				id,
				message,
				metadata,
			});

			if (eventEmitter) {
				eventEmitter.emit('message:updated', {
					conversationId: existingMessage.conversation_id,
					message: updatedMessage,
				});
			}

			return updatedMessage;
		} catch (error) {
			console.error('Error en ChatUseCases.updateMessage:', error);
			throw error;
		}
	};
}
