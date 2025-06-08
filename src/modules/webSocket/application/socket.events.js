import registerAdminEvents from '../events/admin.events.js';

let usersConnected = 0;

export function createRegisterSocketEvents({ UserRepository }) {
	return function (io) {
		io.on('connection', socket => {
			usersConnected++;
			console.log(`🔗 User connected: ${socket.id}`);
			io.to('admin').emit('userConnected', usersConnected);

			registerAdminEvents(socket, { UserRepository });

			socket.on('disconnect', () => {
				usersConnected--;
				console.log(`❌ User disconnected: ${socket.id}`);
				io.to('admin').emit('userDisconnected', usersConnected);
			});
		});
	};
}
