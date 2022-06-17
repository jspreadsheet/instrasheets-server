import React from "react";

import { AuthProvider } from "./contexts/Auth";

import Routes from "./Routes";

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
