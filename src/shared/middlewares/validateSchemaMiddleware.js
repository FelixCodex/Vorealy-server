export const validateSchema = schema => (req, res, next) => {
	try {
		schema.safeParse(req.body);
		next();
	} catch (error) {
		return res
			.status(406)
			.json({ error: error.errors.map(err => err.message) });
	}
};
