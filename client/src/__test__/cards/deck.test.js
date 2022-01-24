import deck from "../../cards/deck";
describe("Deck Viability", () => {
  let mockDeck = deck;

  test("Deck should have 108 cards", () => {
    expect(mockDeck).toBeTruthy();
    expect(mockDeck).toHaveLength(108);
  });
  test("Deck should contain the 4 different types", () => {
    expect(mockDeck).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "WILD" }),
        expect.objectContaining({ type: "WILD_FOUR" }),
        expect.objectContaining({ type: "SPECIAL" }),
        expect.objectContaining({ type: "NORMAL" }),
      ])
    );
  });
  test("Deck shouldnt containt a different type", () => {
    expect(mockDeck).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: /^(?!(NORMAL|SPECIAL|WILD|WILD_FOUR)$).*$/g,
        }),
      ])
    );
  });
  test("Deck should contain a fixed number of cards with the same type", () => {
    expect(mockDeck.filter((el) => el.type === "WILD")).toHaveLength(4);
    expect(mockDeck.filter((el) => el.type === "WILD_FOUR")).toHaveLength(4);
    expect(mockDeck.filter((el) => el.type === "SPECIAL")).toHaveLength(24);
    expect(mockDeck.filter((el) => el.type === "NORMAL")).toHaveLength(76);
  });
  test("Deck should be shuffeled before being used", () => {
    expect(mockDeck).toBeTruthy();
    expect(mockDeck).not.toBe(require("../../cards/deck"));
  });
});
