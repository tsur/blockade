var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 8080

app.use(express.static(__dirname + "/../"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({
  server: server
})

console.log("websocket server created");

var gameClient;

wss.on("connection", function(ws) {

  ws.on("message", function(msg) {

    if (msg === "gameClient") {

      return gameClient = ws;

    }

    if (gameClient) {

      gameClient.send(msg);

    }

  });

})