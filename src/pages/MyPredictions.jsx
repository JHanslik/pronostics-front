import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import predictionService from "../services/predictionService";
import authService from "../services/authService";

function MyPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all, pending, completed

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = authService.getCurrentUser();
    if (!user) {
      setError("Vous devez être connecté pour voir vos pronostics");
      setLoading(false);
      return;
    }

    // Charger les pronostics de l'utilisateur
    const fetchPredictions = async () => {
      try {
        const data = await predictionService.getUserPredictions();
        setPredictions(data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des pronostics");
        setLoading(false);
        console.error(err);
      }
    };

    fetchPredictions();
  }, []);

  // Filtrer les pronostics selon l'onglet actif
  const filteredPredictions = predictions.filter((pred) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return pred.status === "pending";
    if (activeTab === "completed") return pred.status !== "pending";
    return true;
  });

  // Fonction pour afficher le résultat d'un pronostic
  const renderPredictionResult = (prediction) => {
    if (prediction.status === "pending") {
      return <span className="status pending">En attente</span>;
    } else if (prediction.status === "won") {
      return (
        <span className="status won">
          Gagné (+{prediction.pointsWon} points)
        </span>
      );
    } else {
      return <span className="status lost">Perdu</span>;
    }
  };

  // Fonction pour formater la prédiction
  const formatPrediction = (prediction, match) => {
    if (prediction.prediction === "home") {
      return `Victoire ${match.homeTeam}`;
    } else if (prediction.prediction === "away") {
      return `Victoire ${match.awayTeam}`;
    } else {
      return "Match nul";
    }
  };

  if (loading) return <div>Chargement de vos pronostics...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="my-predictions-page">
      <h1>Mes Pronostics</h1>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Tous
        </button>
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          En attente
        </button>
        <button
          className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Terminés
        </button>
      </div>

      {filteredPredictions.length === 0 ? (
        <div className="no-predictions">
          <p>Vous n'avez pas encore fait de pronostic.</p>
          <Link to="/" className="action-btn">
            Voir les matchs disponibles
          </Link>
        </div>
      ) : (
        <div className="predictions-list">
          {filteredPredictions.map((prediction) => (
            <div
              key={prediction._id}
              className={`prediction-card ${prediction.status}`}
            >
              <div className="match-info">
                <h3>
                  {prediction.match.homeTeam} vs {prediction.match.awayTeam}
                </h3>
                <p className="match-date">
                  <span className="match-day">
                    {new Date(
                      prediction.match.startTime || prediction.match.date
                    ).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="match-time">
                    {new Date(
                      prediction.match.startTime || prediction.match.date
                    ).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              </div>

              <div className="prediction-details">
                <p>
                  <strong>Votre pronostic:</strong>{" "}
                  {formatPrediction(prediction, prediction.match)}
                </p>
                <p>
                  <strong>Points misés:</strong> {prediction.pointsBet}
                </p>
                {renderPredictionResult(prediction)}
              </div>

              <Link
                to={`/match/${prediction.match._id}`}
                className="match-link"
              >
                Détails du match
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPredictions;
