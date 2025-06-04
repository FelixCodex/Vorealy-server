class WorkspaceMember {
	constructor(
		id,
		workspace_id,
		user_id,
		role,
		joined_at = new Date(),
		invited_by
	) {
		this.id = id;
		this.workspace_id = workspace_id;
		this.user_id = user_id;
		this.role = role;
		this.joined_at = joined_at;
		this.invited_by = invited_by;
	}
}
