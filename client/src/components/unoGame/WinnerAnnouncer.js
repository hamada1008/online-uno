import React, { useState } from "react";
import { Modal } from "react-bootstrap";

const WinnerAnnouncer = ({ winner }) => {
  const [isOpen, setIsOpen] = useState(true);
  const closeCurrentGame = () => {
    setIsOpen(false);
    //redirect to home
  };
  return (
    <>
      <Modal backdrop="static" show={isOpen} onHide={closeCurrentGame}>
        <Modal.Header closeButton>
          <Modal.Title>Post Game Screen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>{`Player ${winner}`}</b>
          <p>won the game</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WinnerAnnouncer;
