const output = document.getElementById('output');
const message = document.getElementById('message');
const send = document.getElementById('send');
const feedback = document.getElementById('feedback');
const roomMessage = document.querySelector('.room-message');
const users = document.querySelector('.users');

//Socket server URL
const SERVER_URL = window.location.host === "chat-room-testing.onrender.com" ? "https://chat-room-testing.onrender.com" : "http://localhost:3000";
const DEFAULT_SIZE = 4
let socket = io.connect(SERVER_URL);

//Fetch URL Params from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username');
const roomname = urlParams.get('roomname');
console.log(username, roomname);

//Display the roomname the user is connected to
roomMessage.innerHTML = `You are in ${roomname} room`

//Emitting username and roomname of newly joined user to server
socket.emit('joined-user', {
    username: username,
    roomname: roomname
})

//Sending data when user clicks send
send.addEventListener('click', () =>{
    socket.emit('chat', {
        username: username,
        message: message.value,
        roomname: roomname
    })
    message.value = '';
    console.log("WHAT IS GOING ON HERE");
})

//Sending username if the user is typing
message.addEventListener('keypress', () => {
    socket.emit('typing', {username: username, roomname: roomname})
})

//Displaying if new user has joined the room
socket.on('joined-user', (data)=>{
    output.innerHTML += '<p>--> <strong><em>' + data.username + ' </strong>has Joined the Room</em></p>';
})

//Displaying if new user has left the room
socket.on('user-left',(data)=>{
    output.innerHTML += '<p>--> <strong><em>' + data.username + ' </strong>has left the Room</em></p>';
})

//Displaying the message sent from user
socket.on('chat', (data) => {
    output.innerHTML += '<p><strong>' + data.username + '</strong>: ' + data.message + '</p>';
    feedback.innerHTML = '';
    document.querySelector('.chat-message').scrollTop = document.querySelector('.chat-message').scrollHeight

})

//Displaying if a user is typing
socket.on('typing', (user) => {
    feedback.innerHTML = '<p><em>' + user + ' is typing...</em></p>';
})

//Displaying online users
socket.on('online-users', (data) =>{
    users.innerHTML = ''
    data.forEach(user => {
        users.innerHTML += `<p>${user}</p>`
    });
})

 