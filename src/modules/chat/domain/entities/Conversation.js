export class Conversation {
	constructor(
		id,
		workspaceId,
		parentId,
		parentType,
		name,
		description,
		type,
		isActive,
		created_by,
		createdAt = new Date(),
		updatedAt = new Date()
	) {
		this.id = id;
		this.workspaceId = workspaceId;
		this.parentId = parentId;
		this.parentType = parentType;
		this.name = name;
		this.description = description;
		this.type = type;
		this.isActive = isActive;
		this.created_by = created_by;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}
