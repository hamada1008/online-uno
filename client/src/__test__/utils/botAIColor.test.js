import { botAIColor } from "../../utils/botAI.ts";
import "@testing-library/jest-dom";
describe("Should Test the AI color changing handling", () => {
  test("should set a color", () => {
    const mockSetColor = jest.fn((string) => {});
    const mockSetPrompt = jest.fn((boolean) => {});
    botAIColor([], mockSetColor, mockSetPrompt);
    expect(mockSetColor).toBeCalledTimes(1);
    expect(mockSetPrompt).toBeCalledTimes(1);
  });
});
