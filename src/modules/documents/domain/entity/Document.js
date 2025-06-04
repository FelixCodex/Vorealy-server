class Document {
	constructor({
		id,
		title,
		content,
		parentType,
		parentId,
		createdBy,
		createdAt,
		updatedAt,
		version = 1,
		isDeleted = false,
	}) {
		this.id = id;
		this.title = title;
		this.content = content;
		this.parentType = parentType;
		this.parentId = parentId;
		this.createdBy = createdBy;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.version = version;
		this.isDeleted = isDeleted;
	}
}
