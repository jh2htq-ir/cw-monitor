const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

app.use(express.static(__dirname));

io.on('connection', (socket) => {
  // 誰かがキーを押した/離した/改行した、のデータを全員に転送
  socket.on('morse_event', (data) => {
    socket.broadcast.emit('morse_event', data);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});