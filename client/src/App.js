import React from "react";
import AuthForm from "./components/authForm/AuthForm";
import PlayerDashboard from "./components/playerDashboard/PlayerDashboard";
import UnoGame from "./components/unoGame/UnoGame";
import UserContextProvider from "./context/UserContextProvider";
function App() {
  return (
    <>
      {/* <AuthForm /> */}
      <UserContextProvider>
        {/* <PlayerDashboard /> */}
        <UnoGame />
      </UserContextProvider>
    </>
  );
}

export default App;
