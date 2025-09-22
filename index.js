// index.js
const express = require("express");
const { Server } = require("colyseus");
const { WebSocketTransport } = require("@colyseus/ws-transport");
const { createServer } = require("http");
const { Schema, MapSchema, type } = require("@colyseus/schema");

const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);

// Player schema
class Player extends Schema {
  @type("number") x = 0;
  @type("number") y = 0;
  @type("number") z = 0;
}

// State schema
class State extends Schema {
  @type({ map: Player }) players = new MapSchema();
}

// Game room
const { Room } = require("colyseus");

class GameRoom extends Room {
  onCreate() {
    this.setState(new State());

    this.onMessage("move", (client, data) => {
      const player = this.state.players[client.sessionId];
      if (player) {
        player.x = data.x;
        player.y = data.y;
        player.z = data.z;
      }
    });
  }

  onJoin(client) {
    const player = new Player();
    this.state.players[client.sessionId] = player;
    console.log(client.sessionId, "joined");
  }

  onLeave(client) {
    delete this.state.players[client.sessionId];
    console.log(client.sessionId, "left");
  }
}

const gameServer = new Server({
  transport: new WebSocketTransport({ server })
});

gameServer.define("game_room", GameRoom);

app.get("/", (req, res) => {
  res.send("Colyseus server running!");
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
