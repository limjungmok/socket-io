const cwd = process.cwd();
const path = require('path');

var express = require('express');

const app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8011);

app.use(express.static(path.resolve(cwd, 'public/logger')));
app.get('/', function (req, res) {
  res.sendFile(path.resolve(cwd, 'public', 'index.html'));
});

io.on('connection', function (socket) {
  socket.emit('msg', '당신은 서버와 연결됐습니다.');
  socket.on('enterance', function (params, chatRoomNumber){
    console.log(`[채팅방 ${chatRoomNumber} 유저가 입장했습니다]`, params);
    switch(params) {
      case 'CHAT':
        createChatSocket(socket, chatRoomNumber);
        break;
      default:
        break;
    }
  });
});

const chatSockets = {};
// { 110: users: []};
const createChatSocket = (socket, chatRoomNumber) => {
  console.log('chatRoomNumber', chatRoomNumber);
  if (!chatSockets[chatRoomNumber]) {
    chatSockets[chatRoomNumber] = { users: [] };
  }
  chatSockets[chatRoomNumber].users.push(socket);

  console.log('[현재 채팅방 현황]', chatSockets);

  socket.on('msg', (data) => {
    chatSockets[chatRoomNumber].users.forEach(user => {
      if (user !== socket) user.emit('msg', data);
      if (user === socket) user.emit('msg', `[내가보낸메세지]${data}`);
    })
  })
}
