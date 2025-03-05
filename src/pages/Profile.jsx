import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    // Vérification de l'authentification
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Simulation de chargement des données utilisateur depuis l'API
    // À remplacer par un appel API réel
    setTimeout(() => {
      setUser({
        username: "utilisateur_test",
        email: "test@example.com",
        points: 250,
        joinDate: "2025-01-15T10:30:00",
        rank: 12,
      });

      setPredictions([
        {
          id: 1,
          matchId: 1,
          homeTeam: "PSG",
          awayTeam: "Marseille",
          date: "2025-03-15T20:00:00",
          prediction: "home",
          points: 50,
          status: "pending",
          potentialWin: 100,
        },
        {
          id: 2,
          matchId: 2,
          homeTeam: "Lyon",
          awayTeam: "Monaco",
          date: "2025-03-10T15:00:00",
          prediction: "away",
          points: 30,
          status: "won",
          potentialWin: 60,
          pointsWon: 60,
        },
        {
          id: 3,
          matchId: 3,
          homeTeam: "Lille",
          awayTeam: "Lens",
          date: "2025-03-05T17:00:00",
          prediction: "draw",
          points: 20,
          status: "lost",
          potentialWin: 40,
          pointsWon: 0,
        },
      ]);

      setLoading(false);
    }, 1000);
  }, [navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) return <div>Chargement du profil...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!user) return null;

  return (
    <div className="profile-page">
      <h1>Mon Profil</h1>

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={() => handleTabChange("info")}
        >
          Informations
        </button>
        <button
          className={`tab-btn ${activeTab === "predictions" ? "active" : ""}`}
          onClick={() => handleTabChange("predictions")}
        >
          Mes Pronostics
        </button>
      </div>

      {activeTab === "info" && (
        <div className="profile-info">
          <div className="user-card">
            <div className="user-header">
              <h2>{user.username}</h2>
              <span className="user-rank">Rang #{user.rank}</span>
            </div>

            <div className="user-details">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Points disponibles:</strong> {user.points}
              </p>
              <p>
                <strong>Membre depuis:</strong>{" "}
                {new Date(user.joinDate).toLocaleDateString("fr-FR")}
              </p>
            </div>

            <button className="edit-profile-btn">Modifier mon profil</button>
          </div>
        </div>
      )}

      {activeTab === "predictions" && (
        <div className="profile-predictions">
          <h2>Historique des pronostics</h2>

          {predictions.length === 0 ? (
            <p>Vous n'avez pas encore fait de pronostic.</p>
          ) : (
            <div className="predictions-list">
              {predictions.map((pred) => (
                <div
                  key={pred.id}
                  className={`prediction-card ${
                    pred.status === "won"
                      ? "won"
                      : pred.status === "lost"
                      ? "lost"
                      : ""
                  }`}
                >
                  <div className="prediction-match">
                    <span>
                      {pred.homeTeam} vs {pred.awayTeam}
                    </span>
                    <span className="prediction-date">
                      {new Date(pred.date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div className="prediction-details">
                    <p>
                      <strong>Pronostic:</strong>{" "}
                      {pred.prediction === "home"
                        ? `Victoire ${pred.homeTeam}`
                        : pred.prediction === "away"
                        ? `Victoire ${pred.awayTeam}`
                        : "Match nul"}
                    </p>
                    <p>
                      <strong>Points misés:</strong> {pred.points}
                    </p>
                    <p>
                      <strong>Gain potentiel:</strong> {pred.potentialWin}
                    </p>

                    {pred.status === "pending" && (
                      <span className="prediction-status pending">
                        En attente
                      </span>
                    )}
                    {pred.status === "won" && (
                      <span className="prediction-status won">
                        Gagné (+{pred.pointsWon} pts)
                      </span>
                    )}
                    {pred.status === "lost" && (
                      <span className="prediction-status lost">Perdu</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
