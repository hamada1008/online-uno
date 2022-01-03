import { useEffect } from "react";
import Routing from "./router/DefaultRouter";
import UserContextProvider from "./context/UserContextProvider";
import removeGuestUser from "./utils/removeGuestUser";

import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  useEffect(() => {
    window.addEventListener("beforeunload", removeGuestUser);
    return function cleanup() {
      window.removeEventListener("beforeunload", removeGuestUser);
    };
  }, []);

  return (
    <>
      <UserContextProvider>
        <Routing />
      </UserContextProvider>
    </>
  );
}

export default App;
