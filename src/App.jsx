import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import PrivateProtectedRoute from "./components/PrivateProtectedRoute";
import PublicProtectedRoute from "./components/PublicProtectedRoute";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import store from "./redux/store";

import { axiosInterceptor } from "./axiosInterceptors/axiosPrivate";

function App() {
  axiosInterceptor(store);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/registration"
          element={
            <PublicProtectedRoute>
              <RegistrationPage />
            </PublicProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicProtectedRoute>
              <LoginPage />
            </PublicProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateProtectedRoute>
              <Home />
            </PrivateProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
