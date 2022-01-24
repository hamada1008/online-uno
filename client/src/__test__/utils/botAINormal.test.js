import { botAINormal } from "../../utils/botAI.ts";
import "@testing-library/jest-dom";
describe("Should Test basic AI for playing a card", () => {
  const mockDrawingCardHandler = jest.fn((number) => {});
  test("shouldnt  play a normal card if player hand is empty", () => {
    let mockCardPlayingLogic = jest.fn((object, number, boolean) => false);
    botAINormal(mockCardPlayingLogic, 1, [], mockDrawingCardHandler);
    expect(mockCardPlayingLogic).not.toBeCalled();
    expect(mockDrawingCardHandler).toBeCalledTimes(1);
  });
  test("should  play a normal card if player", () => {
    let mockCardPlayingLogic = jest.fn((object, number, boolean) => true);
    botAINormal(
      mockCardPlayingLogic,
      1,
      [{ type: "NORMAL", color: "red", number: 5 }],
      mockDrawingCardHandler
    );
    expect(mockCardPlayingLogic).toBeCalledTimes(2);
    expect(mockDrawingCardHandler).not.toBeCalled();
  });
});
