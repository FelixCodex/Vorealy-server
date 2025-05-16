import { createClient } from '@libsql/client';
import { TURSO_AUTH, TURSO_URL } from './config.js';

const connection = createClient({
	url: TURSO_URL,
	authToken: TURSO_AUTH,
});

console.log('>> DB CONNECTED');

export async function connect() {
	return connection;
}
