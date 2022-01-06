import React, { useState, useEffect, useContext, useCallback } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import url from "../../data/backendUrl";
import { UserContext } from "../../context/Contexts";
import { useNavigate } from "react-router-dom";

const WinnerAnnouncer = ({ winnerData, currentPlayerNumber }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const closeCurrentGame = () => {
    setIsOpen(false);
    navigate("/", { replace: true });
  };
  const currentPlayerRating =
    currentPlayerNumber === 1
      ? winnerData?.playerOneScore
      : winnerData?.playerTwoScore;

  const rating =
    currentPlayerNumber === winnerData?.winningPlayer
      ? Number(currentPlayerRating) * 2
      : -Number(currentPlayerRating) / 2;
  const updateUserRating = useCallback(async () => {
    if (!user) return;
    try {
      await axios.put(
        url("rating", user.id),
        { gameRating: rating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
