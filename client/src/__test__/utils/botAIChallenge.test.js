import { botAIChallenge } from "../../utils/botAI.ts";
import "@testing-library/jest-dom";
describe("Should Test the AI challenge handling", () => {
  test("should set a challenge result", () => {
    const mockSetChallengeState = jest.fn((string) => {});
    const mockSetColorPromptState = jest.fn((boolean) => {});
    botAIChallenge(mockSetChallengeState, mockSetColorPromptState);
    expect(mockSetChallengeState).toBeCalledTimes(1);
    expect(mockSetColorPromptState).toBeCalledTimes(1);
  });
});
