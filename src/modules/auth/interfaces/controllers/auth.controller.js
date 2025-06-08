import { day, TOKEN_CONFIG } from '../../constants/jwt.js';
import { asignAccessToken } from '../../libs/jwt.js';
import authenticateUser from '../../use-cases/authenticate.js';
import createUser from '../../use-cases/createUser.js';
import bcrypt from 'bcryptjs';

const t = day;

export function AuthController(userRepo) {
	const authenticateUseCase = authenticateUser({
		userRepository: userRepo,
		compare: (pass, valPass) => bcrypt.compare(pass, valPass),
	});
	const createUserUseCase = createUser({
		userRepository: userRepo,
		encrypt: pass => bcrypt.hash(pass, 10),
	});

	return {
		async login(req, res) {
			try {
				const { remember } = req.body;
				const token_config = {
					...TOKEN_CONFIG,
					maxAge: remember ? t * 50 : t * 2,
				};
				const user = await authenticateUseCase(req.body);
				console.log(user);
				await asignAccessToken(res, token_config, { id: user.id });
				res.json(user);
			} catch (err) {
				res.status(400).json({ error: err.message });
			}
		},

		async logout(req, res) {
			const token_config = { ...TOKEN_CONFIG, maxAge: 1 };
			res.cookie('token', '', token_config);
			res.status(200).json({ message: 'Logout exitoso' });
		},

		async register(req, res) {
			try {
				const user = await createUserUseCase(req.body);
				console.log(user);
				const token_config = { ...TOKEN_CONFIG, maxAge: t * 20 };
				await asignAccessToken(res, token_config, { id: user.id });
				res.json(user);
			} catch (err) {
				res.status(400).json({ error: err.message });
			}
		},

		async validate(req, res) {
			const id = req.user.id;
			try {
				const user = await userRepo.getById(id);
				const token_config = { ...TOKEN_CONFIG, maxAge: 1 };
				if (user) {
					return res.send(user);
				}
				res.status(404).cookie('token', '', token_config);
				return res.json({ error: ['User not found'] });
			} catch (err) {
				res.status(400).json({ error: err.message });
			}
		},
	};
}
