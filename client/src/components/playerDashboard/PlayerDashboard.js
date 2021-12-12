import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import "./PlayerDashboard.scss";
import NavBar from "../navbar/NavBar";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import url from "../../data/backendUrl";
const PlayerDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const lastRating = useRef();
  const [rating, setRating] = useState(lastRating.current);

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
  console.log(user);
  return (
    <div>
      <NavBar userName={user?.username} rating={rating} />
      <button>PLAY</button>
    </div>
  );
};

export default PlayerDashboard;
