import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/Contexts";
const RequireAuth = () => {
  const { user } = useContext(UserContext);
  if (user === undefined) return <Navigate to="/auth" replace />;
  return <Outlet />;
};

export default RequireAuth;
