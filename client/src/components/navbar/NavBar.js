import React from "react";

const Navbar = (props) => {
  return (
    <div className="navbar">
      <div>React Uno</div>
      <div>
        <ul>
          <li>{props.userName}</li>
          <li>
            rating <span>{props.rating}</span>
          </li>
          <button onClick={() => localStorage.removeItem("authToken")}>
            Logout
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
