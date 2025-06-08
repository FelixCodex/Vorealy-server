import { configurateApp, registerSocketEvents } from './app.config.js';
import app from './app.js';
import http from 'node:http';
import { initSocket } from './modules/webSocket/application/socket.server.js';

const PORT = process.env.PORT || 3000;

configurateApp(app);

const server = http.createServer(app);

const io = initSocket(server);
registerSocketEvents(io);

server.listen(PORT, () => {
	console.log(`>> Server on port: http//localhost:${PORT}`);
});
