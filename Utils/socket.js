const {getUsers, users} = require('./getUsers');
const express = require('express');

const app = express();


//Socket connection
function socket(io) {
    io.on('connection', (socket) => {

        socket.on('joined-user', (data) =>{
            //Storing users connected in a room in memory
            var user = {};
            user[socket.id] = data.username;
            if(users[data.roomname]){
                users[data.roomname].push(user);
            }
            else{
                users[data.roomname] = [user];
            }
            
            //Joining the Socket Room
            socket.join(data.roomname);
    
            //Emitting New Username to Clients
            io.to(data.roomname).emit('joined-user', {username: data.username});
    
            //Send online users array
            io.to(data.roomname).emit('online-users', getUsers(users[data.roomname]))
        })
    
        //Emitting messages to Clients
        socket.on('chat', (data) =>{
            io.to(data.roomname).emit('chat', {username: data.username, message: data.message});
        })
    
        //Broadcasting the user who is typing
        socket.on('typing', (data) => {
            socket.broadcast.to(data.roomname).emit('typing', data.username)
        })
    
        //Remove user from memory when they disconnect
        socket.on('disconnecting', (data)=>{
            console.log("ROOM NAME " + roomname);
            console.log("HELLO THEREEE UERSER: " + users[roomname]);
            console.log("SOCKET ID: " + socket.id);

            let usersTemp = users[roomname];



            // var users = socket.users;
            // var rooms = Object.keys(socket.rooms);
            // var socketId = rooms[0];
            // var roomname = rooms[1];
            usersTemp.forEach((user, index) => {
                if(user[socket.id]){
                    io.to(roomname).emit('user-left', {username: user.username});
                    io.to(roomname).emit('user-left', {username: user});
                    io.to(roomname).emit('user-left', {username: users[roomname][index].username});
                    console.log("removinggg");
                    usersTemp.splice(index, 1)
                }
            });
    
            // // //Send online users array
            
            io.to(roomname).emit('online-users', getUsers(usersTemp))
        })
    })
}


module.exports = socket;

 