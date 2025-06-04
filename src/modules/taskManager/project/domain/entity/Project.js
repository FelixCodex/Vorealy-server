class Project {
	constructor(
		id,
		workspace_id,
		name,
		description,
		color,
		icon,
		visibility,
		features_enabled,
		automation_rules,
		created_at = new Date(),
		created_by,
		updated_at = new Date(),
		updated_by,
		completed_at,
		estimated_hours,
		working_days,
		working_hours,
		holidays,
		tags,
		metadata
	) {
		this.id = id;
		this.workspace_id = workspace_id;
		this.name = name;
		this.description = description;
		this.color = color;
		this.icon = icon;
		this.visibility = visibility;
		this.features_enabled = features_enabled;
		this.automation_rules = automation_rules;
		this.created_at = created_at;
		this.created_by = created_by;
		this.updated_at = updated_at;
		this.updated_by = updated_by;
		this.completed_at = completed_at;
		this.estimated_hours = estimated_hours;
		this.working_days = working_days;
		this.working_hours = working_hours;
		this.holidays = holidays;
		this.tags = tags;
		this.metadata = metadata;
	}
}
