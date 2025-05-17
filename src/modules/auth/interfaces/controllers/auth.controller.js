import { day, TOKEN_CONFIG } from '../../constants/jwt.js';
import { asignAccessToken } from '../../libs/jwt.js';
import authentication from '../../use-cases/authenticate.js';
import createUser from '../../use-cases/createUser.js';

const t = day;

export function AuthController(userRepo) {
	const authenticateUseCase = authentication(userRepo);
	const createUserUseCase = createUser(userRepo);

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

		async logout(req, res) {
			const token_config = { ...TOKEN_CONFIG, maxAge: 1 };
			res.cookie('token', '', token_config);
			res.sendStatus(200);
			req.logout(() => {
				res.json({ message: 'Logout exitoso' });
			});
		},

		async register(req, res) {
			try {
				const user = await createUserUseCase(req.body);
				const token_config = { ...TOKEN_CONFIG, maxAge: t * 20 };
				await asignAccessToken(res, token_config, { id: user.id });
				res.send(user);
			} catch (err) {
				res.status(400).json({ error: err.message });
			}
		},

		async validate(req, res) {
			const { id } = req.auth;
			try {
				const user = await userRepo.getById(id);
				const token_config = { ...TOKEN_CONFIG, maxAge: 1 };
				if (user) {
					return res.send(user);
				}
				res.status(404).cookie('token', '', token_config);
				return res.send({ error: ['User not found'] });
			} catch (error) {
				res.status(400).json({ error: err.message });
			}
		},
	};
}
