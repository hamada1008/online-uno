import colors from "./colors.ts";
import numbers from "./number.ts";
import types from "./types.ts";

let deck = [];
const createCards = () => {
  //76 normal card (0-9 /4 colors / 2 each color)
  // 24 special cards (SKIP REVERSE +2 / 2 each color)
  // 8 WILD cards (4 x Wild / 4x Wild+4)

  deck.push({ type: types.NORMAL, number: 0, color: colors.RED });
  for (let i = 1; i < 10; i++) {
    deck.push({ type: types.NORMAL, number: i, color: colors.RED });
    deck.push({ type: types.NORMAL, number: i, color: colors.RED });
  }
  deck.push({ type: types.NORMAL, number: 0, color: colors.BLUE });
  for (let i = 1; i < 10; i++) {
    deck.push({ type: types.NORMAL, number: i, color: colors.BLUE });
    deck.push({ type: types.NORMAL, number: i, color: colors.BLUE });
  }
  deck.push({ type: types.NORMAL, number: 0, color: colors.GREEN });
  for (let i = 1; i < 10; i++) {
    deck.push({ type: types.NORMAL, number: i, color: colors.GREEN });
    deck.push({ type: types.NORMAL, number: i, color: colors.GREEN });
  }
  deck.push({ type: types.NORMAL, number: 0, color: colors.YELLOW });
  for (let i = 1; i < 10; i++) {
    deck.push({ type: types.NORMAL, number: i, color: colors.YELLOW });
    deck.push({ type: types.NORMAL, number: i, color: colors.YELLOW });
  }

  for (let i = 0; i < 6; i++) {
    switch (i % 3) {
      case 0:
        deck.push({
          type: types.SPECIAL,
          number: numbers.DRAW_TWO,
          color: colors.RED,
        });
        deck.push({
          type: types.SPECIAL,
          number: numbers.DRAW_TWO,
          color: colors.BLUE,
        });
        deck.push({
          type: types.SPECIAL,
          number: numbers.DRAW_TWO,
          color: colors.GREEN,
        });
        deck.push({
          type: types.SPECIAL,
          number: numbers.DRAW_TWO,
          color: colors.YELLOW,
        });
        break;
      case 1:
        deck.push({
          type: types.SPECIAL,
          number: numbers.REVERSE,
          color: colors.RED,
        });
        deck.push({
          type: types.SPECIAL,
          number: numbers.REVERSE,
          color: colors.BLUE,
        });
        deck.push({
          type: types.SPECIAL,
          number: numbers.REVERSE,
          color: colors.GREEN,
        });
        deck.push({
          type: types.SPECIAL,
          number: numbers.REVERSE,
          color: colors.YELLOW,
        });
        break;
      case 2:
        deck.push({
          type: types.SPECIAL,
          number: numbers.SKIP,
          color: colors.RED,
        });
        deck.push({
          type: types.SPECIAL,
          number: numbers.SKIP,
          color: colors.BLUE,
        });
        deck.push({
          type: types.SPECIAL,
          number: numbers.SKIP,
          color: colors.GREEN,
        });
        deck.push({
          type: types.SPECIAL,
          number: numbers.SKIP,
          color: colors.YELLOW,
        });
        break;
      default:
        break;
    }
  }
  for (let i = 0; i < 4; i++) {
    deck.push({ type: types.WILD, number: null, color: null });
    deck.push({ type: types.WILD_FOUR, number: null, color: null });
  }
};
createCards();

export default deck;
