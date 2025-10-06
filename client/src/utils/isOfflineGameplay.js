const isOfflineGameplay = () => {
  const offline = localStorage.getItem("isOffline");
  return offline === "Yes";
};

export default isOfflineGameplay;
