import React from "react";
import socketUrl from "../../data/socketUrl";
import { Modal } from "react-bootstrap";
const WaitingRoom = ({
  roomId,
  isWaitingRoom,
  setIsWaitingRoom,
  socket,
  roomType,
}) => {
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
        <Modal.Header closeButton={roomType === "Create"}>
          <Modal.Title>Waiting for and opponent to join</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>waiting for a player to join room: {roomId ? roomId : ""}</p>
          <h2>spinner</h2>
          {roomType === "Create" ? (
            <button onClick={roomChangingHandler}>Change Room Id</button>
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WaitingRoom;
