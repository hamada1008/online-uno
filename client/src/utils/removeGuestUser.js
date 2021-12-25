import axios from "axios";
import url from "../data/backendUrl";

const removeGuestUser = async () => {
  console.log("cleared");
  const guestUserToken = localStorage.getItem("authToken");
  try {
    axios.delete(url("guestLogout"), {
      headers: { Authorization: `Bearer ${guestUserToken}` },
    });
    localStorage.clear();
  } catch (err) {
    localStorage.clear();
  }
};

export default removeGuestUser;
