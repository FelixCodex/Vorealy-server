export class Workspace {
	constructor(
		id,
		owner_id,
		name,
		icon_id,
		color,
		created_at = new Date(),
		updated_at = new Date()
	) {
		this.id = id;
		this.owner_id = owner_id;
		this.name = name;
		this.icon_id = icon_id;
		this.color = color;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}
}
