export class Project {
	constructor(
		id,
		workspaceId,
		name,
		description,
		color,
		icon,
		visibility,
		featuresEnabled,
		automationRules,
		createdAt = new Date(),
		createdBy,
		updatedAt = new Date(),
		updatedBy,
		completedAt,
		estimatedHours,
		workingDays,
		workingHours,
		holidays,
		tags,
		metadata
	) {
		this.id = id;
		this.workspaceId = workspaceId;
		this.name = name;
		this.description = description;
		this.color = color;
		this.icon = icon;
		this.visibility = visibility;
		this.featuresEnabled = featuresEnabled;
		this.automationRules = automationRules;
		this.createdAt = createdAt;
		this.createdBy = createdBy;
		this.updatedAt = updatedAt;
		this.updatedBy = updatedBy;
		this.completedAt = completedAt;
		this.estimatedHours = estimatedHours;
		this.workingDays = workingDays;
		this.workingHours = workingHours;
		this.holidays = holidays;
		this.tags = tags;
		this.metadata = metadata;
	}
}
