import crypto from 'node:crypto';
export default function createList(listRepository) {
	return async function (listData) {
		try {
			if (!listData.name || !listData.parentId || !listData.parentType) {
				throw new Error(
					'El nombre de la lista, el ID del padre y el tipo de padre son obligatorios'
				);
			}

			if (!['project', 'folder'].includes(listData.parentType)) {
				throw new Error(
					'El tipo de padre debe ser workspace, project o folder'
				);
			}

			const now = new Date().toISOString();

			const list = new List(
				crypto.randomUUID(),
				listData.name,
				listData.color,
				listData.description,
				listData.parent_id,
				listData.parent_type,
				listData.workspace_id,
				listData.created_by,
				now,
				now,
				listData.automation_rules,
				listData.assigned_to,
				listData.default_states,
				listData.statuses,
				listData.priority,
				listData.is_private,
				listData.estimated_time
			);

			return await listRepository.create(list);
		} catch (error) {
			throw new Error(`Error al crear lista: ${error.message}`);
		}
	};
}
