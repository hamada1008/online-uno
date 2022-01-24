import Navbar from "../NavBar/NavBar";
import { Link } from "react-router-dom";
import playerImage from "../../assets/Misc/player.png";
import vsImage from "../../assets/Misc/vs.svg";
import cpuImage from "../../assets/Misc/computer.png";
import "./PlayerGameChoice.sass";

const PlayerGameChoice = () => {
  return (
    <>
      <Navbar />
      <section id="game-choices">
        <Link to="/game/single" className="game-type">
          <img className="player" src={playerImage} alt="player" />
          <img className="vs" src={vsImage} alt="vs" />
          <img className="cpu" src={cpuImage} alt="player" />
        </Link>
        <Link to="/game/multiplayer" className="game-type">
          <img className="player" src={playerImage} alt="player" />
          <img className="vs" src={vsImage} alt="vs" />
          <img className="player2" src={playerImage} alt="player" />
        </Link>
      </section>
    </>
  );
};

export default PlayerGameChoice;
