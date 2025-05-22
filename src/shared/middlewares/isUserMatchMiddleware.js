export default function isUserMatchMiddleware() {
	return async (req, res, next) => {
		try {
			if (req.user.id !== req.params.userId) {
				return res.status(403).json({
					success: false,
					message: 'No tienes permiso para ver eso',
				});
			}

			next();
		} catch (error) {
			console.error('Error en isUserMatchMiddleware:', error);
			return res.status(500).json({
				success: false,
				message: 'Error al verificar coincidencia de usuario',
			});
		}
	};
}
