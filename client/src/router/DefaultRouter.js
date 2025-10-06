import { useLayoutEffect, useEffect, useCallback, useContext } from "react";
import { UserContext } from "../context/Contexts";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "../components/HomePage/HomePage";
import PlayerDashboard from "../components/PlayerDashboard/PlayerDashboard";
import NotFound from "../components/NotFound/NotFound";
import PlayerGameChoice from "../components/PlayerDashboard/PlayerGameChoice";
import UnoGame from "../components/UnoGameComponents/UnoGame";
import RequireAuth from "./RequireAuth";
import url from "../data/backendUrl";
import srcArr from "../utils/imageSourceArray.js";
import axios from "axios";
import isOfflineGameplay from "../utils/isOfflineGameplay";

const DefaultRouter = () => {
  const { user, setUser } = useContext(UserContext);
  const token = localStorage.getItem("authToken");
  const isOffline = isOfflineGameplay();

  const authorizeToken = useCallback(async () => {
    if (!token) {
      localStorage.clear();
      setUser(undefined);
      return;
    }
    if ((user && !user?.isLogging) || user === undefined) return;
    try {
      if (isOffline) {
        setUser({
          _id: Math.random(),
          username: "Offline Mode",
        });
        return;
      }
      let response = await axios.get(url(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.msg);
    } catch (err) {
      if (user === undefined) return;
      console.log(err?.response?.data?.msg);
      setUser(undefined);
    }
  }, [token, user, isOffline]);

  useLayoutEffect(() => {
    authorizeToken();
  }, [authorizeToken]);

  //Game Assets loader function

  const casheImages = async (srcArr) => {
    const loadingImagePromises = await srcArr.map((src) => {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = src;
        img.onload = resolve();
        img.onerror = reject();
      });
    });
    await Promise.all(loadingImagePromises);
  };

  //Executing the Assets loader
  useEffect(() => {
    casheImages(srcArr);
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<PlayerGameChoice />} />
          <Route
            exact
            path="/game/single"
            element={
              user ? (
                <UnoGame
                  gameType="single"
                  currentPlayer={{ id: 0, currentPlayerNumber: 1 }}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            exact
            path="game/multiplayer/"
            element={user ? <PlayerDashboard /> : <Navigate to="/" replace />}
          />
        </Route>
        <Route
          exact
          path="/auth"
          element={
            user ? (
              <Navigate to="/" />
            ) : user === undefined ? (
              <HomePage />
            ) : null
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default DefaultRouter;
