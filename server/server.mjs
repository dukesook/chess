// Node.js is an asynchronous event-driven JavaScript runtime
// Node.js uses the V8 JavaScript engine from Google Chrome

// $ npm init -y  // create package.json file
import express from 'express'; // $ npm install express
import { Server } from 'socket.io'; // $ npm install socket.io
import { createServer } from 'http';
import path from 'path';

const PORT = 3000;
const app = express(); // Express does not create an HTTP server. Express simplifies is middleware & simplifies handling routes
const httpServer = createServer(app); // Tells the node.js HTTP server to use Express as the request handler
const io = new Server(httpServer, {/* options */}); // allows the HTTP server to listen for WebSocket connections alongside normal HTTP requests.

// Serve static files from "public" folder (all .html, .css, & .js files)
app.use(express.static(path.join(process.cwd(), '../public')));


// WebSocket connection
io.on('connection', (socket) => {
    console.log('A user connected');
})


// NOT app.listen()
//      socket.io requires an HTTP server instance
//      app.listen() only stars an Express server which doesn't support websockets
httpServer.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
});
