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
  const [wasCardDrawnFromDeckPile, setWasCardDrawnFromDeckPile] =
    useState(false);
  const [drawFromPileAfterShuffle, setDrawFromPileAfterShuffle] = useState({
    player: null,
    numberOfCards: 0,
  });
  const [nstate, setNState] = useState(false);
  const [nstate2, setNState2] = useState(false);
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
    if (!gameStart) return;
    switch (true) {
      case playerOneHand.length === 0:
        console.log("player 1 won the game");
        return;
      case playerTwoHand.length === 0:
        console.log("player 2 won the game");
        return;
      default:
        return;
    }
  }, [playerOneHand, playerTwoHand, gameStart]);

  //Checks if there is a playable card after Drawing one
  useEffect(() => {
    if (!gameStart) return;
    let canPlayCard = false;
    const currentPlayer = turnCount ? 1 : 2;
    const currentPlayerHand = turnCount ? playerOneHand : playerTwoHand;
    for (let i of currentPlayerHand) {
      if (canPlayCard) break;
      if (playCard(i, currentPlayer, true)) canPlayCard = true;
    }
    if (!canPlayCard) {
      alert("no card can be played, it is next player turn");
      setTurnCount((prevState) => !prevState);
    }
  }, [wasCardDrawnFromDeckPile]);

  //detecting Empty deck & suffling with card pile

  const mergeDeckWithPile = useCallback(() => {
    if (!gameStart) return;
    if (cardPile.length === 1) return;
    setDeckPile(arrayShuffle(cardPile.slice(0, cardPile.length - 1)));
    setCardPile([pileFirstCard]);
  }, [pileFirstCard, gameStart, cardPile]);

  useEffect(() => {
    if (deckPile.length !== 0) return;
    mergeDeckWithPile();
  }, [mergeDeckWithPile, deckPile, drawFromPileAfterShuffle]);

  useEffect(() => {
    if (!gameStart) return;
    const { player, numberOfCards } = drawFromPileAfterShuffle;
    if (!player || !numberOfCards) return;
    cardDrawLogicHandling(player, numberOfCards);
  }, [mergeDeckWithPile]);

  useEffect(() => {
    if (!nstate) return;
    for (let i of playerTwoHand) {
      if (playCard(i, 2, true)) {
        playCard(i, 2, false);
        return;
      }
    }
  }, [playerOneHand]);
  useEffect(() => {
    if (!nstate2) return;
    for (let i of playerOneHand) {
      if (playCard(i, 1, true)) {
        playCard(i, 1, false);
        return;
      }
    }
  }, [playerTwoHand]);
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
    let remainingCardsToDraw = 0;
    if (numberOfCardsToDraw > deckPile.length) {
      remainingCardsToDraw = numberOfCardsToDraw - deckPile.length;
      setDrawFromPileAfterShuffle({
        player: player === 1 ? 2 : 1,
        numberOfCards: remainingCardsToDraw,
      });
    } else {
      setDrawFromPileAfterShuffle({ player: null, numberOfCards: 0 });
    }

    if (player === 1) {
      setPlayerTwoHand((prevState) => [
        ...prevState,
        ...deckPile.slice(0, numberOfCardsToDraw - remainingCardsToDraw),
      ]);
    } else if (player === 2) {
      setPlayerOneHand((prevState) => [
        ...prevState,
        ...deckPile.slice(0, numberOfCardsToDraw - remainingCardsToDraw),
      ]);
    }
    setDeckPile((prevState) =>
      prevState.filter(
        (el, index) => index > numberOfCardsToDraw - remainingCardsToDraw - 1
      )
    );
  };

  const pileDrawlogicHandling = (player) => {
    setWasCardDrawnFromDeckPile((prevState) => !prevState);
    if ((player === 1 && turnCount) || (player === 2 && !turnCount)) return;
    cardDrawLogicHandling(player, 1);
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
          if (deckPile.length + cardPile.length < 4) {
            console.log("cannot draw from deck unless you play cards in pile");
            return isCardPlayable;
          }
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
        newColor = prompt("choose color");
        cardPlayingLogicHandling(card, player, newColor);
        setTurnCount((prevState) => !prevState);

        break;
      case types.WILD_FOUR:
        if (deckPile.length + cardPile.length < 6) {
          console.log("cannot draw from deck unless you play cards in pile");
          return isCardPlayable;
        }
        isCardPlayable = true;
        if (test) break;
        newColor = prompt("choose color");
        switch (challengeAccepted(player)) {
          case "declined":
            cardDrawLogicHandling(player, 4);
            break;
          case "won":
            cardDrawLogicHandling(player === 1 ? 2 : 1, 6);
            break;
          case "lost":
            cardDrawLogicHandling(player, 6);
            break;
          default:
            break;
        }

        cardPlayingLogicHandling(card, player, newColor);
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

  //challenge handler
  const challengeAccepted = (player) => {
    const choice = prompt("accept or decline (yes or no)");
    if (choice === "no") {
      console.log("declined");
      return "declined";
    }

    const challengedPlyerHand = player === 1 ? playerOneHand : playerTwoHand;
    let challengeResult = "lost";
    for (let i of challengedPlyerHand) {
      if (i.type === types.WILD_FOUR) break;
      if (playCard(i, player, true)) {
        challengeResult = "won";
        break;
      }
    }
    return challengeResult;
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
      {!turnCount && (
        <span
          style={{
            color: "red",
            position: "absolute",
            fontSize: 50,
            transform: "translateX(-110px)",
          }}
        >
          Mine
        </span>
      )}
      {playerTwoHand.map((card) => (
        <span onClick={playCard.bind(this, card, 2, false)}>
          <CardImage card={card} />
        </span>
      ))}

      <p>player 1 hand</p>
      <button onClick={pileDrawlogicHandling.bind(this, 2)}>DRAW</button>
      <button onClick={unoButtonLogicHandling.bind(this, 1)}>UNO</button>
      {turnCount && (
        <span
          style={{
            color: "red",
            position: "absolute",
            fontSize: 50,
            transform: "translateX(-110px)",
          }}
        >
          Mine
        </span>
      )}
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
        <button onClick={() => setNState((prevState) => !prevState)}>
          STOP AI
        </button>
        <span style={{ fontSize: 120 }}>{nstate.toString()}</span>
        <button onClick={() => setNState2((prevState) => !prevState)}>
          STOP AI
        </button>
        <span style={{ fontSize: 120 }}>{nstate2.toString()}</span>
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
prompts (chose color component, challenge component)
scoring (rating)
pass turn button
*/
