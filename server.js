const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Serve static files from 'public' folder
app.use(express.static("public"));  // ✅ FIXED

// Default route for serving index.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

const users = {};

io.on("connection", (socket) => {
    socket.on("new-user-joined", (name) => {
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", (message) => {
        socket.broadcast.emit("receive", {
            message: message,
            name: users[socket.id],
        });
    });

    socket.on("disconnect", () => {
        if (users[socket.id]) {
            socket.broadcast.emit("left", users[socket.id]);
            delete users[socket.id];
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
