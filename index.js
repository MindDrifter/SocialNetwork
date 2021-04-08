const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)



app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/index.html');
    
  })
 
  io.on('connection', socket => {

    console.log('Client connected.');
    var users = [];
    for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }

    socket.on('chatMessage', msg =>{
        console.log(msg.name);
        console.log(users);
        io.emit('Response', {msg: 'xui'})
    })

    // Disconnect listener
    socket.on('disconnect', (data)=> {
        console.log('Client disconnected.');
        //console.log(socket.id);
        //users.splice(users.indexOf(socket.id), 1)
        delete users[socket.id]
        console.log(users);
    });
});


server.listen(80)