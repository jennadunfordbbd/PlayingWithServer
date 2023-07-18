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
        socket.on('disconnecting', ()=>{
            let usersTemp = users[roomname];

            console.log("USERS TEMP: " + usersTemp);
            usersTemp.forEach((user, index) => {
                if(user[socket.id]){
                    io.to(roomname).emit('user-left', {username: usersTemp[index]});
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

 