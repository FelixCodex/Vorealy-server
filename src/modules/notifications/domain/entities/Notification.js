export class Notification {
	constructor(
		id,
		recipientId,
		type,
		title,
		message,
		data,
		isRead = false,
		createdAt = new Date()
	) {
		this.id = id;
		this.recipientId = recipientId;
		this.type = type;
		this.title = title;
		this.message = message;
		this.data = data;
		this.isRead = isRead;
		this.createdAt = createdAt;
	}
}
