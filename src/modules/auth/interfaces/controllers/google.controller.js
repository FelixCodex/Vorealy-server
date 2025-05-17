import { day, TOKEN_CONFIG } from '../../constants/jwt.js';

const t = day * 38;
const token_config = { ...TOKEN_CONFIG, maxAge: t };
const auth_config = { scope: ['profile', 'email'] };

export function GoogleController({ passport, CLIENT_URL }) {
	return {
		auth: passport.authenticate('google', auth_config)(req, res, next),

		authCallback: passport.authenticate('google', {
			successRedirect: '/app/auth/success',
			failureRedirect: '/app/auth/failure',
		})(req, res, next),

		async authSuccess(req, res) {
			if (!req.user) {
				return res.redirect(
					`${CLIENT_URL}login?error=${encodeURIComponent(req.errorMessage)}`
				);
			}
			await asignAccessToken(res, token_config, { id: req.user.id });
			return res.redirect(`${CLIENT_URL}`);
		},

		async authFailure(req, res) {
			const errorMessage = req.session.messages?.[0] || 'Error desconocido';
			res.redirect(
				`${CLIENT_URL}login?error=${encodeURIComponent(errorMessage)}`
			);
		},
	};
}
