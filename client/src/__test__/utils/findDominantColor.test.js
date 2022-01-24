import { findDominantColor } from "../../utils/botAI.ts";
describe("Should Test The function to find a dominant color in a player hand", () => {
  let mockHand = [
    { color: "blue", number: 0, type: "NORMAL" },
    { color: "blue", number: 10, type: "SPECIAL" },
    { color: "green", number: 5, type: "NORMAL" },
    { color: "yellow", number: 11, type: "SPECIAL" },
    { color: null, number: null, type: "WILD" },
  ];
  let mockHandOfWild = [
    { color: null, number: null, type: "WILD_FOUR" },
    { color: null, number: null, type: "WILD" },
    { color: null, number: null, type: "WILD_FOUR" },
    { color: null, number: null, type: "WILD" },
  ];
  test("Should find the color BLUE from a normal player hand", () => {
    expect(findDominantColor(mockHand)).not.toBeFalsy();
    expect(findDominantColor(mockHand)).toMatch(/red|blue|green|yellow/);
    expect(findDominantColor(mockHand)).toEqual("blue");
    expect(findDominantColor(mockHand)).not.toEqual(/red|green|yellow/);
  });
  test("Should find the color BLUE from a player hand full of wil cards", () => {
    expect(findDominantColor(mockHandOfWild)).not.toBeFalsy();
    //default color is red
    expect(findDominantColor(mockHandOfWild)).toBe("red");
  });
});
