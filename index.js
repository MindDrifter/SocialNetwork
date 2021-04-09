const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
//const router = express.Router()
const mogoose = require('mongoose')
const api = require('./routes/api')
//const multer = require('multer')


app.use(express.urlencoded({
  extended:true,
  limit:'50mb'
}))
app.use(express.json({
  limit:'50mb'
}))
app.use('/api', api)

startDB()

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/index.html');
  })
 
  io.on('connection', socket =>{

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
    socket.on('disconnect', ()=>{
        console.log('Client disconnected.');
        //console.log(socket.id);
        //users.splice(users.indexOf(socket.id), 1)
        //delete users[socket.id]
        //console.log(socket.id);
        users.forEach((item, key)=>{
          if(item.userID === socket.id){
            users.splice(key, 1)
            console.log(users);
          }
        })
    });
});

async function startDB(){
  try {
    await mogoose.connect('mongodb+srv://m:1q2w3e4r@cluster0.n6onj.mongodb.net/BD', {
        useNewUrlParser: true,
        useFindAndModify:false,
        useUnifiedTopology: true 
    })
      console.log('connected to MongoDB');
  } catch (e) {
      console.log(e);
  }
}


server.listen(80)