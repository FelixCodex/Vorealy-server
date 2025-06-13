export default function sendAIMessage(sendMessage) {
	return async function ({
		conversationId,
		message,
		metadata = null,
		replyToId = null,
	}) {
		return await sendMessage({
			conversationId,
			senderId: null,
			senderType: 'ai',
			message,
			messageType: 'text',
			metadata,
			replyToId,
		});
	};
}
