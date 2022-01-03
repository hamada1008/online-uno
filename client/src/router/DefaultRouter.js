import React, {
  useEffect,
  useLayoutEffect,
  useCallback,
  useContext,
} from "react";
import { UserContext } from "../context/Contexts";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AuthForm from "../components/authForm/AuthForm";
import PlayerDashboard from "../components/playerDashboard/PlayerDashboard";
import NotFound from "../components/notFound/NotFound";
import UnoGame from "../components/unoGame/UnoGame";
import RequireAuth from "./RequireAuth";
import url from "../data/backendUrl";
import axios from "axios";

const DefaultRouter = () => {
  const { user, setUser } = useContext(UserContext);
  const token = localStorage.getItem("authToken");

  const authorizeToken = useCallback(async () => {
    if (!token) {
      localStorage.clear();
      setUser(undefined);
      return;
    }
    if ((user && !user?.isLoggedIn) || user === undefined) return;
    try {
      let response = await axios.get(url(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.msg);
    } catch (err) {
      if (user === undefined) return;
      console.log(err?.response?.data?.msg);
      setUser(undefined);
    }
  }, [token, user]);

  useLayoutEffect(() => {
    authorizeToken();
  }, [authorizeToken]);
  useEffect(() => {
    console.log(user);
  });
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <PlayerDashboard />
            </RequireAuth>
          }
        />
        <Route
          exact
          path="/game/single"
          element={
            user ? (
              <RequireAuth>
                <UnoGame
                  gameType="single"
                  currentPlayer={{ id: 0, currentPlayerNumber: 1 }}
                />
              </RequireAuth>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          exact
          path="/auth"
          element={
            user ? (
              <Navigate to="/" />
            ) : user === undefined ? (
              <AuthForm />
            ) : null
          }
          // element={user ? <Navigate to="/" /> : <AuthForm />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default DefaultRouter;
