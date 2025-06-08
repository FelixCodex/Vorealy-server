import createNotification from '../../use-cases/createNotification.js';

export class NotificationService {
	constructor(Repository) {
		this.Repository = Repository;
	}

	async createNotification({ recipientId, type, title, message, data }) {
		try {
			const createNotificationUseCase = createNotification(this.Repository);
			const result = await createNotificationUseCase({
				recipientId,
				type,
				title,
				message,
				data,
			});

			return result;
		} catch (error) {
			throw error;
		}
	}
}
