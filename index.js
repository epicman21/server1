const express = require("express");
const { Server } = require("colyseus");
const { WebSocketTransport } = require("@colyseus/ws-transport");
const { createServer } = require("http");

const app = express();
const port = process.env.PORT || 3000;

const server = createServer(app);

// Colyseus setup
const gameServer = new Server({
  transport: new WebSocketTransport({ server })
});

// Basic room
const { Room } = require("colyseus");

class GameRoom extends Room {
  onCreate(options) {
    console.log("Room created!");
  }

  onJoin(client) {
    console.log(client.sessionId, "joined!");
  }

  onMessage(client, message) {
    console.log(client.sessionId, "sent:", message);
  }

  onLeave(client) {
    console.log(client.sessionId, "left!");
  }
}

gameServer.define("game_room", GameRoom);

app.get("/", (req, res) => {
  res.send("Colyseus server running!");
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
