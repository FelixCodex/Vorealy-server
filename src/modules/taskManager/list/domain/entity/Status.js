export class Status {
	constructor(
		id,
		listId,
		name,
		color = '#808080',
		createdBy,
		createdAt,
		updated_by,
		updatedAt = new Date()
	) {
		this.id = id;
		this.listId = listId;
		this.name = name;
		this.color = color;
		this.createdBy = createdBy;
		this.createdAt = createdAt;
		this.updated_by = updated_by;
		this.updatedAt = updatedAt;
	}
}
