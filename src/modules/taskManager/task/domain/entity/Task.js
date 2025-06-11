export class Task {
	constructor(
		id,
		title,
		list_id,
		workspace_id,
		created_by,
		created_at = new Date(),
		updated_at = new Date(),
		start_date,
		end_date,
		assigned_to,
		state = 'todo',
		priority = 'normal',
		estimated_time
	) {
		this.id = id;
		this.title = title;
		this.list_id = list_id;
		this.workspace_id = workspace_id;
		this.created_by = created_by;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.start_date = start_date;
		this.end_date = end_date;
		this.assigned_to = assigned_to;
		this.state = state;
		this.priority = priority;
		this.estimated_time = estimated_time;
	}
}
