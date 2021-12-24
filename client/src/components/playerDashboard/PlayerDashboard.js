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
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import io from "socket.io-client";
import url from "../../data/backendUrl";
import socketUrl from "../../data/socketUrl";
let socket;

const PlayerDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const lastRating = useRef();
  const [rating, setRating] = useState(lastRating.current);
  const [roomType, setRoomType] = useState("Create");
  const [roomId, setRoomId] = useState("");
  const token = localStorage.getItem("authToken");
  const authorizeToken = useCallback(async () => {
    if (!token) return;
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
    return function cleanup() {
      socket.off();
    };
  }, []);

  useEffect(() => {
    //sockets
    socket.on("dotest", (message) => {
      setRoomId(message);
    });
  }, []);
  //Room creator
  const roomCreationHandler = (e) => {
    e.preventDefault();
    if (e.target.room.value === "") {
      e.target.room.placeholder = "Please enter a valid room id";
      return;
    } else {
      setRoomId(e.target.room.value);
      //push waiting room route
    }
  };

  //Creates / joins a room after setting a room id
  useEffect(() => {
    if (roomId === "") return;
    roomType === "Create"
      ? socket.emit("create-room", roomId)
      : socket.emit("join-room", roomId);
  }, [roomId]);
  return (
    <div>
      <NavBar userName={user?.username} rating={rating} />
      <button>1 vs cpu</button>
      <button>1 vs 1</button>
      <br />
      <br />
      <button onClick={() => setRoomType("Create")}>Create a room</button>
      <button onClick={() => setRoomType("Join")}>Join a room</button>
      <br />
      <br />
      <form onSubmit={roomCreationHandler} autocomplete="off">
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
      {roomType === "Create" ? <WaitingRoom roomId={roomId} /> : null}
    </div>
  );
};

export default PlayerDashboard;
