export class User {
	constructor({ id, name, email }) {
		if (!name || !email) throw new Error('Name and email are required');
		this.id = id;
		this.name = name;
		this.email = email;
	}
}
