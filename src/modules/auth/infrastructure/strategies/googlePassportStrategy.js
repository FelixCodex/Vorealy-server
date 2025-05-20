import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import crypto from 'node:crypto';
import { AUTHENTICATION_ERROR, CREATING_ERROR } from '../../constants/errors';

export function configureGoogleStrategy(
	passport,
	{ userRepository, CLIENT_URL }
) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
				clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
				callbackURL: CLIENT_URL + 'app/auth/google/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				const googleUser = {
					id: profile.id,
					name: profile.displayName,
					email: profile.emails?.[0]?.value,
				};

				try {
					const user = await userRepository.getByEmail(googleUser.email);

					if (!user) {
						const password = generateRandomPassword(20);
						const id = crypto.randomUUID();

						const userCreated = await userRepository.create({
							id,
							username: googleUser.name,
							password,
							email: googleUser.email,
						});

						if (!userCreated) throw new Error(CREATING_ERROR);
						return done(null, userCreated);
					}

					return done(null, user);
				} catch (err) {
					console.error(err);
					const error = CREATING_ERROR ? err : new Error(AUTHENTICATION_ERROR);
					return done(null, false, { message: error.message });
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((obj, done) => {
		done(null, obj);
	});
}
