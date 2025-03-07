import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import authService from "../../services/authService";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérification de l'authentification au chargement
    const checkAuth = () => {
      const user = authService.getCurrentUser();
      if (user) {
        setIsLoggedIn(true);
        setIsAdmin(user.role === "admin");
        setUsername(user.username);
        setPoints(user.points || 0);
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUsername("");
        setPoints(0);
      }
    };

    checkAuth();

    // Ajouter un écouteur d'événement pour les changements d'authentification
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUsername("");
    setPoints(0);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Pronostics Sportifs</Link>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Accueil</Link>
          </li>
          <li>
            <Link to="/past-matches">Matchs passés</Link>
          </li>
          <li>
            <Link to="/leaderboard">Classement</Link>
          </li>
          <li>
            <Link to="/statistics">Statistiques</Link>
          </li>

          {isAdmin && (
            <li className="dropdown admin-dropdown">
              <button className="dropdown-toggle admin-toggle">
                Administration <span className="arrow">▼</span>
              </button>
              <div className="dropdown-menu">
                <Link to="/admin/matches">Gérer les matchs</Link>
                <Link to="/admin/pronostics">Valider les pronostics</Link>
              </div>
            </li>
          )}

          {isLoggedIn ? (
            <>
              <li className="user-points">
                <span>🏆 {points} points</span>
              </li>
              <li className="dropdown">
                <button className="dropdown-toggle">
                  👤 {username} <span className="arrow">▼</span>
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile">Mon Profil</Link>
                  <Link to="/my-predictions">Mes Pronostics</Link>
                  <Link to="/settings">Paramètres</Link>
                  <button onClick={handleLogout} className="logout-btn">
                    Déconnexion
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="login-btn">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/register" className="register-btn">
                  Inscription
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
