import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    // Vérification de l'authentification
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Récupération des données utilisateur
    const fetchUserData = async () => {
      try {
        // À remplacer par un appel API réel
        // const userData = await userService.getUserProfile();
        setUser(currentUser);

        // Récupération des pronostics de l'utilisateur
        // const userPredictions = await predictionService.getUserPredictions();
        setPredictions([]);

        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement du profil");
        setLoading(false);
        console.error(err);
      }
    };

    fetchUserData();
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
              {user.rank && (
                <span className="user-rank">Rang #{user.rank}</span>
              )}
            </div>

            <div className="user-details">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Points disponibles:</strong> {user.points || 0}
              </p>
              {user.joinDate && (
                <p>
                  <strong>Membre depuis:</strong>{" "}
                  {new Date(user.joinDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
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
                  key={pred._id}
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
                      {pred.match.homeTeam} vs {pred.match.awayTeam}
                    </span>
                    <span className="prediction-date">
                      {new Date(
                        pred.match.startTime || pred.match.date
                      ).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="prediction-details">
                    <p>
                      <strong>Pronostic:</strong>{" "}
                      {pred.prediction === "home"
                        ? `Victoire ${pred.match.homeTeam}`
                        : pred.prediction === "away"
                        ? `Victoire ${pred.match.awayTeam}`
                        : "Match nul"}
                    </p>
                    <p>
                      <strong>Points misés:</strong> {pred.points}
                    </p>
                    <p>
                      <strong>Gain potentiel:</strong> {pred.points * 2}
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
