import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Fonction temporaire pour simuler la déconnexion
  const handleLogout = () => {
    setIsLoggedIn(false);
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
            <Link to="/leaderboard">Classement</Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/profile">Mon Profil</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Déconnexion</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Connexion</Link>
              </li>
              <li>
                <Link to="/register">Inscription</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
