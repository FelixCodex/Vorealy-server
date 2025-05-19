import jwt from 'jsonwebtoken';

export function createAuthRequiredMiddelware(jwt_secret) {
	return function (req, res, next) {
		const { token } = req.cookies;
		if (!token)
			return res.status(401).json({ error: 'User not authenticated' });

		jwt.verify(token, jwt_secret, (err, user) => {
			if (err) {
				console.log('Something went wrong');
				return res.status(403).json({ error: ['Invalid token'] });
			}

			if (user.payload.id) {
				req.user.id = user.payload.id;
				next();
			}
			return res
				.status(403)
				.json({ error: ['User not authenticated from token'] });
		});
	};
}
