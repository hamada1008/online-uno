import React, { useState, useEffect } from "react";
import deck from "../../cards/deck.js";
import colors from "../../cards/colors.ts";
import numbers from "../../cards/number.ts";
import types from "../../cards/types.ts";
import CardImage from "./CardImage.js";
import arrayShuffle from "array-shuffle";
const UnoGame = () => {
  let gameDeck = deck.map((el) => el);
  const [playerOneHand, setPlayerOneHand] = useState([]);
  const [playerTwoHand, setPlayerTwoHand] = useState([]);
  const [cardPile, setCardPile] = useState([]);
  const [pileFirstCard, setPileFirstCard] = useState();
  const [deckPile, setDeckPile] = useState([]);
  useEffect(() => {
    setPlayerOneHand(gameDeck.splice(0, 7));
    setPlayerTwoHand(gameDeck.splice(0, 7));
    while (true) {
      let firstCard = gameDeck[0];
      if (firstCard.type === types.NORMAL) {
        setPileFirstCard(gameDeck.slice(0, 1)[0]);
        setCardPile(gameDeck.splice(0, 1));
        break;
      } else {
        gameDeck = arrayShuffle(gameDeck);
        continue;
      }
    }
    setDeckPile(gameDeck);
  }, []);
  const cardPlayingLogicHandling = (card, player, newColor) => {
    setCardPile((prevState) => [...prevState, card]);
    !newColor
      ? setPileFirstCard(card)
      : setPileFirstCard({ ...card, color: newColor });
    player === 1
      ? setPlayerOneHand((prevState) => prevState.filter((el) => el !== card))
      : setPlayerTwoHand((prevState) => prevState.filter((el) => el !== card));
  };
  const cardDrawLogicHandling = (player, numberOfCardsToDraw) => {
    if (player === 1) {
      switch (numberOfCardsToDraw) {
        case 1:
          setPlayerTwoHand((prevState) => [...prevState, deckPile[0]]);
          break;
        case 2:
          setPlayerTwoHand((prevState) => [
            ...prevState,
            deckPile[0],
            deckPile[1],
          ]);
          break;
        case 4:
          setPlayerTwoHand((prevState) => [
            ...prevState,
            deckPile[0],
            deckPile[1],
            deckPile[2],
            deckPile[3],
          ]);
          break;
        case 6:
          setPlayerTwoHand((prevState) => [
            ...prevState,
            deckPile[0],
            deckPile[1],
            deckPile[2],
            deckPile[3],
            deckPile[4],
            deckPile[5],
          ]);
          break;
        default:
          break;
      }
    } else {
      switch (numberOfCardsToDraw) {
        case 1:
          setPlayerTwoHand((prevState) => [...prevState, deckPile[0]]);
          break;
        case 2:
          setPlayerTwoHand((prevState) => [
            ...prevState,
            deckPile[0],
            deckPile[1],
          ]);
          break;
        case 4:
          setPlayerTwoHand((prevState) => [
            ...prevState,
            deckPile[0],
            deckPile[1],
            deckPile[2],
            deckPile[3],
          ]);
          break;
        case 6:
          setPlayerTwoHand((prevState) => [
            ...prevState,
            deckPile[0],
            deckPile[1],
            deckPile[2],
            deckPile[3],
            deckPile[4],
            deckPile[5],
          ]);
          break;
        default:
          break;
      }
    }
    setDeckPile((prevState) =>
      prevState.filter((el, index) => index > numberOfCardsToDraw - 1)
    );
  };
  const pileDrawlogicHandling = (player) => {
    cardDrawLogicHandling(player, 1);
  };
  const playCard = (card, player) => {
    let newColor;
    switch (card.type) {
      case types.NORMAL:
        if (
          card.color === pileFirstCard.color ||
          card.number === pileFirstCard.number
        ) {
          cardPlayingLogicHandling(card, player);
        }
        break;
      case types.SPECIAL:
        if (
          card.color === pileFirstCard.color ||
          card.number === pileFirstCard.number
        ) {
          cardPlayingLogicHandling(card, player);
          if (card.type === types.SPECIAL && card.number === numbers.DRAW_TWO) {
            cardDrawLogicHandling(player, 2);
          }
        }
        break;
      case types.WILD:
        newColor = prompt("choose color");
        cardPlayingLogicHandling(card, player, newColor);
        break;
      case types.WILD_FOUR:
        newColor = prompt("choose color");
        cardPlayingLogicHandling(card, player, newColor);
        if (card.type === types.WILD_FOUR) {
          cardDrawLogicHandling(player, 4);
        }
        break;
      default:
        alert("no");
    }
  };
  return (
    <div>
      <p>player 2 hand</p>
      <button onClick={pileDrawlogicHandling.bind(this, 1)}>DRAW</button>
      {playerTwoHand.map((card) => (
        <span onClick={playCard.bind(this, card, 2)}>
          <CardImage card={card} />
        </span>
      ))}

      <p>player 1 hand</p>
      <button onClick={pileDrawlogicHandling.bind(this, 2)}>DRAW</button>
      {playerOneHand.map((card) => (
        <span onClick={playCard.bind(this, card, 1)}>
          <CardImage card={card} />
        </span>
      ))}
      <p>pile</p>
      {cardPile.map((card) => (
        <CardImage card={card} />
      ))}
      <p>deck</p>
      {deckPile.map((card) => (
        <CardImage card={card} />
      ))}
      <span>player 2 hand size: {playerTwoHand.length}</span>
      <br />
      <span>player1 hand size: {playerOneHand.length}</span>
      <br />
      <span>cardPile size: {cardPile.length}</span>
      <br />
      <span>deckPile size: {deckPile.length}</span>
      <br />
      <span>
        TOTAL:
        {deckPile.length +
          playerTwoHand.length +
          cardPile.length +
          playerOneHand.length}
      </span>
      <br />
    </div>
  );
};

export default UnoGame;
