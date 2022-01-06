import React from "react";
import Navbar from "../navbar/NavBar";
import { Link } from "react-router-dom";

const PlayerGameChoice = () => {
  return (
    <>
      <Navbar />
      <Link to="/game/single"> 1 v CPU</Link>
      <Link to="/game/multiplayer"> 1 v 1</Link>
    </>
  );
};

export default PlayerGameChoice;
