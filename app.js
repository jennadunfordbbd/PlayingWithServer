const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')



const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('Public'));
app.set('views','Views');
app.set('view engine', 'ejs');
var port = process.env.PORT || 3000;

//Render Index page
app.get('/', (req, res) => {
    res.render('index')
})

//Start Server
const server = app.listen(port, () => {
    console.log(`Server Running on port ${port}`)
})

//Get username and roomname from form and pass it to room
app.post('/room', (req, res) => {
    roomname = req.body.roomname;
    username = req.body.username;
    res.redirect(`/room?username=${username}&roomname=${roomname}`)
})

//Rooms
app.get('/room', (req, res)=>{
    res.render('room')
})
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:300",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});
require('./Utils/socket')(io);

app.use(cors())
 
app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})
 
app.listen(1024, function () {
  console.log('CORS-enabled web server listening on port 1024')
})