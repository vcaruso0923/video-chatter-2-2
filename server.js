// const PORT = process.env.PORT || 8000;
// require('dotenv').config();
// const express = require("express");
// const INDEX = '/client/public/index.html';
// const http = require("http");
// const app = express();
// const server = http.createServer(app);
// app.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
// .listen(PORT, () => console.log(`Listening on ${PORT}`));;
// const socket = require("socket.io");
// const io = socket(app);

// const users = {};

// const socketToRoom = {};

// io.on('connection', socket => {
//     socket.on("join room", roomID => {
//         if (users[roomID]) {
//             const length = users[roomID].length;
//             if (length === 4) {
//                 socket.emit("room full");
//                 return;
//             }
//             users[roomID].push(socket.id);
//         } else {
//             users[roomID] = [socket.id];
//         }
//         socketToRoom[socket.id] = roomID;
//         const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

//         socket.emit("all users", usersInThisRoom);
//     });

//     socket.on("sending signal", payload => {
//         io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
//     });

//     socket.on("returning signal", payload => {
//         io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
//     });

//     socket.on('disconnect', () => {
//         const roomID = socketToRoom[socket.id];
//         let room = users[roomID];
//         if (room) {
//             room = room.filter(id => id !== socket.id);
//             users[roomID] = room;
//         }
//     });
// });



'use strict';

const express = require('express');
const path = require('path')
const socketIO = require('socket.io');

const PORT = process.env.PORT || 8000;
const INDEX = './client/build/index.html';

const server = express()
    // .use((req, res) => { 
    //     const filePath = path.join(__dirname, INDEX)
    //     console.log(filePath);
    //     res.sendFile(filePath)})
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

// io.on('connection', (socket) => {
//     console.log('Client connected');
//     console.log({socket})
//     socket.on('disconnect', () => console.log('Client disconnected'));
// });

const users = {};

const socketToRoom = {};

io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);