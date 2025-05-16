import app from "./app.js";
import http from "node:http";
import { initSocket } from "./socket.io.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`>> Server on port: http//localhost:${PORT}`);
});
