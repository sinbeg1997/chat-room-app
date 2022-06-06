const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { addUser, removeUser } = require('./user')
const app = express()
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
})
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is Quannected to Port ${PORT}`));

io.on("connection", (socket) => {
    console.log("A connection has been made");
    socket.on("join", ({ name, room }, callBack) => {
        const { user, error } = addUser({ id: socket.id, name, room });

        if (error) return callBack(error);

        socket.join(user.room);
        callBack(null);
        socket.emit("message", {
            user: "Admin",
            text: `Welcome to ${user.room}`,
        });
        socket.broadcast
            .to(user.room)
            .emit("message", { user: "Admin", text: `${user.name} has joined!` });
        socket.on("sendMessage", ({ message }) => {
            io.to(user.room).emit("message", {
                user: user.name,
                text: message,
            });
        });
    });



    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit("message", {
                user: "Admin",
                text: `${user.name} just left the room`,
            });
        }

        console.log("A disconnection has been made");
    });

})