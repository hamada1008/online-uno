import React from "react";
import AuthForm from "./components/authForm/AuthForm";
import PlayerDashboard from "./components/playerDashboard/PlayerDashboard";
import UserContextProvider from "./context/UserContextProvider";
function App() {
  return (
    <>
      {/* <AuthForm /> */}
      <UserContextProvider>
        <PlayerDashboard />
      </UserContextProvider>
    </>
  );
}

export default App;
