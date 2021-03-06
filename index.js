var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var watson = require('watson-developer-cloud');
var path = require("path");
console.log(". = %s", path.resolve("."));
console.log("__dirname = %s", path.resolve(__dirname));

var conversation = watson.conversation({
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
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
            console.log('context: ' + JSON.stringify(context));
            console.log('error:', err);
        } else {
            // console.log(JSON.stringify(response, null, 2));
            // console.log('context: ' + context);
            context = response["context"];
            io.emit('chat message', JSON.stringify(context));
            io.emit('chat message', JSON.stringify(response["output"]["text"].join(), null, 2));
        }
    });
}
var pat = path.resolve(__dirname);

app.use('/public', express.static('public'));
// http.use(app.static(__dirname + '/public/'));
app.get('/', function (req, res) {
    res.sendfile(pat + '/public/index.html');
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

http.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log("Connected");
});

// http.listen(3000, function () {
//     console.log("Connected");
// });
