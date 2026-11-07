const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

app.use(express.static(__dirname));

io.on('connection', (socket) => {
  // クライアントから「どのチャンネルに参加するか」を受け取る
  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    console.log(`ユーザーが部屋 [${roomName}] に参加しました`);

    // その部屋（チャンネル）の中にいるメンバーだけにイベントを転送する
    socket.on('morse_event', (data) => {
      socket.broadcast.to(roomName).emit('morse_event', data);
    });
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});