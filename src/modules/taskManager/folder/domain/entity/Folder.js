export class Folder {
	constructor(
		id,
		projectId,
		workspaceId,
		name,
		description,
		color,
		icon,
		isPrivate = false,
		automationRules,
		createdAt = new Date(),
		createdBy,
		updatedAt = new Date(),
		updatedBy,
		metadata
	) {
		this.id = id;
		this.projectId = projectId;
		this.workspaceId = workspaceId;
		this.name = name;
		this.description = description;
		this.color = color;
		this.icon = icon;
		this.isPrivate = isPrivate;
		this.automationRules = automationRules;
		this.createdAt = createdAt;
		this.createdBy = createdBy;
		this.updatedAt = updatedAt;
		this.updatedBy = updatedBy;
		this.metadata = metadata;
	}
}
