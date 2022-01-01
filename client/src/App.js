import { useEffect } from "react";
import AuthForm from "./components/authForm/AuthForm";
import PlayerDashboard from "./components/playerDashboard/PlayerDashboard";
import UserContextProvider from "./context/UserContextProvider";
import removeGuestUser from "./utils/removeGuestUser";
import "bootstrap/dist/css/bootstrap.min.css";
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
      </UserContextProvider>
    </>
  );
}

export default App;
