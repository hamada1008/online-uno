import cardColors from "../cards/colors";
import arrayShuffle from "array-shuffle";
interface cardInterface {
  type: string;
  number: number;
  color: string;
}
interface cardPlayingLogic {
  (card: cardInterface, player: number, test: boolean): boolean;
}
interface colorSetState {
  (color: null | string): any;
}
interface challengeSetState {
  (challenge: null | string): any;
}
interface drawCardInterface {
  (player: number): any;
}
interface colorPromptSetState {
  (show: boolean): any;
}
export const findDominantColor = (hand: cardInterface[]): string => {
  let numberOfCardsWithSameColor = {
    [cardColors.RED]: 0,
    [cardColors.BLUE]: 0,
    [cardColors.GREEN]: 0,
    [cardColors.YELLOW]: 0,
  };
  for (let i of hand) {
    if (i.color) {
      numberOfCardsWithSameColor = {
        ...numberOfCardsWithSameColor,
        [i.color]: numberOfCardsWithSameColor[i.color] + 1,
      };
    }
  }
  const arrayOfColors = Object.entries(numberOfCardsWithSameColor);
  arrayOfColors.sort((firstEl, secondEl) => secondEl[1] - firstEl[1]);
  return arrayOfColors[0][0];
};

export const botAIChallenge = (
  _: challengeSetState,
  __: colorPromptSetState
): any => {
  const randomChoice = Math.floor(Math.random() * 2);
  switch (randomChoice) {
    case 0:
      _("declined");
      break;
    case 1:
      _("accepted");
      break;
    default:
      _("declined");
      break;
  }
  __(false);
};

export const botAIColor = (
  playerHand: cardInterface[],
  set__: colorSetState,
  set_: colorPromptSetState
): any => {
  let dominantColor = findDominantColor(playerHand);
  set__(dominantColor);
  set_(false);
};

export const botAINormal = (
  _: cardPlayingLogic,
  player: number,
  playerHand: cardInterface[],
  __: drawCardInterface
): any => {
  let wasCardPlayed = false;
  let shuffledPlayerHand = arrayShuffle(playerHand);
  for (let i of shuffledPlayerHand) {
    if (_(i, player, true)) {
      _(i, player, false);
      wasCardPlayed = true;
      break;
    }
  }
  let opposingPlayer = player === 1 ? 2 : 1;
  if (!wasCardPlayed) {
    __(opposingPlayer);
  }
};
