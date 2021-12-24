import React, { useEffect } from "react";
import AuthForm from "./components/authForm/AuthForm";
import PlayerDashboard from "./components/playerDashboard/PlayerDashboard";
import UnoGame from "./components/unoGame/UnoGame";
import UserContextProvider from "./context/UserContextProvider";
import removeGuestUser from "./utils/removeGuestUser";

function App() {
  useEffect(() => {
    const isGuest = localStorage.getItem("isGuest");
    if (!isGuest || isGuest === "No") return;
    window.addEventListener("beforeunload", removeGuestUser);
  }, []);
  return (
    <>
      {/* <AuthForm /> */}
      <UserContextProvider>
        <PlayerDashboard />
        {/* <UnoGame /> */}
      </UserContextProvider>
    </>
  );
}

export default App;
