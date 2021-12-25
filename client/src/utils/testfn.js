import { useContext } from "react";
import { GameContext } from "../context/Contexts";
const Test = () => {
  const { nstate, setNState } = useContext(GameContext);
  setNState((prevState) => !prevState);
  return;
};

export default Test;
