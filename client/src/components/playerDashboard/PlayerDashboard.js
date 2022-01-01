import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import "./PlayerDashboard.scss";
import NavBar from "../navbar/NavBar";
import WaitingRoom from "../waitingRoom/WaitingRoom";
import UnoGame from "../unoGame/UnoGame";
import { UserContext } from "../../context/Contexts";
import axios from "axios";
import io from "socket.io-client";
import url from "../../data/backendUrl";
import socketUrl from "../../data/socketUrl";
import ChatWidget from "../chatWidget/ChatWidget";
let socket;
let currentPlayer;

const PlayerDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const lastRating = useRef();
  const [rating, setRating] = useState(lastRating.current);
  const [roomType, setRoomType] = useState("Create");
  const [waitingRoomId, setWaitingRoomId] = useState("");
  const [roomError, setRoomError] = useState("");
  const [roomReady, setRoomReady] = useState("");
  const [isUnoGame, setIsUnoGame] = useState(false);
  const token = localStorage.getItem("authToken");
  const authorizeToken = useCallback(async () => {
    if (!token) return localStorage.clear();
    try {
      let response = await axios.get(url(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.msg);
    } catch (err) {
      console.log(err.response.data.msg);
    }
  }, [token, setUser]);
  const fetchUserRating = useCallback(async () => {
    if (!user) return;
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
    authorizeToken();
  }, [authorizeToken]);
  useEffect(() => {
    fetchUserRating();
  }, [fetchUserRating]);

  //socket io onMount
  useEffect(() => {
    socket = io.connect(socketUrl, {
      transports: ["websocket"],
    });
    return socket.off("disconnect");
  }, []);
  //error Reset
  useEffect(() => {
    if (roomError === "") return;
    setTimeout(() => {
      setRoomError("");
    }, 1000);
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

  //tester easy join
  // useEffect(() => {
  //   socket.emit("easy-join");
  //   socket.on("easy-player", (player) => {
  //     currentPlayer = player;
  //   });
  //   setTimeout(() => {
  //     setIsUnoGame(true);
  //   }, 1000);
  // }, []);

  <UnoGame
    gameType="multiplayer"
    socket={socket}
    room={waitingRoomId}
    currentPlayer={currentPlayer}
    // currentPlayer={id:null, currentPlayerNumber :1}
  />;
  return (
    <>
      {isUnoGame ? (
        <UnoGame
          gameType="multiplayer"
          socket={socket}
          room={waitingRoomId}
          currentPlayer={currentPlayer}
          // currentPlayer={id:null, currentPlayerNumber :1}
        />
      ) : (
        <>
          <NavBar userName={user?.username} rating={rating} />
          <button>1 vs cpu</button>
          <button>1 vs 1</button>
          <br />
          <br />
          <button onClick={() => setRoomType("Create")}>Create a room</button>
          <button onClick={() => setRoomType("Join")}>Join a room</button>
          <br />
          <br />
          <form onSubmit={roomCreationHandler} autoComplete="off">
            <label htmlFor="room">{roomType} a room</label>
            <input
              placeholder="Enter the room ID"
              name="room"
              type="text"
              autocomplete="off"
            />
            <button type="submit"> {roomType} </button>
          </form>
          <br />
          <br />
          {roomType === "Create" ? (
            <WaitingRoom roomId={waitingRoomId} />
          ) : null}
          <br />
          <br />
          {roomError ? <h1 style={{ color: "red" }}>{roomError}</h1> : null}
          <br />
          <br />
          {roomReady ? <h1 style={{ color: "green" }}>{roomReady}</h1> : null}
        </>
      )}
    </>
  );
};

export default PlayerDashboard;
