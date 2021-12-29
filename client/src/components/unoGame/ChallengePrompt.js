import React from "react";
import { Modal } from "react-bootstrap";
const ChallengePrompt = ({
  isChallengePrompt,
  setIsChallengePrompt,
  setPromptChallengeResult,
  thisTurnPlayer,
  currentPlayerNumber,
}) => {
  const challengeResultHandler = (e) => {
    setPromptChallengeResult(e.target.id);
    setIsChallengePrompt(false);
  };
  return (
    <>
      <Modal backdrop="static" show={isChallengePrompt}>
        <Modal.Header>
          <Modal.Title>Pick a Color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <button
            onClick={challengeResultHandler}
            id="accepted"
            disabled={thisTurnPlayer === currentPlayerNumber}
          >
            Accept
          </button>
          <button
            onClick={challengeResultHandler}
            id="declined"
            disabled={thisTurnPlayer === currentPlayerNumber}
          >
            Decline
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChallengePrompt;
