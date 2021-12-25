import React from "react";
import { Modal } from "react-bootstrap";
const ChallengePrompt = ({
  isChallengePrompt,
  setIsChallengePrompt,
  setPromptChallengeResult,
  currentPlayer,
}) => {
  const challengeResultHandler = (e) => {
    if (currentPlayer !== 2) return;
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
          <button onClick={challengeResultHandler} id="accepted">
            Accept
          </button>
          <button onClick={challengeResultHandler} id="declined">
            Decline
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChallengePrompt;
