export default class RepositoryUtils {
	async getHEX(id) {
		const product = await connection.execute(
			`SELECT HEX(UNHEX(REPLACE('${id}', '-',''))) uuid`
		);
		return product.rows[0].uuid || null;
	}
}
