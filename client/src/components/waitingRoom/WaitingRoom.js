import React from "react";

const WaitingRoom = ({ roomId }) => {
  return (
    <div>
      <h4>waiting Room</h4>
      <p>waiting for a player to join room: {roomId ? roomId : ""}</p>
      <h2>spinner</h2>
    </div>
  );
};

export default WaitingRoom;
