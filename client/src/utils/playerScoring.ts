import cardTypes from "../cards/types";

interface lastCardPlayedInterface {
  type: string;
  number: number;
  color: string;
}
interface setRatingInterface {
  (previousRating: any): any;
}
export const playerScoring = (
  player: number,
  lastCardPlayed: lastCardPlayedInterface,
  _1: setRatingInterface,
  _2: setRatingInterface
) => {
  const setCurrentPlayerScore: setRatingInterface = player === 1 ? _1 : _2;
  const setOpposingPlayerScore: setRatingInterface = player === 2 ? _1 : _2;
  switch (lastCardPlayed.type) {
    case cardTypes.WILD:
      setCurrentPlayerScore((prevState: any) => prevState + 50);
      break;
    case cardTypes.WILD_FOUR:
      setOpposingPlayerScore((prevState: any) => prevState + 50);
      break;
    case cardTypes.SPECIAL:
      setOpposingPlayerScore((prevState: any) => prevState + 20);
      break;
    default:
      setCurrentPlayerScore(
        (prevState: any) => prevState + lastCardPlayed.number
      );
      break;
  }
};
