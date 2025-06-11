import { connect } from './connection.js';

class NotificationRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async createNotification({
		id,
		recipientId,
		type,
		title,
		message = null,
		data,
	}) {
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO notifications 
            (id, recipient_id, type, title, message, data) 
            VALUES (?, UNHEX(?), ?, ?, ?, ?)`,
				[id, recipientId, type, title, message, JSON.stringify(data)]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en NotificationRepository.createNotification:', err);
			throw err;
		}
	}

	async getNotificationsByUser(userId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT * FROM notifications 
            WHERE recipient_id = UNHEX(?)
            ORDER BY created_at DESC`,
				[userId]
			);
			return rows.map(row => ({
				...row,
				data: JSON.parse(row.data),
			}));
		} catch (err) {
			console.error(
				'Error en NotificationRepository.getUserNotifications:',
				err
			);
			throw err;
		}
	}

	async markAsRead(notificationId) {
		try {
			await this.connection.execute(
				`UPDATE notifications 
				SET is_read = TRUE
				WHERE id = ?`,
				[notificationId]
			);
			return true;
		} catch (err) {
			console.error('Error en NotificationRepository.markAsRead:', err);
			throw err;
		}
	}
}

const NotificationRepository = new NotificationRepositoryClass(await connect());

export default NotificationRepository;
