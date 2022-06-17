import React, { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState("");

  const memo = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token, setToken]
  );

  return <AuthContext.Provider value={memo}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
