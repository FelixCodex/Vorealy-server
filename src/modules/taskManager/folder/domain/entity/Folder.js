class Folder {
	constructor(
		id,
		project_id,
		workspace_id,
		name,
		description,
		color,
		icon,
		is_private = false,
		automation_rules,
		created_at = new Date(),
		created_by,
		updated_at = new Date(),
		updated_by,
		metadata
	) {
		this.id = id;
		this.project_id = project_id;
		this.workspace_id = workspace_id;
		this.name = name;
		this.description = description;
		this.color = color;
		this.icon = icon;
		this.is_private = is_private;
		this.automation_rules = automation_rules;
		this.created_at = created_at;
		this.created_by = created_by;
		this.updated_at = updated_at;
		this.updated_by = updated_by;
		this.metadata = metadata;
	}
}
