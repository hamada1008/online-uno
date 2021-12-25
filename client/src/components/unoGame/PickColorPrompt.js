import React from "react";
import { Modal } from "react-bootstrap";
import cardColors from "../../cards/colors";

const PickColorPrompt = ({
  isColorPrompt,
  setIsColorPrompt,
  setPromptChosenColor,
  currentPlayer,
}) => {
  const wildColorChangingHandler = (e) => {
    if (currentPlayer !== 1) return;
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
          <button
            onClick={wildColorChangingHandler}
            className="pick-a-color"
            id={cardColors.RED}
            style={{ backgroundColor: cardColors.RED }}
          >
            RED
          </button>
          <button
            onClick={wildColorChangingHandler}
            className="pick-a-color"
            id={cardColors.YELLOW}
            style={{ backgroundColor: cardColors.YELLOW }}
          >
            YELLOW
          </button>
          <button
            onClick={wildColorChangingHandler}
            className="pick-a-color"
            id={cardColors.BLUE}
            style={{ backgroundColor: cardColors.BLUE }}
          >
            BLUE
          </button>
          <button
            onClick={wildColorChangingHandler}
            className="pick-a-color"
            id={cardColors.GREEN}
            style={{ backgroundColor: cardColors.GREEN }}
          >
            GREEN
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PickColorPrompt;
