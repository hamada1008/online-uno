import "./PlayerDashboard.sass";
import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../context/Contexts";
import WaitingRoom from "./WaitingRoom/WaitingRoom";
import UnoGame from "../UnoGameComponents/UnoGame";
import { TailSpin } from "react-loader-spinner";
import Navbar from "../NavBar/NavBar";
import io from "socket.io-client";
import socketUrl from "../../data/socketUrl";

let socket;
let currentPlayer;

const PlayerDashboard = () => {
  const { user } = useContext(UserContext);
  const [roomType, setRoomType] = useState("Create");
  const [waitingRoomId, setWaitingRoomId] = useState("");
  const [roomError, setRoomError] = useState("");
  const [roomReady, setRoomReady] = useState("");
  const [isUnoGame, setIsUnoGame] = useState(false);
  const [isWaitingRoom, setIsWaitingRoom] = useState(false);
  const [playersUsernames, setPlayersUsernames] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const inputRef = useRef();
  const intervalRef = useRef();
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
        socket.emit("create-room", roomId, user?.username);
      } else {
        socket.emit("join-room", roomId, user?.username);
      }
    }
    e.target.reset();
    if (roomError === "") {
      setIsWaitingRoom(true);
    }
  };

  useEffect(() => {
    //sockets
    socket.on("get-player-number", (number) => {
      currentPlayer = { id: socket.id, currentPlayerNumber: number };
    });
    socket.on("room-error", (error) => {
      setRoomError(error.errorMessage);
    });
    socket.on("room-ready", (message, playersUsernames) => {
      setRoomReady(message);
      setPlayersUsernames(playersUsernames);
      setTimeout(() => {
        setIsUnoGame(true);
      }, 2000);
    });
  }, []);

  useEffect(() => {
    if (!waitingRoomId) return isWaitingRoom && setIsWaitingRoom(false);
    if (roomError !== "" || !inputRef.current.value)
      return isWaitingRoom && setIsWaitingRoom(false);
    setIsWaitingRoom(true);
  }, [roomError]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (socket?.connected) setSocketConnected(true);
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);
  useEffect(() => {
    if (!socketConnected) return;
    clearInterval(intervalRef.current);
  }, [socketConnected]);

  return (
    <>
      {isUnoGame ? (
        <UnoGame
          gameType="multiplayer"
          socket={socket}
          room={waitingRoomId}
          currentPlayer={currentPlayer}
          playersUsernames={playersUsernames}
        />
      ) : (
        <>
          <Navbar />

          {socketConnected ? (
            <section id="rooms-ui">
              {!isWaitingRoom && (
                <>
                  <div className="room-choice-buttons">
                    <button onClick={() => setRoomType("Create")}>
                      Create a room
                    </button>
                    <button onClick={() => setRoomType("Join")}>
                      Join a room
                    </button>
                  </div>
                  <form
                    onSubmit={roomCreationHandler}
                    autoComplete="off"
                    className="room-form"
                  >
                    <label htmlFor="room-id">{roomType} a room</label>
                    <div className="room-form-controller">
                      <input
                        ref={inputRef}
                        placeholder="Enter the room ID"
                        name="room"
                        id="room-id"
                        type="text"
                        autoComplete="off"
                      />
                      <button data-testid="room-action" type="submit">
                        {roomType}
                      </button>
                    </div>
                  </form>
                </>
              )}
              {isWaitingRoom ? (
                <WaitingRoom
                  roomId={waitingRoomId}
                  isWaitingRoom={isWaitingRoom}
                  setIsWaitingRoom={setIsWaitingRoom}
                  socket={socket}
                  roomType={roomType}
                  roomReady={roomReady}
                />
              ) : null}
              {roomError ? <h1 style={{ color: "red" }}>{roomError}</h1> : null}
            </section>
          ) : (
            <section className="waiting-for-socket">
              <TailSpin width="100" height="100" />
              <span>waiting for connection</span>
            </section>
          )}
        </>
      )}
    </>
  );
};

export default PlayerDashboard;
