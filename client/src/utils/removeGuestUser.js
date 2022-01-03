import axios from "axios";
import url from "../data/backendUrl";

const removeGuestUser = async () => {
  const isGuest = localStorage.getItem("isGuest");
  const guestUserToken = localStorage.getItem("authToken");
  if (!isGuest || isGuest === "No") return;
  localStorage.clear();
  try {
    await axios.delete(url("guest-logout"), {
      headers: { Authorization: `Bearer ${guestUserToken}` },
    });
  } catch (err) {}
};

export default removeGuestUser;
