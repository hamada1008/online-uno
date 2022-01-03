import React, { useContext } from "react";
import { UserContext } from "../../context/Contexts";
const Navbar = (props) => {
  const { setUser } = useContext(UserContext);
  const logoutHandler = () => {
    localStorage.clear();
    setUser(undefined);
  };
  return (
    <div className="navbar">
      <div>React Uno</div>
      <div>
        <ul>
          <li>{props.userName}</li>
          <li>
            rating <span>{props.rating}</span>
          </li>
          <button onClick={logoutHandler}>Logout</button>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
