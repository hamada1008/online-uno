import "./PlayerDashboard.scss";
import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import { UserContext } from "../../context/Contexts";
import { useNavigate, useLocation, Link } from "react-router-dom";
import NavBar from "../navbar/NavBar";
import WaitingRoom from "../waitingRoom/WaitingRoom";
import UnoGame from "../unoGame/UnoGame";
import axios from "axios";
import io from "socket.io-client";
import url from "../../data/backendUrl";
import socketUrl from "../../data/socketUrl";

let socket;
let currentPlayer;

const PlayerDashboard = () => {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const lastRating = useRef();
  const [rating, setRating] = useState(lastRating.current);
  const [roomType, setRoomType] = useState("Create");
  const [waitingRoomId, setWaitingRoomId] = useState("");
  const [roomError, setRoomError] = useState("");
  const [roomReady, setRoomReady] = useState("");
  const [isUnoGame, setIsUnoGame] = useState(false);
  const [isOneVsOne, setIsOneVsOne] = useState(false);
  const [isWaitingRoom, setIsWaitingRoom] = useState(false);

  const fetchUserRating = useCallback(async () => {
    if (!user || user.isLoggedIn) return;
    try {
      let response = await axios.get(url("rating", user.id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      lastRating.current = response.data.msg;
      setRating(response.data.msg);
    } catch (err) {
      console.log(err.response.data.msg);
    }
  }, [user, token]);

  useEffect(() => {
    fetchUserRating();
  }, [fetchUserRating]);

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
          <NavBar userName={user?.username} rating={rating} />
          <Link to="/game/single"> 1 v CPU</Link>
          <button onClick={() => setIsOneVsOne(true)}>1 vs 1</button>
          <br />
          <br />
          {isOneVsOne ? (
            <>
              {!isWaitingRoom ? (
                <>
                  <button onClick={() => setRoomType("Create")}>
                    Create a room
                  </button>
                  <button onClick={() => setRoomType("Join")}>
                    Join a room
                  </button>
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
                />
              ) : null}
              <br />
              <br />
              {roomError ? <h1 style={{ color: "red" }}>{roomError}</h1> : null}
              <br />
              <br />
              {roomReady ? (
                <h1 style={{ color: "green" }}>{roomReady}</h1>
              ) : null}
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default PlayerDashboard;
