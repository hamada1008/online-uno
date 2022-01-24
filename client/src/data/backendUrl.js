const backendUrl = (type, id) => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api/"
      : "https://online-uno-server.herokuapp.com/api/";

  switch (type) {
    case "rating":
      return baseUrl + "users/" + id + "/rating";
    default:
      return `${baseUrl}${type ? type : ""}`;
  }
};
export default backendUrl;
