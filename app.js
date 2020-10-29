const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const schedule = require('node-schedule');
const seconds = '*/3600 * * * * *'; //3mins

server.listen(process.env.PORT || 3000);
console.log("Server running...port: 3000");


app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


let connections = [];
io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('<Connected>: -> %s sockets connected', connections.length);

    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        console.log('<Disconnect>: -> %s sockets connected', connections.length);
    });

    schedule.scheduleJob(seconds, function (time) {
        io.sockets.emit("timestamp", time, connections.length);
    });

});