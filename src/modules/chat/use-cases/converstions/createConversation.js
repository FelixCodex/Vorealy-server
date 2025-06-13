import {
	generateRandomCharacters,
	getDateNow,
} from '../../../../shared/utils/utils.js';
import { Conversation } from '../../domain/entities/Conversation.js';

export default function createConversation({
	chatRepository,
	projectRepository,
	folderRepository,
	listRepository,
	eventEmitter,
}) {
	return async function ({
		workspaceId,
		parentId,
		parentType,
		name,
		description,
		type,
		createdBy,
	}) {
		if (!['project', 'folder', 'list'].includes(parentType)) {
			throw new Error('El tipo de padre es invalido');
		}

		try {
			let parent;
			if (parentType == 'project') {
				parent = await projectRepository.getById(parentId);
				if (!parent) {
					throw new Error('Proyecto padre no encontrado');
				}
			} else if (parentType == 'folder') {
				parent = await folderRepository.getById(parentId);
				if (!parent) {
					throw new Error('Carpeta padre no encontrado');
				}
			} else if (parentType == 'list') {
				parent = await listRepository.getById(parentId);
				if (!parent) {
					throw new Error('Lista padre no encontrado');
				}
			} else {
				throw new Error('El tipo de padre es invalido');
			}

			if (parent.workspace_id != workspaceId) {
				throw new Error(
					'No tienes permitido crear una conversacion desde otro workspace'
				);
			}

			const conversationId = generateRandomCharacters(36);

			const now = getDateNow();

			const conversation = new Conversation(
				conversationId,
				workspaceId,
				parentId,
				parentType,
				name,
				description,
				type,
				createdBy,
				now,
				now
			);

			await chatRepository.createConversation(conversation);

			if (eventEmitter) {
				eventEmitter.emit('conversation:created', {
					conversationId,
					parentId,
					parentType,
					type,
					createdBy,
				});
			}

			return conversation;
		} catch (error) {
			console.error('Error en ChatUseCases.createConversation:', error);
			throw error;
		}
	};
}
