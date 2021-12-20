import React, { useState, useEffect, useCallback } from "react";
import arrayShuffle from "array-shuffle";
import deck from "../../cards/deck.js";
import cardColors from "../../cards/colors.ts";
import cardNumbers from "../../cards/number.ts";
import cardTypes from "../../cards/types.ts";
import CardImage from "./CardImage.js";
import PickColorPrompt from "./PickColorPrompt.js";
import ChallengePrompt from "./ChallengePrompt.js";
import WinnerAnnouncer from "./WinnerAnnouncer.js";
import { botAINormal, botAIChallenge } from "../../utils/botAI.ts";

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
  const [nstate, setNState] = useState(true);
  const [isColorPrompt, setIsColorPrompt] = useState(false);
  const [isChallengePrompt, setIsChallengePrompt] = useState(false);
  const [promptChosenColor, setPromptChosenColor] = useState(null);
  const [promptChallengeResult, setPromptChallengeResult] = useState(null);
  const [drawFromPileAfterShuffle, setDrawFromPileAfterShuffle] = useState({
    player: null,
    numberOfCards: 0,
  });
  const [isWinner, setIsWinner] = useState({
    exist: false,
    winningPlayer: null,
  });
  const [wildCardPlayerData, setWildCardPlayerData] = useState({
    cardType: null,
    player: null,
  });

  useEffect(() => {
    setPlayerOneHand(gameDeck.splice(0, 7));
    setPlayerTwoHand(gameDeck.splice(0, 7));
    while (true) {
      let firstCard = gameDeck[0];
      if (firstCard.type === cardTypes.NORMAL) {
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
        setIsWinner({ exist: true, winningPlayer: 1 });
        return;
      case playerTwoHand.length === 0:
        setIsWinner({ exist: true, winningPlayer: 2 });
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
      console.log("no card can be played, it is next player turn");
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

  //merges deck with pile whenever draw pile becomes empty
  useEffect(() => {
    if (deckPile.length !== 0) return;
    mergeDeckWithPile();
  }, [mergeDeckWithPile, deckPile, drawFromPileAfterShuffle]);

  //draws cards after merging piles if the drawn cards should exceed deck size
  useEffect(() => {
    if (!gameStart) return;
    const { player, numberOfCards } = drawFromPileAfterShuffle;
    if (!player || !numberOfCards) return;
    cardDrawLogicHandling(player, numberOfCards);
  }, [mergeDeckWithPile]);

  //executing logic after a WILD card is played
  useEffect(() => {
    if (!gameStart) return;
    const { cardType, player } = wildCardPlayerData;
    if (!promptChosenColor || !!isColorPrompt || !cardType) return;
    const card = { type: cardType, number: null, color: null };
    cardPlayingLogicHandling(card, player, promptChosenColor);
    if (cardType === cardTypes.WILD_FOUR) {
      setIsChallengePrompt(true);
    }
    if (cardType === cardTypes.WILD) {
      setWildCardPlayerData({ player: null, cardType: null });
      setTurnCount((prevState) => !prevState);
    }
  }, [promptChosenColor, gameStart]);

  //executing challenge logic

  useEffect(() => {
    if (!gameStart) return;
    const { player } = wildCardPlayerData;
    if (!promptChallengeResult || !!isChallengePrompt) return;
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
    setWildCardPlayerData({ player: null, cardType: null });
    setPromptChallengeResult(null);
  }, [promptChallengeResult, gameStart]);

  // player 2 AI
  useEffect(() => {
    if (!nstate) return;
    if (turnCount && isChallengePrompt) {
      botAIChallenge(setPromptChallengeResult, setIsChallengePrompt);
    }
    if (!turnCount && isChallengePrompt) {
      return;
    }
    if (turnCount) return;
    if (playerTwoHand.length === 2) {
      unoButtonLogicHandling(2);
    }
    botAINormal(
      playCard,
      isColorPrompt,
      setIsColorPrompt,
      setPromptChosenColor,
      2,
      playerTwoHand,
      pileDrawlogicHandling
    );
  }, [turnCount, nstate, isChallengePrompt, isColorPrompt, playerTwoHand]);

  const cardPlayingLogicHandling = (card, player, newColor) => {
    const filterHand = (prevState) => {
      let cardIndex = -1;
      for (let i in prevState) {
        if (JSON.stringify(prevState[i]) === JSON.stringify(card)) {
          cardIndex = Number(i);
          break;
        }
      }
      return prevState.filter((el, index) => index !== cardIndex);
    };
    setCardPile((prevState) => [...prevState, card]);
    !newColor
      ? setPileFirstCard(card)
      : setPileFirstCard({ ...card, color: newColor });
    player === 1
      ? setPlayerOneHand((prevState) => filterHand(prevState))
      : setPlayerTwoHand((prevState) => filterHand(prevState));
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
    let isCardPlayable = false;
    if ((player === 2 && turnCount) || (player === 1 && !turnCount))
      return isCardPlayable;
    switch (card.type) {
      case cardTypes.NORMAL:
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
      case cardTypes.SPECIAL:
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

          if (
            card.type === cardTypes.SPECIAL &&
            card.number === cardNumbers.DRAW_TWO
          ) {
            cardDrawLogicHandling(player, 2);
          }
        }
        break;
      case cardTypes.WILD:
        isCardPlayable = true;
        if (test) break;
        setIsColorPrompt(true);
        setWildCardPlayerData({ cardType: cardTypes.WILD, player });
        break;
      case cardTypes.WILD_FOUR:
        if (deckPile.length + cardPile.length < 6) {
          console.log("cannot draw from deck unless you play cards in pile");
          return isCardPlayable;
        }
        isCardPlayable = true;
        if (test) break;
        setIsColorPrompt(true);
        setWildCardPlayerData({ cardType: cardTypes.WILD_FOUR, player });
        break;
      default:
        break;
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
        console.log(`player ${player} annouced uno`);
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
        console.log(`player ${player} annouced uno`);
        setPlayerTwoUnoState(true);
        break;
      default:
        return;
    }
  };

  //challenge handler
  const challengeAccepted = (player) => {
    if (promptChallengeResult === "declined") {
      return "declined";
    }
    const challengedPlyerHand = player === 1 ? playerOneHand : playerTwoHand;
    let challengeResult = "lost";
    for (let i of challengedPlyerHand) {
      if (i.type === cardTypes.WILD_FOUR) break;
      if (playCard(i, player, true)) {
        challengeResult = "won";
        break;
      }
    }
    return challengeResult;
  };

  return (
    <div>
      {isWinner?.exist ? (
        <>
          <WinnerAnnouncer winner={isWinner?.winningPlayer} />
        </>
      ) : (
        <>
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
                fontSize: 20,
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
                fontSize: 20,
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
            TOTAL:
            {deckPile.length +
              playerTwoHand.length +
              cardPile.length +
              playerOneHand.length}
          </span>
          <br />
          <PickColorPrompt
            isColorPrompt={isColorPrompt}
            setIsColorPrompt={setIsColorPrompt}
            setPromptChosenColor={setPromptChosenColor}
            currentPlayer={turnCount ? 1 : 2}
          />
          <ChallengePrompt
            isChallengePrompt={isChallengePrompt}
            setIsChallengePrompt={setIsChallengePrompt}
            setPromptChallengeResult={setPromptChallengeResult}
            currentPlayer={turnCount ? 2 : 1}
          />
        </>
      )}
    </div>
  );
};

export default UnoGame;

/*missing features 
prompts (chose color component, challenge component)
scoring (rating)
pass turn button
*/
