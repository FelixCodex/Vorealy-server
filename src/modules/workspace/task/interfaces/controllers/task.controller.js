export function AuthController(userRepo) {
	return {
		async login(req, res) {
			try {
				const { remember } = req.body;
				const token_config = {
					...TOKEN_CONFIG,
					maxAge: remember ? t * 50 : t * 2,
				};
				const user = await authenticateUseCase(req.body);
				await asignAccessToken(res, token_config, { id: user.id });
				res.send(user);
			} catch (err) {
				res.status(400).json({ error: err.message });
			}
		},
	};
}
