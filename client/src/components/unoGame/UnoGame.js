import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
  useMemo,
} from "react";
import deck from "../../cards/deck.js";
import colors from "../../cards/colors.ts";
import numbers from "../../cards/number.ts";
import types from "../../cards/types.ts";
import CardImage from "./CardImage.js";
import arrayShuffle from "array-shuffle";
import { setTimeout } from "timers";
const UnoGame = () => {
  let gameDeck = deck.map((el) => el);
  const [gameStart, setGameStart] = useState(false);
  const [playerOneHand, setPlayerOneHand] = useState([]);
  const [playerTwoHand, setPlayerTwoHand] = useState([]);
  const [cardPile, setCardPile] = useState([]);
  const [pileFirstCard, setPileFirstCard] = useState();
  const [deckPile, setDeckPile] = useState([]);
  const [playerOneUnoState, setPlayerOneUnoState] = useState(false);
  const [playerTwoUnoState, setPlayerTwoUnoState] = useState(false);
  const [failedUnoMessage, setFailedUnoMessage] = useState("");
  const [turnCount, setTurnCount] = useState(true);
  const [canDraw, setCanDraw] = useState(true);

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
    setGameStart(true);
  }, []);

  //detecting winner
  useEffect(() => {
    if (gameStart === false) return;
    switch (true) {
      case playerOneHand.length === 0:
        alert("player 1 won the game");
        return;
      case playerTwoHand.length === 0:
        alert("player 2 won the game");
        return;
      default:
        return;
    }
  }, [playerOneHand, playerTwoHand, gameStart]);

  //detecting Empty deck & suffling with card pile

  const mergeDeckWithPile = useCallback(() => {
    if (!gameStart) return;
    if (deckPile.length > 6) return;
    if (cardPile.length === 1) return;
    setDeckPile(arrayShuffle(cardPile.slice(0, cardPile.length - 1)));
    setCardPile([pileFirstCard]);
  }, [deckPile, pileFirstCard, gameStart, cardPile]);

  useLayoutEffect(() => {
    mergeDeckWithPile();
  }, [mergeDeckWithPile]);

  useEffect(() => {
    let tast = true;
    for (let i of playerTwoHand) {
      if (playCard(i, 2, true)) {
        playCard(i, 2, false);
        return;
      }
    }
  }, [playerOneHand]);

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
      setPlayerTwoHand((prevState) => [
        ...prevState,
        ...deckPile.slice(0, numberOfCardsToDraw),
      ]);
    } else if (player === 2) {
      setPlayerOneHand((prevState) => [
        ...prevState,
        ...deckPile.slice(0, numberOfCardsToDraw),
      ]);
    }
    setDeckPile((prevState) =>
      prevState.filter((el, index) => index > numberOfCardsToDraw - 1)
    );
  };

  const pileDrawlogicHandling = (player) => {
    if ((player === 1 && turnCount) || (player === 2 && !turnCount)) return;
    cardDrawLogicHandling(player, 1);
    setTurnCount((prevState) => !prevState);
  };

  const playCard = (card, player, test) => {
    let newColor;
    let isCardPlayable = false;
    if ((player === 2 && turnCount) || (player === 1 && !turnCount))
      return isCardPlayable;
    switch (card.type) {
      case types.NORMAL:
        if (
          card.color === pileFirstCard.color ||
          card.number === pileFirstCard.number
        ) {
          isCardPlayable = true;
          if (test) break;
          cardPlayingLogicHandling(card, player);
          setTurnCount((prevState) => !prevState);
        }
        break;
      case types.SPECIAL:
        if (
          card.color === pileFirstCard.color ||
          card.number === pileFirstCard.number
        ) {
          isCardPlayable = true;
          if (test) break;
          cardPlayingLogicHandling(card, player);

          if (card.type === types.SPECIAL && card.number === numbers.DRAW_TWO) {
            cardDrawLogicHandling(player, 2);
          }
        }
        break;
      case types.WILD:
        isCardPlayable = true;
        if (test) break;
        // newColor = prompt("choose color");
        newColor = "red";
        cardPlayingLogicHandling(card, player, newColor);
        setTurnCount((prevState) => !prevState);

        break;
      case types.WILD_FOUR:
        isCardPlayable = true;
        if (test) break;
        // newColor = prompt("choose color");
        newColor = "red";
        cardPlayingLogicHandling(card, player, newColor);
        cardDrawLogicHandling(player, 4);

        break;
      default:
        return;
    }
    if (
      player === 1 &&
      playerOneHand.length === 2 &&
      !playerOneUnoState &&
      isCardPlayable
    ) {
      if (test) return isCardPlayable;
      setFailedUnoMessage(
        `sorry player ${player} , you forgot to say uno, take a small gift`
      );
      setTimeout(() => setFailedUnoMessage(""), 10000);
      cardDrawLogicHandling(2, 2);
    }
    if (
      player === 2 &&
      playerTwoHand.length === 2 &&
      !playerTwoUnoState &&
      isCardPlayable
    ) {
      if (test) return isCardPlayable;
      setFailedUnoMessage(
        `sorry player ${player} , you forgot to say uno, take a small gift`
      );
      setTimeout(() => setFailedUnoMessage(""), 10000);
      cardDrawLogicHandling(1, 2);
    }
    if (!test) {
      setPlayerOneUnoState(false);
      setPlayerTwoUnoState(false);
    }
    return isCardPlayable;
  };

  const unoButtonLogicHandling = (player) => {
    let isTherePlayableCardInHand = false;
    switch (player) {
      case 1:
        if (playerOneHand.length !== 2) return;
        for (let i of playerOneHand) {
          if (playCard(i, 1, true)) {
            isTherePlayableCardInHand = true;
            break;
          }
        }
        if (!isTherePlayableCardInHand) return;
        alert(`player ${player} annouced uno`);
        setPlayerOneUnoState(true);
        break;
      case 2:
        if (playerTwoHand.length !== 2) return;
        for (let i of playerTwoHand) {
          if (playCard(i, 2, true)) {
            isTherePlayableCardInHand = true;
            break;
          }
        }
        if (!isTherePlayableCardInHand) return;
        alert(`player ${player} annouced uno`);
        setPlayerTwoUnoState(true);
        break;
      default:
        return;
    }
  };

  return (
    <div>
      <p>
        1:{playerOneUnoState.toString()} 2: {playerTwoUnoState.toString()}
      </p>
      {failedUnoMessage && <p>{failedUnoMessage}</p>}
      <p>player 2 hand</p>
      <button onClick={pileDrawlogicHandling.bind(this, 1)}>DRAW</button>
      <button onClick={unoButtonLogicHandling.bind(this, 2)}>UNO</button>
      {/* {!turnCount && <span>Mine trun</span>} */}
      {playerTwoHand.map((card) => (
        <span onClick={playCard.bind(this, card, 2, false)}>
          <CardImage card={card} />
        </span>
      ))}

      <p>player 1 hand</p>
      <button onClick={pileDrawlogicHandling.bind(this, 2)}>DRAW</button>
      <button onClick={unoButtonLogicHandling.bind(this, 1)}>UNO</button>
      {/* {turnCount && <span>Mine trun</span>} */}
      {playerOneHand.map((card) => (
        <span onClick={playCard.bind(this, card, 1, false)}>
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

/*missing features 
//reshuffle pile
//cant draw if its not your turn
handle deck pile draw error (drawing more than rest in deckpile)
+4 challenge
*/
