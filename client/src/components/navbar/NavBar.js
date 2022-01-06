import React, {
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import { UserContext } from "../../context/Contexts";
import axios from "axios";
import url from "../../data/backendUrl";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const token = localStorage.getItem("authToken");
  const lastRating = useRef();

  const [rating, setRating] = useState(lastRating.current);

  const logoutHandler = () => {
    localStorage.clear();
    setUser(undefined);
  };
  const fetchUserRating = useCallback(async () => {
    if (!user || user.isLogging) return;
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
  return (
    <div className="navbar">
      <div>React Uno</div>
      <div>
        <ul>
          <li>{user?.userName}</li>
          <li>
            rating <span>{rating}</span>
          </li>
          <button onClick={logoutHandler}>Logout</button>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
