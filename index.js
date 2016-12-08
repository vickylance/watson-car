var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var watson = require('watson-developer-cloud');

var conversation = watson.conversation({
    username: 'a5e6bf71-284f-4bcf-8f65-47c67d72a789',
    password: 'JYQV1pPXwFl7',
    version: 'v1',
    version_date: '2016-09-20'
});

// Replace with the context obtained from the initial request
var context = {};

function sendWatsonMsg(message) {
    console.log("watson message: " + message);
    conversation.message({
        workspace_id: 'e36eca52-0b97-4673-b1e8-8468d4b6373a',
        input: {
            'text': message
        },
        context: context
    }, function (err, response) {
        if (err) {
            console.log('context: '+ JSON.stringify(context));
            console.log('error:', err);
        } else {
            // console.log(JSON.stringify(response, null, 2));
            console.log('context: '+ context);
            io.emit('chat message', response);
        }
    });
}

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
        sendWatsonMsg(msg);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});