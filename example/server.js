var app = require('http').createServer(handler)
var io = require('socket.io')(app, { transports: ['websocket'] });
var fs = require('fs');

app.listen(8090);

function handler (req, res) {
  var filePath = req.url;

  if (req.url === '/') filePath = '/app/index.html';

  fs.readFile(__dirname + filePath, function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading' + filePath + ': ' + err);
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  setInterval(function(){
    socket.emit('news', 'Hello React Socket IO.');
  }, 2000);
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

console.log('server started at 8090')
