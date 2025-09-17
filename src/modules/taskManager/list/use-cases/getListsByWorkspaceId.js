export default function getListsByWorkspaceId(listRepository) {
	return async function (workspaceId) {
		try {
			return await listRepository.getByWorkspaceId(workspaceId);
		} catch (error) {
			throw new Error(
				`Error al obtener listas por workspace: ${error.message}`
			);
		}
	};
}
