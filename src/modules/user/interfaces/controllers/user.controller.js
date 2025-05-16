import createUser from '../../use-case/createUser';

export function UserController(userRepo) {
	const createUserUseCase = createUser(userRepo);

	return {
		async create(req, res) {
			try {
				const user = await createUserUseCase(req.body);
				res.status(201).json(user);
			} catch (err) {
				res.status(400).json({ error: err.message });
			}
		},
	};
}
