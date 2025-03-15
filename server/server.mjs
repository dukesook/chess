// Node.js is an asynchronous event-driven JavaScript runtime
// Node.js uses the V8 JavaScript engine from Google Chrome

// $ npm init -y  // create package.json file
import express from 'express'; // $ npm install express
import { Server } from 'socket.io'; // $ npm install socket.io
import { createServer } from 'http';
import path from 'path';
import BoardSquare from '../public/BoardSquare.mjs';

const PORT = 3000;
const app = express(); // Express does not create an HTTP server. Express simplifies is middleware & simplifies handling routes
const httpServer = createServer(app); // Tells the node.js HTTP server to use Express as the request handler
const io = new Server(httpServer, {/* options */}); // allows the HTTP server to listen for WebSocket connections alongside normal HTTP requests.

// Serve static files from "public" folder (all .html, .css, & .js files)
app.use(express.static(path.join(process.cwd(), '../public')));


let whitePlayer = null;
let blackPlayer = null;


// WebSocket connection
io.on('connection', (socket) => {
    if (!whitePlayer) {
        whitePlayer = socket;
        socket.emit('playerColor', 'white');
        console.log('assigned white');
    } else {
        blackPlayer = socket;
        socket.emit('playerColor', 'black');
        console.log('assigned black');
    }

    socket.on('message', (message) => {
        console.log('client: ' + message);
        io.emit('message', message);
    });

    socket.on('moveAttempt', (from, to) => {
        from = BoardSquare.object_constructor(from);
        to = BoardSquare.object_constructor(to);
        console.log(from);
        console.log('move: ' + from + ' to ' + to);
        io.emit('forceMove', from, to);
    });
})






// NOT app.listen()
//      socket.io requires an HTTP server instance
//      app.listen() only stars an Express server which doesn't support websockets
httpServer.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
});
