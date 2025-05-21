export default function registerAdminEvents(socket) {
	socket.on('connectAdmin', () => {
		socket.join('admin');
		console.log('🛠️ Admin joined the chat');
		socket.to('admin').emit('connectAdmin', 'Admin joined chat');
	});
}
