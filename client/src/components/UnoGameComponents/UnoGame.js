import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useContext,
} from "react";
import arrayShuffle from "array-shuffle";
import deck from "../../cards/deck.js";
import cardNumbers from "../../cards/number.ts";
import cardTypes from "../../cards/types.ts";
import CardImage from "./CardImage.js";
import PickColorPrompt from "./PickColorPrompt.js";
import ChallengePrompt from "./ChallengePrompt.js";
import WinnerAnnouncer from "./WinnerAnnouncer.js";
import ChatWidget from "../ChatWidget/ChatWidget.js";
import ScreenDisable from "./ScreenDisable.js";
import { botAINormal, botAIChallenge, botAIColor } from "../../utils/botAI.ts";
import { UserContext } from "../../context/Contexts.js";
import { MutatingDots } from "react-loader-spinner";
import "./styles/UnoGame.sass";

const UnoGame = ({
  gameType,
  socket,
  room,
  currentPlayer,
  playersUsernames,
}) => {
  const { currentPlayerNumber } = currentPlayer;
  const { user } = useContext(UserContext);
  let gameDeck = deck.map((el) => el);
  const [gameStart, setGameStart] = useState(false);
  const [playerOneHand, setPlayerOneHand] = useState([]);
  const [playerTwoHand, setPlayerTwoHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [discardPileFirstCard, setDiscardPileFirstCard] = useState();
  const [drawPile, setDrawPile] = useState([]);
  const [playerOneUnoState, setPlayerOneUnoState] = useState(false);
  const [playerTwoUnoState, setPlayerTwoUnoState] = useState(false);
  const [turnCount, setTurnCount] = useState(true);
  const [failedUnoMessage, setFailedUnoMessage] = useState("");
  const [wasCardDrawnFromDeckPile, setWasCardDrawnFromDeckPile] =
    useState(false);
  const [isColorPrompt, setIsColorPrompt] = useState(false);
  const [isChallengePrompt, setIsChallengePrompt] = useState(false);
  const [promptChosenColor, setPromptChosenColor] = useState("none");
  const [promptChallengeResult, setPromptChallengeResult] = useState("none");
  const [didMultiplayerStart, setDidMultiplayerStart] = useState(false);
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
  const [playerOneScore, setPlayerOneScore] = useState(0);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);
  const discardPileFirstCardMemo = useMemo(
    () => discardPileFirstCard,
    [
      discardPileFirstCard?.type,
      discardPileFirstCard?.number,
      discardPileFirstCard?.color,
    ]
  );
  const playerHandRef = useRef();
  const opposingPlayerHandRef = useRef();
  // Starting the game

  const gameStarter = useCallback(() => {
    setPlayerOneHand(gameDeck.splice(0, 7));
    setPlayerTwoHand(gameDeck.splice(0, 7));
    while (true) {
      let firstCard = gameDeck[0];
      if (firstCard.type === cardTypes.NORMAL) {
        setDiscardPileFirstCard(gameDeck.slice(0, 1)[0]);
        setDiscardPile(gameDeck.splice(0, 1));
        break;
      } else {
        gameDeck = arrayShuffle(gameDeck);
        continue;
      }
    }
    setDrawPile(gameDeck);
    setGameStart(true);
  }, []);

  //ALL socket events

  //game starting socket
  useEffect(() => {
    if (currentPlayerNumber === 1) return;
    socket &&
      socket.on(
        "start-game",
        ({
          playerOneHand,
          playerTwoHand,
          discardPile,
          discardPileFirstCard,
          drawPile,
        }) => {
          setPlayerOneHand(playerOneHand);
          setPlayerTwoHand(playerTwoHand);
          setDiscardPile(discardPile);
          setDiscardPileFirstCard(discardPileFirstCard);
          setDrawPile(drawPile);
          setGameStart(true);
          setDidMultiplayerStart(true);
        }
      );
  }, []);

  //Only 1 player should start the gamestate & send it to the opponent
  useEffect(() => {
    if (currentPlayerNumber === 2) return;
    gameStarter();
  }, []);

  // second player receiving the gamestate
  useEffect(() => {
    if (currentPlayerNumber === 2) return;
    if (!gameStart) return;
    socket &&
      socket.emit("game-init", room, {
        playerOneHand,
        playerTwoHand,
        discardPile,
        discardPileFirstCard,
        drawPile,
      });
  }, [gameStart]);

  //game update socket handler
  useEffect(() => {
    socket &&
      socket.on("player-disconnected", (_id) => {
        let winnerNumber;
        if (currentPlayer.id !== _id) winnerNumber = currentPlayerNumber;

        setIsWinner({
          exist: true,
          winningPlayer: winnerNumber,
          playerOneScore: playerOneScore + 50,
          playerTwoScore: playerOneScore + 50,
        });
      });
    socket &&
      socket.on(
        "game-update",
        ({
          playerOneHand,
          playerTwoHand,
          discardPile,
          discardPileFirstCard,
          drawPile,
          turnCount,
          isChallengePrompt,
          promptChallengeResult,
          wildCardPlayerData,
          promptChosenColor,
          didMultiplayerStart,
        }) => {
          if (typeof gameStart === "boolean" && !gameStart) setGameStart(true);
          if (
            typeof didMultiplayerStart === "boolean" &&
            !didMultiplayerStart
          ) {
            setDidMultiplayerStart(true);
          }
          playerOneHand &&
            setPlayerOneHand((prevState) => {
              if (prevState?.length === playerOneHand?.length) return prevState;
              return playerOneHand;
            });
          playerTwoHand &&
            setPlayerTwoHand((prevState) => {
              if (prevState?.length === playerTwoHand?.length) return prevState;
              return playerTwoHand;
            });
          discardPile &&
            setDiscardPile((prevState) => {
              if (prevState?.length === discardPile?.length) return prevState;
              return discardPile;
            });
          discardPileFirstCard && setDiscardPileFirstCard(discardPileFirstCard);
          drawPile &&
            setDrawPile((prevState) => {
              if (prevState?.length === drawPile?.length) return prevState;
              return drawPile;
            });
          typeof turnCount === "boolean" && setTurnCount(turnCount);
          typeof isChallengePrompt === "boolean" &&
            setIsChallengePrompt(isChallengePrompt);
          promptChallengeResult &&
            setPromptChallengeResult(promptChallengeResult);
          wildCardPlayerData && setWildCardPlayerData(wildCardPlayerData);
          promptChosenColor !== undefined &&
            setPromptChosenColor(promptChosenColor);
        }
      );
  }, []);

  //Emiting game changes 1 by 1

  useEffect(() => {
    if (!gameStart) return;
    if (gameType !== "multiplayer") return;
    socket &&
      socket.emit("game-update", room, {
        didMultiplayerStart: false,
      });
  }, [didMultiplayerStart]);
  useEffect(() => {
    if (!gameStart) return;
    if (gameType !== "multiplayer") return;
    socket &&
      socket.emit("game-update", room, {
        playerOneHand,
      });
  }, [playerOneHand?.length]);
  useEffect(() => {
    if (!gameStart) return;
    if (gameType !== "multiplayer") return;
    socket &&
      socket.emit("game-update", room, {
        playerTwoHand,
      });
  }, [playerTwoHand?.length]);
  useEffect(() => {
    if (!gameStart) return;
    if (gameType !== "multiplayer") return;
    socket &&
      socket.emit("game-update", room, {
        discardPile,
      });
  }, [discardPile?.length]);
  useEffect(() => {
    if (!gameStart) return;
    if (gameType !== "multiplayer") return;
    socket &&
      socket.emit("game-update", room, {
        discardPileFirstCard: discardPileFirstCardMemo,
      });
  }, [discardPileFirstCardMemo]);
  useEffect(() => {
    if (!gameStart) return;
    if (gameType !== "multiplayer") return;
    socket &&
      socket.emit("game-update", room, {
        drawPile,
      });
  }, [drawPile?.length]);
  useEffect(() => {
    if (!gameStart) return;
    if (gameType !== "multiplayer") return;
    socket && socket.emit("game-update", room, { turnCount });
  }, [turnCount]);
  useEffect(() => {
    if (!gameStart) return;
    if (gameType !== "multiplayer") return;
    socket &&
      socket.emit("game-update", room, {
        isChallengePrompt,
      });
  }, [isChallengePrompt]);
  useEffect(() => {
    if (!gameStart) return;
    if (gameType !== "multiplayer") return;
    if (
      (turnCount && currentPlayerNumber === 1) ||
      (!turnCount && currentPlayerNumber === 2)
    )
      return;
    socket &&
      socket.emit("game-update", room, {
        promptChallengeResult,
      });
  }, [promptChallengeResult]);

  useEffect(() => {
    if (!gameStart) return;
    if (gameType !== "multiplayer") return;
    if (
      (turnCount && currentPlayerNumber === 1) ||
      (!turnCount && currentPlayerNumber === 2)
    )
      socket &&
        socket.emit("game-update", room, {
          promptChosenColor,
        });
  }, [promptChosenColor]);

  //end of socket events
  //detecting winner
  useEffect(() => {
    if (!gameStart) return;
    if (gameType === "multiplayer" && !didMultiplayerStart) return;
    switch (true) {
      case playerOneHand?.length === 0:
        setIsWinner({
          exist: true,
          winningPlayer: 1,
          playerOneScore,
          playerTwoScore,
        });
        return;
      case playerTwoHand?.length === 0:
        setIsWinner({
          exist: true,
          winningPlayer: 2,
          playerOneScore,
          playerTwoScore,
        });
        return;
      default:
        return;
    }
  }, [playerOneHand, playerTwoHand, gameStart]);

  //Checks if there is a playable card after Drawing one
  useEffect(() => {
    if (!gameStart || !wasCardDrawnFromDeckPile) return;
    let canPlayCard = false;
    const currentPlayer = turnCount ? 1 : 2;
    const currentPlayerHand = turnCount ? playerOneHand : playerTwoHand;
    for (let i of currentPlayerHand) {
      if (canPlayCard) break;
      if (playCard(i, currentPlayer, true)) canPlayCard = true;
    }
    if (!canPlayCard) {
      // console.log("no card can be played, it is next player turn");
      return setTurnCount((prevState) => !prevState);
    }
  }, [wasCardDrawnFromDeckPile]);

  //detecting Empty deck & suffling with card pile

  const mergeDeckWithPile = useCallback(() => {
    if (!gameStart || discardPile?.length === 1) return;
    setDrawPile(arrayShuffle(discardPile.slice(0, discardPile?.length - 1)));
    setDiscardPile([discardPileFirstCard]);
  }, [discardPileFirstCard, gameStart, discardPile]);

  //merges deck with pile whenever draw pile becomes empty
  useEffect(() => {
    if (drawPile?.length !== 0) return;
    if (
      gameType === "multiplayer" &&
      ((turnCount && currentPlayerNumber === 1) ||
        (!turnCount && currentPlayerNumber === 2))
    )
      return;
    mergeDeckWithPile();
  }, [mergeDeckWithPile, drawPile, drawFromPileAfterShuffle]);

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
    if (promptChosenColor === "none" || !cardType) return;
    if (
      gameType === "multiplayer" &&
      ((turnCount && currentPlayerNumber === 2) ||
        (!turnCount && currentPlayerNumber === 1))
    )
      return;
    if (!!isColorPrompt) return;
    const card = { type: cardType, number: null, color: null };
    if (cardType === cardTypes.WILD_FOUR) {
      setIsChallengePrompt(true);
    }
    if (cardType === cardTypes.WILD) {
      cardPlayingLogicHandling(card, player, promptChosenColor);
      setWildCardPlayerData({ player: null, cardType: null });
      setPromptChosenColor("none");
      setTurnCount((prevState) => !prevState);
    }
  }, [wildCardPlayerData, promptChosenColor, isColorPrompt, gameStart]);

  //executing challenge logic

  useEffect(() => {
    if (!gameStart) return;
    const { player } = wildCardPlayerData;
    const wilDFourCard = {
      type: cardTypes.WILD_FOUR,
      number: null,
      color: null,
    };
    if (promptChallengeResult === "none" || !!isChallengePrompt) return;
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
    cardPlayingLogicHandling(wilDFourCard, player, promptChosenColor);
    setWildCardPlayerData({ player: null, cardType: null });
    setPromptChallengeResult("none");
    setPromptChosenColor("none");
  }, [promptChallengeResult]);

  // Uno state Resetter
  useEffect(() => {
    if (!gameStart) return;
    if (playerOneUnoState && playerOneHand?.length !== 2) {
      setPlayerOneUnoState(false);
      return;
    }
    if (playerTwoUnoState && playerTwoHand?.length !== 2) {
      setPlayerTwoUnoState(false);
      return;
    }
  }, [
    gameStart,
    playerOneUnoState,
    playerTwoUnoState,
    playerOneHand,
    playerTwoHand,
  ]);
  //resets Draw 1 card whenever a card is played
  useEffect(() => {
    if (!gameStart) return;
    setWasCardDrawnFromDeckPile(false);
  }, [gameStart, discardPileFirstCard, turnCount]);

  // player 2 AI no Prompts
  useEffect(() => {
    if (!gameStart || gameType === "multiplayer") return;
    if (turnCount) return;
    if (playerTwoHand?.length === 2 && !playerTwoUnoState)
      return pileDrawlogicHandling(1);
    botAINormal(playCard, 2, playerTwoHand, pileDrawlogicHandling);
  }, [
    gameStart,
    turnCount,
    playerTwoUnoState,
    playerTwoHand?.length,
    playerOneHand?.length,
    wasCardDrawnFromDeckPile,
    discardPileFirstCardMemo,
    discardPile?.length,
    drawPile?.length,
  ]);

  // player 2 AI color Prompt
  useEffect(() => {
    if (!gameStart || gameType === "multiplayer" || !isColorPrompt) return;
    if (turnCount) return;
    if (!turnCount && !isColorPrompt) return;
    botAIColor(playerTwoHand, setPromptChosenColor, setIsColorPrompt);
  });

  // player 2 AI challenge Prompt
  useEffect(() => {
    if (!turnCount) return;
    if (!gameStart || gameType === "multiplayer" || !isChallengePrompt) return;
    botAIChallenge(setPromptChallengeResult, setIsChallengePrompt);
  });

  //player Two AI uno announcing
  useEffect(() => {
    if (!gameStart || playerTwoHand?.length !== 2 || playerTwoUnoState) return;
    unoButtonLogicHandling(2);
  });

  //Styling
  //changing background color each time the color of the discard pile changes
  useEffect(() => {
    const unoGameContainer = document.getElementById("uno-game");
    if (!discardPileFirstCard?.color) return;
    unoGameContainer.style.backgroundImage = `url(/assets/Backgrounds/game-bg-${discardPileFirstCard.color}.svg)`;
  }, [discardPileFirstCard?.color]);

  useEffect(() => {
    const playerHandChildren = playerHandRef.current?.children;
    const opposingPlayerHandChildren = opposingPlayerHandRef.current?.children;
    let squeezeDistance = 50 / playerHandChildren?.length;
    let opposingSqueezeDistance = 50 / opposingPlayerHandChildren?.length;
    //current player hand styling
    if (playerHandChildren?.length < 8) {
      for (let i of playerHandChildren) {
        i.style.position = "static";
      }
    } else {
      for (let i = 0; i < playerHandChildren?.length; i++) {
        playerHandChildren[i].style.position = "absolute";
        playerHandChildren[i].style.zIndex = i;
        playerHandChildren[i].style.left = `${i * squeezeDistance}vw`;
      }
    }
    //opposing player hand styling
    if (opposingPlayerHandChildren?.length < 8) {
      for (let i of opposingPlayerHandChildren) {
        i.style.position = "static";
      }
    } else {
      for (let i = 0; i < opposingPlayerHandChildren?.length; i++) {
        opposingPlayerHandChildren[i].style.position = "absolute";
        opposingPlayerHandChildren[i].style.zIndex =
          opposingPlayerHandChildren?.length - i;
        opposingPlayerHandChildren[i].style.right = `${
          i * opposingSqueezeDistance
        }vw`;
      }
    }
  }, [playerOneHand?.length, playerTwoHand?.length]);

  //Logic when a card is played
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
    setDiscardPile((prevState) => [...prevState, card]);
    !newColor
      ? setDiscardPileFirstCard(card)
      : setDiscardPileFirstCard({ ...card, color: newColor });
    player === 1
      ? setPlayerOneHand((prevState) => filterHand(prevState))
      : setPlayerTwoHand((prevState) => filterHand(prevState));
  };

  //logic for drawing cards from draw pile

  const cardDrawLogicHandling = (player, numberOfCardsToDraw) => {
    let remainingCardsToDraw = 0;
    if (numberOfCardsToDraw > drawPile?.length) {
      remainingCardsToDraw = numberOfCardsToDraw - drawPile?.length;
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
        ...drawPile.slice(0, numberOfCardsToDraw - remainingCardsToDraw),
      ]);
    } else if (player === 2) {
      setPlayerOneHand((prevState) => [
        ...prevState,
        ...drawPile.slice(0, numberOfCardsToDraw - remainingCardsToDraw),
      ]);
    }
    setDrawPile((prevState) =>
      prevState.filter(
        (el, index) => index > numberOfCardsToDraw - remainingCardsToDraw - 1
      )
    );
  };

  // logic for Draw 1 card
  const pileDrawlogicHandling = (player) => {
    if ((player === 1 && turnCount) || (player === 2 && !turnCount)) return;
    if (wasCardDrawnFromDeckPile) {
      // console.log("cannot draw more than 1 card per turn, please play a card");
      return;
    }
    setWasCardDrawnFromDeckPile(true);
    cardDrawLogicHandling(player, 1);
  };

  //Logic to check if a card is playable or not and/or play the card
  const playCard = (card, player, test) => {
    let isCardPlayable = false;
    if ((player === 2 && turnCount) || (player === 1 && !turnCount))
      return isCardPlayable;
    let setCurrentPlayerScore =
      player === 1 ? setPlayerOneScore : setPlayerTwoScore;
    switch (card.type) {
      case cardTypes.NORMAL:
        if (
          card.color === discardPileFirstCard.color ||
          card.number === discardPileFirstCard.number
        ) {
          isCardPlayable = true;
          if (test) break;
          cardPlayingLogicHandling(card, player);
          setCurrentPlayerScore((prevState) => prevState + card.number);
          setTurnCount((prevState) => !prevState);
        }
        break;
      case cardTypes.SPECIAL:
        if (
          card.color === discardPileFirstCard.color ||
          card.number === discardPileFirstCard.number
        ) {
          if (drawPile?.length + discardPile?.length < 4) {
            // console.log("cannot draw from deck unless you play cards in pile");
            return isCardPlayable;
          }
          isCardPlayable = true;
          if (test) break;
          cardPlayingLogicHandling(card, player);
          setCurrentPlayerScore((prevState) => prevState + 20);
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
        setCurrentPlayerScore((prevState) => prevState + 50);
        setIsColorPrompt(true);
        setWildCardPlayerData({ cardType: cardTypes.WILD, player });
        break;
      case cardTypes.WILD_FOUR:
        if (drawPile?.length + discardPile?.length < 6) {
          // console.log("cannot draw from deck unless you play cards in pile");
          return isCardPlayable;
        }
        isCardPlayable = true;
        if (test) break;
        setCurrentPlayerScore((prevState) => prevState + 50);
        setIsColorPrompt(true);
        setWildCardPlayerData({ cardType: cardTypes.WILD_FOUR, player });
        break;
      default:
        break;
    }
    if (
      player === 1 &&
      playerOneHand?.length === 2 &&
      !playerOneUnoState &&
      isCardPlayable
    ) {
      if (test) return isCardPlayable;
      setFailedUnoMessage(
        `Sorry player ${player} , you forgot to say uno, you got +2 cards`
      );
      setTimeout(() => setFailedUnoMessage(""), 10000);
      cardDrawLogicHandling(2, 2);
    }
    if (
      player === 2 &&
      playerTwoHand?.length === 2 &&
      !playerTwoUnoState &&
      isCardPlayable
    ) {
      if (test) return isCardPlayable;
      setFailedUnoMessage(
        `Sorry player ${player} , you forgot to say uno, you got +2 cards`
      );
      setTimeout(() => setFailedUnoMessage(""), 10000);
      cardDrawLogicHandling(1, 2);
    }

    if (!isCardPlayable && playerHandRef.current) {
      playerHandRef.current.className = "player-hand animated-not-played";
      setTimeout(() => {
        playerHandRef.current.className = "player-hand";
      }, 700);
    }
    return isCardPlayable;
  };
  // Uno Button logic

  const unoButtonLogicHandling = (player) => {
    if ((player === 2 && turnCount) || (player === 1 && !turnCount)) return;
    let isTherePlayableCardInHand = false;
    const currentPlayerHand = player === 1 ? playerOneHand : playerTwoHand;
    if (currentPlayerHand?.length !== 2) return;
    for (let i of currentPlayerHand) {
      if (playCard(i, player, true)) {
        isTherePlayableCardInHand = true;
        break;
      }
    }
    if (!isTherePlayableCardInHand) return;
    // console.log(`player ${player} annouced uno`);
    player === 1 ? setPlayerOneUnoState(true) : setPlayerTwoUnoState(true);
  };

  //challenge handler
  const challengeAccepted = (player) => {
    if (promptChallengeResult === "declined") {
      return "declined";
    }
    const challengedPlayerHand = player === 1 ? playerOneHand : playerTwoHand;
    let challengeResult = "lost";
    for (let i of challengedPlayerHand) {
      if (i.type === cardTypes.WILD_FOUR || i.type === cardTypes.WILD) {
        continue;
      }
      if (playCard(i, player, true)) {
        challengeResult = "won";
        break;
      }
    }
    return challengeResult;
  };

  return (
    <section id="uno-game">
      {isWinner?.exist ? (
        <>
          <WinnerAnnouncer
            winnerData={isWinner && isWinner}
            currentPlayerNumber={currentPlayerNumber}
          />
        </>
      ) : (
        <>
          {failedUnoMessage && (
            <span className="failed-uno-message">{failedUnoMessage}</span>
          )}
          <div
            data-testid="player2-ui"
            className={currentPlayerNumber === 2 ? "player-ui" : "opponent-ui"}
          >
            {gameType === "multiplayer" ? (
              <strong>
                <span>Player 2:</span>
                {" " + playersUsernames?.player2?.startsWith("guest")
                  ? playersUsernames?.player2.substring(0, 12)
                  : playersUsernames?.player2}
              </strong>
            ) : null}
            {currentPlayerNumber === 2 ? (
              <>
                <button onClick={pileDrawlogicHandling.bind(this, 1)}>
                  DRAW
                </button>
                <button
                  className="player2-uno-button"
                  onClick={unoButtonLogicHandling.bind(this, 2)}
                >
                  UNO
                </button>
              </>
            ) : null}
            <div
              data-testid="player2-hand"
              className="player-hand"
              ref={
                currentPlayerNumber === 2
                  ? playerHandRef
                  : opposingPlayerHandRef
              }
            >
              {playerTwoHand.map((card, index) => (
                <span
                  key={index}
                  onClick={
                    currentPlayerNumber === 2
                      ? playCard.bind(this, card, 2, false)
                      : null
                  }
                >
                  <CardImage
                    key={index}
                    card={currentPlayerNumber === 2 ? card : "back"}
                    origin="player-card"
                  />
                </span>
              ))}
            </div>
          </div>
          <div
            data-testid="player1-ui"
            className={currentPlayerNumber === 1 ? "player-ui" : "opponent-ui"}
          >
            {gameType === "multiplayer" ? (
              <strong>
                <span>Player 1:</span>
                {" " + playersUsernames?.player1?.startsWith("guest")
                  ? playersUsernames?.player1.substring(0, 12)
                  : playersUsernames?.player1}
              </strong>
            ) : (
              <strong>
                {user?.username?.startsWith("guest")
                  ? user?.username.substring(0, 12)
                  : user?.username}
              </strong>
            )}
            {currentPlayerNumber === 1 ? (
              <>
                <button onClick={pileDrawlogicHandling.bind(this, 2)}>
                  DRAW
                </button>
                <button onClick={unoButtonLogicHandling.bind(this, 1)}>
                  UNO
                </button>
              </>
            ) : null}
            <div
              data-testid="player1-hand"
              className="player-hand"
              ref={
                currentPlayerNumber === 1
                  ? playerHandRef
                  : opposingPlayerHandRef
              }
            >
              {playerOneHand.map((card, index) => (
                <span
                  key={index}
                  onClick={
                    currentPlayerNumber === 1
                      ? playCard.bind(this, card, 1, false)
                      : null
                  }
                >
                  <CardImage
                    key={index}
                    card={currentPlayerNumber === 1 ? card : "back"}
                    origin="player-card"
                  />
                </span>
              ))}
            </div>
          </div>
          <div data-testid="discard-pile" className="discard-pile">
            {discardPile.map(
              (card, index) =>
                discardPile?.length - index < 6 && (
                  <CardImage
                    key={index}
                    card={card}
                    origin="discard-pile-card"
                  />
                )
            )}
          </div>
          <div data-testid="draw-pile" className="draw-pile">
            {drawPile.map((card, index) =>
              index < 11 ? (
                <CardImage key={index} card="back" origin="draw-pile-card" />
              ) : null
            )}
          </div>

          {(currentPlayerNumber === 1 && !turnCount) ||
          (currentPlayerNumber === 2 && turnCount) ? (
            <MutatingDots
              width={100}
              height={100}
              color="white"
              secondaryColor="black"
              arialLabel="loading"
              className="turn-waiting-spinner"
            />
          ) : null}
          <PickColorPrompt
            isColorPrompt={isColorPrompt}
            setIsColorPrompt={setIsColorPrompt}
            setPromptChosenColor={setPromptChosenColor}
            thisTurnPlayer={turnCount ? 1 : 2}
            currentPlayerNumber={currentPlayerNumber}
          />
          <ChallengePrompt
            isChallengePrompt={isChallengePrompt}
            setIsChallengePrompt={setIsChallengePrompt}
            setPromptChallengeResult={setPromptChallengeResult}
            thisTurnPlayer={turnCount ? 1 : 2}
            currentPlayerNumber={currentPlayerNumber}
          />
        </>
      )}
      {gameType === "multiplayer" ? (
        <ChatWidget socket={socket} room={room} />
      ) : null}
      {gameType === "multiplayer" && !didMultiplayerStart ? (
        <ScreenDisable />
      ) : null}
    </section>
  );
};

export default UnoGame;
