export const day = 1000 * 60 * 60 * 24 * 38;
export const TOKEN_CONFIG = {
	httpOnly: false,
	secure: process.env.NODE_ENV == 'production',
	sameSite: 'none',
};
