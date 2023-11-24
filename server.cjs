
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
// import ACTIONS from "./src/Actions.js";
// const ACTIONS = require('./src/Actions')

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};
function getAllConnectedClients(roomId){
    Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((sockedId) => {
        return{
            socketId,
            username: userSocketMap[sockedId],
        };
    });
}

io.on("connection", (socket) => {
    console.log('socket connected', (socket.id));

    socket.on(ACTIONS.JOIN, ({roomId, username}) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        console.log(clients)
    });
});


const PORT = process.env.PORT || 5173;
server.listen(PORT, () => {console.log(`Listening on port ${PORT}`)});
