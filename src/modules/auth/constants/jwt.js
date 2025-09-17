export const day = 1000 * 60 * 60 * 24 * 38;
export const TOKEN_CONFIG = {
	httpOnly: true,
	secure: process.env.NODE_ENV == 'production',
	sameSite: 'Lax',
};
