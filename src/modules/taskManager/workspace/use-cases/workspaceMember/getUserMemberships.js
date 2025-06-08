export default function getUserMemberships(workspaceMemberRepository) {
	return async function (userId) {
		try {
			return await workspaceMemberRepository.getByUserId(userId);
		} catch (error) {
			console.log(error);
			throw new Error(`Error al obtener las membresias del usuario: ${userId}`);
		}
	};
}
