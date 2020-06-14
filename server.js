const express = require("express");
const path = require("path");
const app = express();
const server = app.listen(process.env.PORT || 3000);
const io = require("socket.io").listen(server);

app.use(express.static(path.join(__dirname, "client")));

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

io.sockets.on("connection", function (socket) {
  socket.on("drawLine", function (data) {
    socket.broadcast.emit("drawLine", data);
  });

  socket.on("stopDrawLine", function () {
    socket.broadcast.emit("stopDrawLine");
  });

  socket.on("clearBoard", function () {
    socket.broadcast.emit("clearBoard");
  });
});
