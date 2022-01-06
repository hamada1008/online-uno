import "./PlayerDashboard.scss";
import React, { useEffect, useLayoutEffect, useState } from "react";
// import { UserContext } from "../../context/Contexts";
import { useNavigate } from "react-router-dom";
import NavBar from "../navbar/NavBar";
import WaitingRoom from "../waitingRoom/WaitingRoom";
import UnoGame from "../unoGame/UnoGame";
import io from "socket.io-client";
import socketUrl from "../../data/socketUrl";

let socket;
let currentPlayer;

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const [roomType, setRoomType] = useState("Create");
  const [waitingRoomId, setWaitingRoomId] = useState("");
  const [roomError, setRoomError] = useState("");
  const [roomReady, setRoomReady] = useState("");
  const [isUnoGame, setIsUnoGame] = useState(false);
  const [isWaitingRoom, setIsWaitingRoom] = useState(false);

  //socket io onMount
  useEffect(() => {
    socket = io.connect(socketUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 10,
      timeout: 60,
    });
    return socket.off("disconnect");
  }, []);
  //error Reset
  useEffect(() => {
    if (roomError === "") return;
    setRoomError("");
  }, [roomType, waitingRoomId]);
  //Room Creation or joining handler
  const roomCreationHandler = (e) => {
    e.preventDefault();
    const roomId = e.target.room.value;
    if (roomId === "") {
      e.target.room.placeholder = "Please enter a valid room id";
      return;
    } else {
      setWaitingRoomId(roomId);
      if (roomType === "Create") {
        socket.emit("create-room", roomId);
      } else {
        socket.emit("join-room", roomId);
      }
    }
    console.log(roomError);
    if (roomError === "") {
      setIsWaitingRoom(true);
    }
    e.target.reset();
  };
  useEffect(() => {
    //sockets
    socket.on("get-player-number", (number) => {
      currentPlayer = { id: socket.id, currentPlayerNumber: number };
    });
    socket.on("room-error", (error) => {
      setRoomError(error.errorMessage);
    });
    socket.on("room-ready", (message) => {
      setRoomReady(message);
      setTimeout(() => {
        setIsUnoGame(true);
      }, 2000);
    });
  }, []);

  useEffect(() => {
    if (!waitingRoomId) return;
    if (roomError !== "") return setIsWaitingRoom(false);
    setIsWaitingRoom(true);
  }, [roomError]);

  return (
    <>
      {isUnoGame ? (
        <UnoGame
          gameType="multiplayer"
          socket={socket}
          room={waitingRoomId}
          currentPlayer={currentPlayer}
        />
      ) : (
        <>
          <NavBar />
          <br />
          <br />

          <>
            {!isWaitingRoom ? (
              <>
                <button onClick={() => setRoomType("Create")}>
                  Create a room
                </button>
                <button onClick={() => setRoomType("Join")}>Join a room</button>
                <br />
                <br />
                <form onSubmit={roomCreationHandler} autoComplete="off">
                  <label htmlFor="room">{roomType} a room</label>
                  <input
                    placeholder="Enter the room ID"
                    name="room"
                    type="text"
                    autoComplete="off"
                  />
                  <button type="submit"> {roomType} </button>
                </form>
                <br />
                <br />
              </>
            ) : null}
            {isWaitingRoom ? (
              <WaitingRoom
                roomId={waitingRoomId}
                isWaitingRoom={isWaitingRoom}
                setIsWaitingRoom={setIsWaitingRoom}
                socket={socket}
                roomType={roomType}
              />
            ) : null}
            <br />
            <br />
            {roomError ? <h1 style={{ color: "red" }}>{roomError}</h1> : null}
            <br />
            <br />
            {roomReady ? <h1 style={{ color: "green" }}>{roomReady}</h1> : null}
          </>
        </>
      )}
    </>
  );
};

export default PlayerDashboard;
