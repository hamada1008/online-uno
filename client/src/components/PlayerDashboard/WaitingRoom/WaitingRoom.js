import "./WaitingRoom.sass";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Modal } from "react-bootstrap";
import { RevolvingDot } from "react-loader-spinner";
const WaitingRoom = ({
  roomId,
  isWaitingRoom,
  setIsWaitingRoom,
  socket,
  roomType,
  roomReady,
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
        keyboard={false}
        centered
        dialogClassName="waiting-room-modal"
        size="lg"
      >
        <Modal.Header closeButton={roomType === "Create"}>
          <Modal.Title variant="warning">Waiting Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="wr-modal-body">
            {roomReady ? (
              <p>{roomReady} </p>
            ) : (
              <>
                <p>
                  waiting for a player to join your room:{" "}
                  {roomId ? `"${roomId}"` : ""}
                </p>
                <RevolvingDot
                  width={100}
                  height={100}
                  color="grey"
                  arialLabel="loading"
                />
                {roomType === "Create" ? (
                  <button onClick={roomChangingHandler}>Change Room Id</button>
                ) : null}
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WaitingRoom;
