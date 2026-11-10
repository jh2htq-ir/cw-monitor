const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

app.use(express.static(__dirname));

io.on('connection', (socket) => {
  // 1. クライアントから指定されたルーム（チャンネル）に参加する
  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);
  });

  // 2. モールス信号のイベントを受け取ったら、その人が参加している同じルームの仲間だけに転送する
  socket.on('morse_event', (data) => {
    // socket.rooms から自分が参加しているルーム名（socket.id 以外のもの）を探す
    const rooms = Array.from(socket.rooms);
    const targetRoom = rooms.find(r => r !== socket.id);
    
    if (targetRoom) {
      // 同じルーム（チャンネル）にいる他の人だけに送信
      socket.to(targetRoom).emit('morse_event', data);
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});