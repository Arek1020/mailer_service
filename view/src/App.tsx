// Importowanie niezbędnych modułów z React i react-router-dom
import React from "react";
import { Routes, Route } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import LoginScreen from "./screens/LoginScreen";
import Missing from "./screens/Missing";
import { RequireAuth } from "react-auth-kit";
import RegisterScreen from "./screens/RegisterScreen";
import ComposeEmail from "./screens/ComposeEmail";
import DecryptEmail from "./screens/DecryptEmail";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginScreen />} />
      <Route path="register" element={<RegisterScreen />} />

      <Route path="/">
        {/* protected */}
        <Route
          path="/"
          element={
            <RequireAuth loginPath={"/login"}>
              <ComposeEmail />
            </RequireAuth>
          }
        />
        <Route
          path="/decrypt/:messageId"
          element={
            <RequireAuth loginPath={"/login"}>
              <DecryptEmail />
            </RequireAuth>
          }
        />
      </Route>

      <Route path="*" element={<Missing />} />
    </Routes>
  );
};

export default App;
