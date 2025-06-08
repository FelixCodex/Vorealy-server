import addWorkspaceMember from '../../use-cases/workspaceMember/addWorkspaceMember.js';

export class WorkspaceMemberService {
	constructor(MemberRepository, WorkspaceRepository) {
		this.MemberRepository = MemberRepository;
		this.WorkspaceRepository = WorkspaceRepository;
	}

	async addMember({
		workspaceId,
		userId,
		role = 'guest',
		joinedAt,
		invitedBy,
	}) {
		try {
			const addMemberUseCase = addWorkspaceMember(
				this.WorkspaceRepository,
				this.MemberRepository
			);
			const result = await addMemberUseCase({
				workspaceId,
				userId,
				role,
				joinedAt,
				invitedBy,
			});

			return result;
		} catch (error) {
			throw error;
		}
	}
}
