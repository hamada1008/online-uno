const backendUrl = (type, id) => {
  const baseUrl = "http://localhost:5000/api/";
  switch (type) {
    case "login":
      return baseUrl + "login";
    case "register":
      return baseUrl + "register";
    case "rating":
      return baseUrl + "users/" + id + "/rating";
    default:
      return baseUrl;
  }
};
export default backendUrl;
