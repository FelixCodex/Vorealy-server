let usersConnected = 0;

export default function registerHandlers(io) {
	io.on('connection', socket => {
		usersConnected++;
		console.log('A user has connected: ' + socket.id);

		// Registra los handlers específicos
		registerUserHandlers(io, socket, usersConnected);
		registerChatHandlers(io, socket);
		registerAdminHandlers(io, socket, usersConnected);

		// Manejo de desconexión (común a todos)
		socket.on('disconnect', () => {
			console.log('A user has disconnected');
			usersConnected--;
			io.to('admin').emit('userDisconnected', usersConnected);
		});
	});
}
