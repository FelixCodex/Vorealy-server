import dotenv from "dotenv";

dotenv.config();

export const DB_CONNECTION_DATA = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  port: process.env.MYSQLPORT,
  database: process.env.MYSQLDATABASE,
  password: process.env.MYSQLPASSWORD,
};

export const CLIENT_URL = "https://javier-david.com/";

export const SERVER_URL = "https://modelfantasy.up.railway.app/";

export const TURSO_URL = process.env.TURSO_URL;
export const TURSO_AUTH = process.env.TURSO_AUTH;

export const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;

export const TPP_CLIENT_ID = process.env.TPP_CLIENT_ID;
export const TPP_CLIENT_SECRET = process.env.TPP_CLIENT_SECRET;

export const QVAPAY_CLIENT_ID = process.env.QVAPAY_CLIENT_ID;
export const QVAPAY_CLIENT_SECRET = process.env.QVAPAY_CLIENT_SECRET;

export const OAUTH_REDIRECT_URI =
  "https://javier-david.com/app/d/oauth2callback";
