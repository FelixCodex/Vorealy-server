export class WorkspaceInvitation {
	constructor(
		id,
		workspaceId,
		invitedUserId,
		invitedByUserId,
		role = 'member',
		message = null,
		createdAt = new Date(),
		expiresAt = new Date()
	) {
		this.id = id;
		this.workspaceId = workspaceId;
		this.invitedUserId = invitedUserId;
		this.invitedByUserId = invitedByUserId;
		this.role = role;
		this.message = message;
		this.createdAt = createdAt;
		this.expiresAt = expiresAt;
	}
}
