import { useContext, useCallback, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/Contexts";
import axios from "axios";
import url from "../../data/backendUrl";
import unoLogo from "../../assets/Misc/uno.png";
import removeGuestUser from "../../utils/removeGuestUser";
import "./NavBar.scss";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const token = localStorage.getItem("authToken");
  const lastRating = useRef();

  const [rating, setRating] = useState(lastRating.current);

  const logoutHandler = () => {
    let isGuest = localStorage.getItem("isGuest");
    if (isGuest === "Yes") removeGuestUser();
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
    <header>
      <Link to="/">
        <img src={unoLogo} alt="Uno Logo" className="navbar-logo" />
      </Link>
      <div>
        <ul>
          <li>
            <span className="nav-label">Username</span>
            <span className="nav-data"> {user?.username}</span>
          </li>
          <li>
            <span className="nav-label"> rating </span>
            <span className="nav-data">{rating}</span>
          </li>
          <button onClick={logoutHandler}>Logout</button>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
