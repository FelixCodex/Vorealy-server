import acceptInvitation from '../../use-cases/workspaceInvitation/acceptInvitation.js';
import createWorkspaceInvitation from '../../use-cases/workspaceInvitation/createWorkspaceInvitation.js';
import getInvitationsByUser from '../../use-cases/workspaceInvitation/getInvitationsByUser.js';

export default function createWorkspaceInvitationController({
	invitationRepo,
	userRepository,
	workspaceMemberRepository,
	workspaceRespository,
	memberService,
	notificationService,
}) {
	const createWorkspaceInvitationUC = createWorkspaceInvitation(
		invitationRepo,
		userRepository,
		workspaceMemberRepository,
		workspaceRespository,
		notificationService
	);
	const getInvitationsByUserUC = getInvitationsByUser(invitationRepo);
	const acceptInvitationUC = acceptInvitation(invitationRepo, memberService);

	return {
		async create(req, res) {
			try {
				const { userEmail, workspaceId } = req.params;
				const { title, expiresIn, role, message } = req.body;
				const inviterId = req.user.id;
				const invitation = await createWorkspaceInvitationUC({
					title,
					workspaceId,
					userEmail,
					invitedByUserId: inviterId,
					expiresIn,
					role,
					message,
				});
				res.status(201).json({ success: true, data: invitation });
			} catch (error) {
				res.status(400).json({ success: false, message: error.message });
			}
		},

		async getByUser(req, res) {
			try {
				const { status } = req.query;
				const userId = req.user.id;
				const invitations = await getInvitationsByUserUC({ userId, status });
				res.status(200).json({ success: true, data: invitations });
			} catch (error) {
				res.status(400).json({ success: false, message: error.message });
			}
		},

		async acceptInvitation(req, res) {
			try {
				const { invitationId } = req.params;
				const userId = req.user.id;
				await acceptInvitationUC({ invitationId, userId });
				res.status(200).json({ success: true, message: 'Invitacion aceptada' });
			} catch (error) {
				res.status(400).json({ success: false, message: error.message });
			}
		},
	};
}
