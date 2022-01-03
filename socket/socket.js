const socketIO = require("socket.io");
module.exports = function (app) {
  io = socketIO(app);
  // io.set("close timeout", 60);
  // io.set("heartbeat timeout", 60);
  const game = io.of("/game");
  const getRoom = (room) => {
    return io._nsps.get("/game").adapter.rooms.get(room);
  };
  game.on("connection", (socket) => {
    const gameRooms = io._nsps.get("/game").adapter.rooms;
    //Room Handling
    socket.on("leave-room", (room) => {
      socket.leave(room);
    });
    socket.on("create-room", (room) => {
      const lobbyRoom = getRoom(room);
      // const _id = socket.id;
      // gameRooms.forEach((value, key) => {
      //   if (key === _id) return;
      //   socket.leave(key);
      // });
      if (lobbyRoom)
        return socket.emit("room-error", {
          errorMessage: "The room you are tying to create already exists",
        });
      socket.join(room);
      socket.emit("get-player-number", 1);
    });
    socket.on("join-room", (room) => {
      let lobbyRoom = getRoom(room);
      const roomSize = lobbyRoom?.size;
      const _id = socket.id;
      if (!roomSize)
        return socket.emit("room-error", {
          errorMessage:
            "The room you are tying to join was not found, please check the room id",
        });
      if (roomSize >= 2)
        return socket.emit("room-error", {
          errorMessage: "Room is full",
        });
      socket.join(room);
      const newLobbyRoom = getRoom(room);
      if (newLobbyRoom?.size !== 2)
        return socket.emit("room-error", {
          errorMessage: "Cannot Join the same room you created",
        });
      socket.emit("get-player-number", 2);
      game.in(room).emit("room-ready", "Your room is Ready, starting the game");
    });

    // test easy join
    // socket.on("easy-join", () => {
    //   const roomSize = io._nsps.get("/game").adapter.rooms.get("test")?.size;
    //   socket.join("test");
    //   const playerNumber = !roomSize ? 1 : 2;
    //   socket.emit("easy-player", {
    //     id: socket.id,
    //     currentPlayerNumber: playerNumber,
    //   });
    // });

    //GAME SOCKETS

    socket.on("game-init", (room, gameState) => {
      socket.broadcast.to(room).emit("start-game", gameState);
    });

    //game Update
    socket.on("game-update", (room, gameState) => {
      socket.broadcast.to(room).emit("game-update", gameState);
    });
    //CHAT SOCKETS
    socket.on("send-message", (room, message) => {
      socket.broadcast.to(room).emit("recieve-message", message);
    });
    //disconnection handler
    socket.on("disconnecting", () => {
      const clientRoom = Array.from(socket.rooms, (name) => name).filter(
        (el) => el !== socket.id
      )[0];
      socket.broadcast.to(clientRoom).emit("player-disconnected", socket.id);
    });
  });
  return io;
};
