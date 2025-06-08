export class WorkspaceMember {
	constructor(id, workspaceId, userId, role, joinedAt = new Date(), invitedBy) {
		this.id = id;
		this.workspaceId = workspaceId;
		this.userId = userId;
		this.role = role;
		this.joinedAt = joinedAt;
		this.invitedBy = invitedBy;
	}
}
