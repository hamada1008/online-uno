import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/Contexts";
const RequireAuth = ({ children }) => {
  const { user } = useContext(UserContext);
  if (user === undefined) return <Navigate to="/auth" replace />;
  return children;
};

export default RequireAuth;
