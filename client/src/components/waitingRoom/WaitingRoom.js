import React from "react";
import socketUrl from "../../data/socketUrl";
import { Modal } from "react-bootstrap";
const WaitingRoom = ({ roomId, isWaitingRoom, setIsWaitingRoom, socket }) => {
  const roomChangingHandler = () => {
    setIsWaitingRoom(false);
    socket.emit("leave-room", roomId);
  };
  return (
    <>
      <Modal
        backdrop="static"
        show={isWaitingRoom}
        onHide={roomChangingHandler}
      >
        <Modal.Header closeButton>
          <Modal.Title>Waiting for and opponent to join</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>waiting for a player to join room: {roomId ? roomId : ""}</p>
          <h2>spinner</h2>
          <button onClick={roomChangingHandler}>Change Room Id</button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WaitingRoom;
