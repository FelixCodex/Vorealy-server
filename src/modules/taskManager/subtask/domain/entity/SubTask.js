class SubTask {
	constructor(
		id,
		title,
		task_id,
		workspace_id,
		completed = false,
		created_by,
		created_at = new Date(),
		updated_at = new Date(),
		start_date,
		end_date,
		assigned_to,
		priority = 'normal',
		estimated_time
	) {
		this.id = id;
		this.title = title;
		this.task_id = task_id;
		this.workspace_id = workspace_id;
		this.created_by = created_by;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.completed = completed;
		this.start_date = start_date;
		this.end_date = end_date;
		this.assigned_to = assigned_to;
		this.priority = priority;
		this.estimated_time = estimated_time;
	}
}
