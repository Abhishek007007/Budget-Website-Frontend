import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
