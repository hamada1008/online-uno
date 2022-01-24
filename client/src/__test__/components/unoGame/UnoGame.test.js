import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import UnoGame from "../../../components/UnoGameComponents/UnoGame";
import UserContextProvider from "../../../context/UserContextProvider";

describe.only("sthg for now", () => {
  let discardPile;
  let drawPile;
  let player1Hand;
  let player2Hand;
  const updateHands = () => {
    discardPile = screen
      .getByTestId("discard-pile")
      .getElementsByTagName("img");
    drawPile = screen.getByTestId("draw-pile").getElementsByTagName("img");
    player1Hand = screen
      .getByTestId("player1-hand")
      .getElementsByTagName("img");
    player2Hand = screen
      .getByTestId("player2-hand")
      .getElementsByTagName("img");
  };
  beforeEach(() => {
    render(
      <UserContextProvider>
        <UnoGame
          gameType="multiplayer"
          currentPlayer={{ id: 0, currentPlayerNumber: 1 }}
          socket={null}
        />
      </UserContextProvider>
    );
    updateHands();
  });
  test("Initial Game State", async () => {
    expect(discardPile).toHaveLength(1);
    expect(drawPile.length).toBeGreaterThanOrEqual(4);
    expect(player1Hand).toHaveLength(7);
    expect(player2Hand).toHaveLength(7);

    const player2UI = screen.getByTestId("player2-ui");
    expect(
      await within(player2UI).findByRole("button", {
        name: /uno/i,
      })
    ).toBeDisabled();
    expect(
      await within(player2UI).findByRole("button", {
        name: /draw/i,
      })
    ).toBeDisabled();
  });
  test("Player One Draws a Card, and attempts to draw a second", () => {
    const player1UI = screen.getByTestId("player1-ui");
    const player1Draw = within(player1UI).getByRole("button", {
      name: /draw/i,
    });
    player1Draw.click();
    updateHands();
    expect(discardPile).toHaveLength(1);
    expect(player1Hand).toHaveLength(8);
    expect(player2Hand).toHaveLength(7);
    //cannot draw 2
    player1Draw.click();
    updateHands();
    expect(discardPile).toHaveLength(1);
    expect(player1Hand).toHaveLength(8);
    expect(player2Hand).toHaveLength(7);
  });
});
