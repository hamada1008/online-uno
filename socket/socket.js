const socketIO = require("socket.io");
module.exports = function (app) {
  io = socketIO(app);
  const game = io.of("/game");
  game.on("connection", (socket) => {
    const gameRooms = io._nsps.get("/game").adapter.rooms;
    //Room Handling
    socket.on("create-room", (room) => {
      const isNewRoom = gameRooms.get(room)?.size;
      gameRooms.forEach((value, key) => {
        socket.leave(key);
      });
      if (isNewRoom)
        return game.to(socket.id).emit("room-error", {
          errorMessage: "Room already exists, please enter a new room id",
        });
      socket.join(room);
    });
    socket.on("join-room", (room) => {
      const roomSize = io._nsps.get("/game").adapter.rooms.get(room)?.size;
      if (!roomSize)
        return game.to(socket.id).emit("room-error", {
          errorMessage:
            "The room you are tying to join was not found, please check the room id",
        });
      if (roomSize >= 2)
        return game.to(socket.id).emit("room-error", {
          errorMessage: "Room is full",
        });
      socket.join(room);
      return game
        .in(room)
        .emit("room-ready", "Your room is Ready, starting the game");
    });

    //temp easy join
    socket.on("easy", () => {
      socket.join("test");
    });
  });
  return io;
};
