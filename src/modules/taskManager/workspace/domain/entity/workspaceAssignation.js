export class WorkspaceAssignation {
	constructor(
		id,
		userId,
		workspaceId,
		parentType,
		parentId,
		assignedAt = new Date(),
		assignedBy
	) {
		this.id = id;
		this.userId = userId;
		this.workspaceId = workspaceId;
		this.parentType = parentType;
		this.parentId = parentId;
		this.assignedAt = assignedAt;
		this.assignedBy = assignedBy;
	}
}
