import { Modal } from "react-bootstrap";
import cardColors from "../../cards/colors";
import "./styles/PickColorPrompt.sass";

const PickColorPrompt = ({
  isColorPrompt,
  setIsColorPrompt,
  setPromptChosenColor,
  thisTurnPlayer,
  currentPlayerNumber,
}) => {
  const buttons = [
    cardColors.RED,
    cardColors.BLUE,
    cardColors.GREEN,
    cardColors.YELLOW,
  ];
  const wildColorChangingHandler = (e) => {
    setPromptChosenColor(e.target.id);
    setIsColorPrompt(false);
  };

  return (
    <>
      <Modal backdrop="static" show={isColorPrompt}>
        <Modal.Header>
          <Modal.Title>Pick a Color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="pick-a-color-wheel">
            {buttons.map((el, index) => (
              <button
                key={index}
                id={el}
                onClick={wildColorChangingHandler}
                disabled={thisTurnPlayer !== currentPlayerNumber}
              ></button>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PickColorPrompt;
