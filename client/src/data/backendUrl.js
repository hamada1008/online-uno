const backendUrl = (type, id) => {
  const baseUrl = "http://localhost:5000/api/";
  switch (type) {
    case "login":
      return baseUrl + "login";
    case "register":
      return baseUrl + "register";
    case "rating":
      return baseUrl + "users/" + id + "/rating";
    case "guest":
      return baseUrl + "guest";
    case "guestLogout":
      return baseUrl + "guest-logout";
    default:
      return baseUrl;
  }
};
export default backendUrl;
