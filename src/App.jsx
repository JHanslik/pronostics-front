import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MatchDetail from "./pages/MatchDetail";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import MyPredictions from "./pages/MyPredictions";
import AdminPronostics from "./pages/AdminPronostics";
import AdminMatches from "./pages/AdminMatches";
import NotFound from "./pages/NotFound";
import authService from "./services/authService";
import "./App.css";
import PastMatches from "./pages/PastMatches";

function App() {
  useEffect(() => {
    // Configurer l'intercepteur de token au chargement de l'application
    authService.setupTokenInterceptor();

    // Actualiser les informations utilisateur au chargement
    const refreshUserInfo = async () => {
      if (authService.isAuthenticated()) {
        try {
          await authService.updateUserInfo();
        } catch (error) {
          console.error(
            "Erreur lors de l'actualisation des informations utilisateur:",
            error
          );
        }
      }
    };

    refreshUserInfo();

    // Actualiser les informations utilisateur toutes les 5 minutes
    const refreshInterval = setInterval(refreshUserInfo, 5 * 60 * 1000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/match/:id" element={<MatchDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/my-predictions" element={<MyPredictions />} />
            <Route path="/past-matches" element={<PastMatches />} />
            <Route path="/admin/pronostics" element={<AdminPronostics />} />
            <Route path="/admin/matches" element={<AdminMatches />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
