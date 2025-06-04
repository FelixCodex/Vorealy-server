class List {
	constructor(
		id,
		name,
		color,
		description,
		parent_id,
		parent_type,
		workspace_id,
		created_by,
		created_at = new Date(),
		updated_at = new Date(),
		automation_rules,
		assigned_to,
		default_states,
		statuses,
		priority = 'normal',
		is_private = FALSE,
		estimated_time
	) {
		this.id = id;
		this.name = name;
		this.color = color;
		this.description = description;
		this.parent_id = parent_id;
		this.parent_type = parent_type;
		this.workspace_id = workspace_id;
		this.created_by = created_by;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.automation_rules = automation_rules;
		this.assigned_to = assigned_to;
		this.default_states = default_states;
		this.statuses = statuses;
		this.priority = priority;
		this.is_private = is_private;
		this.estimated_time = estimated_time;
	}
}
