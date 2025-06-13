export class Message {
	constructor(
		id,
		conversation_id,
		sender_id,
		sender_type,
		message,
		metadata,
		is_edited,
		edited_at,
		reply_to_id,
		created_at = new Date(),
		updated_at = new Date()
	) {
		this.id = id;
		this.conversation_id = conversation_id;
		this.sender_id = sender_id;
		this.sender_type = sender_type;
		this.message = message;
		this.metadata = metadata;
		this.is_edited = is_edited;
		this.edited_at = edited_at;
		this.reply_to_id = reply_to_id;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}
}
