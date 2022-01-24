const socketUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/game"
    : "https://online-uno-server.herokuapp.com/";
export default socketUrl;
