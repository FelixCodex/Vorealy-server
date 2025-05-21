/**
 * Middleware para verificar si un item pertenece al workspace especificado
 * Soporta uno o múltiples parámetros de identificación
 *
 * @param {Object} repository - Repositorio con el método para obtener el item
 * @param {string|string[]} identify - Nombre(s) del parámetro que contiene el ID del item (por defecto: 'id')
 * @param {string} method - Método del repositorio a utilizar (por defecto: 'getById')
 * @returns {Function} Middleware de Express
 */
export default function workspaceMatchMiddleware(
	repository,
	identify = 'id',
	method = 'getById'
) {
	if (!repository || typeof repository !== 'object') {
		throw new Error('Se requiere un repositorio válido');
	}

	if (!repository[method] || typeof repository[method] !== 'function') {
		throw new Error(
			`El método '${method}' no existe en el repositorio o no es una función`
		);
	}

	return async (req, res, next) => {
		try {
			const workspaceId = req.params.workspaceId;

			if (!workspaceId) {
				return res.status(400).json({
					success: false,
					message: 'ID de workspace no proporcionado',
				});
			}

			let itemIds = [];

			if (Array.isArray(identify)) {
				// Caso: múltiples parámetros de identificación
				itemIds = identify.map(param => req.params[param]);

				// Verificar que todos los IDs estén presentes
				const missingParams = identify.filter(
					(param, index) => !itemIds[index]
				);
				if (missingParams.length > 0) {
					return res.status(400).json({
						success: false,
						message: `Parámetros requeridos no proporcionados: ${missingParams.join(
							', '
						)}`,
					});
				}
			} else {
				// Caso: un solo parámetro de identificación
				const itemId = req.params[identify];
				if (!itemId) {
					return res.status(400).json({
						success: false,
						message: `ID de ${identify} no proporcionado`,
					});
				}
				itemIds = [itemId];
			}

			const item = await repository[method].apply(repository, itemIds);

			if (!item) {
				return res.status(404).json({
					success: false,
					message: 'Item no encontrado',
				});
			}

			if (Array.isArray(item)) {
				if (item.length === 0) {
					return res.status(404).json({
						success: false,
						message: 'No se encontraron items',
					});
				}

				const matchingItem = item.some(
					i => String(i.workspace_id) === String(workspaceId)
				);

				if (matchingItem) {
					return next();
				}
			} else {
				if (String(item.workspace_id) === String(workspaceId)) {
					return next();
				}
			}

			return res.status(403).json({
				success: false,
				message: 'El item no pertenece al workspace especificado',
			});
		} catch (error) {
			console.error(`Error en workspaceMatchMiddleware: ${error.message}`);

			if (error.message.includes('no encontrado')) {
				return res.status(404).json({
					success: false,
					message: error.message,
				});
			}

			return res.status(500).json({
				success: false,
				message: 'Error al verificar coincidencia con el workspace',
				error:
					process.env.NODE_ENV === 'development' ? error.message : undefined,
			});
		}
	};
}
