const socketIO = require("socket.io");
module.exports = function (app) {
  io = socketIO(app);
  const game = io.of("/game");
  const getRoom = (room) => {
    return io._nsps.get("/game").adapter.rooms.get(room);
  };
  let playersUsernames = { player1: "", player2: "" };
  game.on("connection", (socket) => {
    const gameRooms = io._nsps.get("/game").adapter.rooms;
    //Room Handling
    socket.on("leave-room", (room) => {
      socket.leave(room);
    });
    socket.on("create-room", (room, username) => {
      const lobbyRoom = getRoom(room);
      if (lobbyRoom)
        return socket.emit("room-error", {
          errorMessage: "The room you are tying to create already exists",
        });
      socket.join(room);
      socket.emit("get-player-number", 1);
      playersUsernames.player1 = username;
    });
    socket.on("join-room", (room, username) => {
      let lobbyRoom = getRoom(room);
      const roomSize = lobbyRoom?.size;
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
      playersUsernames.player2 = username;
      game
        .in(room)
        .emit(
          "room-ready",
          "Your room is Ready, starting the game",
          playersUsernames
        );
    });

    //GAME SOCKETS

    //game start
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
