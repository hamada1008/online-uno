import React, { useState, useEffect, useContext, useCallback } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import url from "../../data/backendUrl";
import { UserContext } from "../../context/Contexts";

const WinnerAnnouncer = ({ winnerData, currentPlayerNumber }) => {
  const [isOpen, setIsOpen] = useState(true);
  const user = useContext(UserContext);
  const token = localStorage.getItem("authToken");
  const closeCurrentGame = () => {
    setIsOpen(false);
    //redirect to home
  };
  console.log("wdata", winnerData);
  console.log("current player", currentPlayerNumber);
  const currentPlayerRating =
    currentPlayerNumber === 1
      ? winnerData?.playerOneScore
      : winnerData?.playerTwoScore;

  console.log("cpr", currentPlayerRating);
  const rating =
    currentPlayerNumber === winnerData?.winningPlayer
      ? Number(currentPlayerRating) * 2
      : -Number(currentPlayerRating) / 2;
  console.log(rating);

  const updateUserRating = useCallback(async () => {
    if (!user) return;
    try {
      await axios.post(url("rating", user.id), rating, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.log(err?.response?.data?.msg);
    }
  }, []);

  useEffect(() => {
    updateUserRating();
  }, [updateUserRating]);
  return (
    <>
      <Modal backdrop="static" show={isOpen} onHide={closeCurrentGame}>
        <Modal.Header closeButton>
          <Modal.Title>Post Game Screen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>{`Player ${winnerData?.winningPlayer}`}</b>
          <p>won the game</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WinnerAnnouncer;
