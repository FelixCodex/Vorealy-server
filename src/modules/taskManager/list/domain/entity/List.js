export class List {
	constructor(
		id,
		name,
		color,
		description,
		parentId,
		parentType,
		workspaceId,
		createdBy,
		createdAt = new Date(),
		updatedAt = new Date(),
		automationRules,
		todoColor,
		todoName,
		doneName,
		priority = 'normal',
		isPrivate = false,
		estimatedTime
	) {
		this.id = id;
		this.name = name;
		this.color = color;
		this.description = description;
		this.parentId = parentId;
		this.parentType = parentType;
		this.workspaceId = workspaceId;
		this.createdBy = createdBy;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.automationRules = automationRules;
		this.todoColor = todoColor;
		this.todoName = todoName;
		this.doneName = doneName;
		this.priority = priority;
		this.isPrivate = isPrivate;
		this.estimatedTime = estimatedTime;
	}
}
