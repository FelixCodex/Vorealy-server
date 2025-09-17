export class Task {
	constructor(
		id,
		title,
		listId,
		workspaceId,
		createdBy,
		createdAt = new Date(),
		updatedAt = new Date(),
		startDate,
		endDate,
		state = 'todo',
		priority = 'normal',
		estimatedTime
	) {
		this.id = id;
		this.title = title;
		this.listId = listId;
		this.workspaceId = workspaceId;
		this.createdBy = createdBy;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.startDate = startDate;
		this.endDate = endDate;
		this.state = state;
		this.priority = priority;
		this.estimatedTime = estimatedTime;
	}
}
