import React, { useState, useMemo } from "react";
import { UserContext } from "./UserContext";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
