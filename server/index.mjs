// Node.js is an asynchronous event-driven JavaScript runtime
// Node.js uses the V8 JavaScript engine from Google Chrome

// $ npm init -y  // create package.json file
import express from 'express'; // $ npm install express
import socketio from 'socket.io'; // $ npm install socket.io
import path from 'path';

const app = express(); // Express creates an HTTP server
const io = socketio(app); // Socket.io creates a WebSocket server
const PORT = 3000;

// Serve static files from "public" folder (all .html, .css, & .js files)
app.use(express.static(path.join(process.cwd(), '../public')));


app.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
});
