import { connect } from './connection.js';

class ChatRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async createConversation({
		id,
		workspaceId,
		parentId,
		parentType,
		name = null,
		description = null,
		type = 'group',
		createdBy,
		now,
	}) {
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO chat_conversations 
                (id,workspace_id, parent_id, parent_type, name, description, type, created_by,created_at,updated_at) 
                VALUES (?, UNHEX(?), UNHEX(?), ?, ?, ?, UNHEX(?), ?, ?)`,
				[
					id,
					workspaceId,
					parentId,
					parentType,
					name,
					description,
					type,
					createdBy,
					now,
					now,
				]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en ChatRepository.createConversation:', err);
			throw err;
		}
	}

	async getConversationsByParent({ parentId, parentType }) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT * FROM chat_conversations 
                WHERE parent_id = ? AND parent_type = ? AND is_active = TRUE
                ORDER BY updated_at DESC`,
				[parentId, parentType]
			);
			return rows;
		} catch (err) {
			console.error('Error en ChatRepository.getConversationsByParent:', err);
			throw err;
		}
	}

	async getConversationById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT * FROM chat_conversations WHERE id = ? AND is_active = TRUE`,
				[id]
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en ChatRepository.getConversationById:', err);
			throw err;
		}
	}

	async updateConversation({ id, name = null, description = null, now }) {
		try {
			const updates = [];
			const values = [];

			if (name !== null) {
				updates.push('name = ?');
				values.push(name);
			}
			if (description !== null) {
				updates.push('description = ?');
				values.push(description);
			}

			if (updates.length === 0) return null;

			updates.push('updated_at = ?');
			values.push(now);
			values.push(id);

			const { rows } = await this.connection.execute(
				`UPDATE chat_conversations SET ${updates.join(
					', '
				)} WHERE id = ? RETURNING *`,
				values
			);
			return rows[0];
		} catch (err) {
			console.error('Error en ChatRepository.updateConversation:', err);
			throw err;
		}
	}

	async deactivateConversation(id, now) {
		try {
			const { rows } = await this.connection.execute(
				`UPDATE chat_conversations 
                SET is_active = FALSE, updated_at = ? 
                WHERE id = ?`,
				[now, id]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en ChatRepository.deactivateConversation:', err);
			throw err;
		}
	}

	async createMessage({
		id,
		conversationId,
		senderId = null,
		senderType = 'user',
		message,
		messageType = 'text',
		metadata = null,
		replyToId = null,
		createAt,
		updatedAt,
	}) {
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO chat_messages 
                (id, conversation_id, sender_id, sender_type, message, message_type, metadata, reply_to_id,created_at,updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					id,
					conversationId,
					senderId,
					senderType,
					message,
					messageType,
					metadata ? JSON.stringify(metadata) : null,
					replyToId,
					createAt,
					updatedAt,
				]
			);

			await this.connection.execute(
				`UPDATE chat_conversations 
                SET updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?`,
				[conversationId]
			);

			return rows[0];
		} catch (err) {
			console.error('Error en ChatRepository.createMessage:', err);
			throw err;
		}
	}

	async getMessagesByConversation({
		conversationId,
		limit = 50,
		offset = 0,
		beforeId = null,
	}) {
		try {
			let query = `
                SELECT 
                    m.*,
                    reply.message as reply_message,
                    reply.sender_id as reply_sender_id,
                    reply.sender_type as reply_sender_type
                FROM chat_messages m
                LEFT JOIN chat_messages reply ON m.reply_to_id = reply.id
                WHERE m.conversation_id = ?
            `;
			const params = [conversationId];

			if (beforeId) {
				query += ` AND m.created_at < (
                    SELECT created_at FROM chat_messages WHERE id = ?
                )`;
				params.push(beforeId);
			}

			query += ` ORDER BY m.created_at DESC LIMIT ? OFFSET ?`;
			params.push(limit, offset);

			const { rows } = await this.connection.execute(query, params);

			return rows.map(row => ({
				...row,
				metadata: row.metadata ? JSON.parse(row.metadata) : null,
			}));
		} catch (err) {
			console.error('Error en ChatRepository.getMessagesByConversation:', err);
			throw err;
		}
	}

	async getMessageById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
                    m.*,
                    reply.message as reply_message,
                    reply.sender_id as reply_sender_id,
                    reply.sender_type as reply_sender_type
                FROM chat_messages m
                LEFT JOIN chat_messages reply ON m.reply_to_id = reply.id
                WHERE m.id = ?`,
				[id]
			);

			if (rows[0]) {
				rows[0].metadata = rows[0].metadata
					? JSON.parse(rows[0].metadata)
					: null;
			}

			return rows[0] || null;
		} catch (err) {
			console.error('Error en ChatRepository.getMessageById:', err);
			throw err;
		}
	}

	async updateMessage({ id, message, metadata = null, now }) {
		try {
			const { rows } = await this.connection.execute(
				`UPDATE chat_messages 
                SET message = ?, metadata = ?, is_edited = TRUE, edited_at = ?, updated_at = ?
                WHERE id = ? RETURNING *`,
				[message, metadata ? JSON.stringify(metadata) : null, now, now, id]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en ChatRepository.updateMessage:', err);
			throw err;
		}
	}

	async deleteMessage({ id }) {
		try {
			const { rows } = await this.connection.execute(
				`DELETE FROM chat_messages WHERE id = ?`,
				[id]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en ChatRepository.deleteMessage:', err);
			throw err;
		}
	}

	async getLastMessages({ conversationId, limit = 10 }) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT * FROM chat_messages 
                WHERE conversation_id = ? 
                ORDER BY created_at DESC 
                LIMIT ?`,
				[conversationId, limit]
			);

			return rows
				.map(row => ({
					...row,
					metadata: row.metadata ? JSON.parse(row.metadata) : null,
				}))
				.reverse();
		} catch (err) {
			console.error('Error en ChatRepository.getLastMessages:', err);
			throw err;
		}
	}

	async searchMessages({ conversationId, searchTerm, limit = 20 }) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT * FROM chat_messages 
                WHERE conversation_id = ? AND message LIKE ? 
                ORDER BY created_at DESC 
                LIMIT ?`,
				[conversationId, `%${searchTerm}%`, limit]
			);

			return rows.map(row => ({
				...row,
				metadata: row.metadata ? JSON.parse(row.metadata) : null,
			}));
		} catch (err) {
			console.error('Error en ChatRepository.searchMessages:', err);
			throw err;
		}
	}

	async getConversationStats({ conversationId }) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
                    COUNT(*) as total_messages,
                    COUNT(DISTINCT sender_id) as unique_senders,
                    MAX(created_at) as last_message_at,
                    MIN(created_at) as first_message_at
                FROM chat_messages 
                WHERE conversation_id = ?`,
				[conversationId]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en ChatRepository.getConversationStats:', err);
			throw err;
		}
	}
}

const ChatRepository = new ChatRepositoryClass(await connect());
export default ChatRepository;
