const backendUrl = (type, id) => {
  const baseUrl = "http://localhost:5000/api/";

  switch (type) {
    case "rating":
      return baseUrl + "users/" + id + "/rating";
    default:
      return `${baseUrl}${type ? type : ""}`;
  }
};
export default backendUrl;
