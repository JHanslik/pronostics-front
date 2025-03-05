import { useState, useEffect } from "react";
import aiService from "../services/aiService";
import { useAuth } from "../contexts/AuthContext";
import "./AIAdvancedPrediction.css";

function AIAdvancedPrediction({ matchId }) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPredictions();
  }, [matchId]);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const response = await aiService.getMatchPredictions(matchId);
      if (response.success) {
        setPredictions(response.predictions);
      } else {
        setError("Erreur lors du chargement des prédictions");
      }
    } catch (err) {
      setError("Erreur lors du chargement des prédictions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPrediction = async () => {
    try {
      setGenerating(true);
      const response = await aiService.generatePrediction(matchId);
      if (response.success) {
        // Rafraîchir les prédictions
        fetchPredictions();
      } else {
        setError("Erreur lors de la génération de la prédiction");
      }
    } catch (err) {
      setError("Erreur lors de la génération de la prédiction");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  // Formater le pourcentage
  const formatPercentage = (value) => {
    return (value * 100).toFixed(1) + "%";
  };

  // Obtenir la classe CSS en fonction de la probabilité
  const getProbabilityClass = (value) => {
    if (value >= 0.6) return "high-probability";
    if (value >= 0.4) return "medium-probability";
    return "low-probability";
  };

  // Obtenir la classe CSS en fonction du résultat prédit
  const getResultClass = (result) => {
    switch (result) {
      case "home":
        return "home-win";
      case "away":
        return "away-win";
      case "draw":
        return "draw";
      default:
        return "";
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="ai-advanced-prediction loading">
        <h3>Analyse IA avancée</h3>
        <div className="loading-spinner">Chargement des prédictions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-advanced-prediction error">
        <h3>Analyse IA avancée</h3>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="ai-advanced-prediction">
      <div className="prediction-header">
        <h3>Analyse IA avancée</h3>
        {user && user.role === "admin" && (
          <button
            className="generate-button"
            onClick={generateNewPrediction}
            disabled={generating}
          >
            {generating ? "Génération..." : "Générer une nouvelle prédiction"}
          </button>
        )}
      </div>

      {predictions.length === 0 ? (
        <div className="no-predictions">
          Aucune prédiction IA disponible pour ce match.
        </div>
      ) : (
        <div className="predictions-list">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="prediction-card">
              <div className="prediction-model">
                <span className="model-name">
                  {prediction.model?.name || "Modèle IA"}
                </span>
                <span className="model-accuracy">
                  Précision:{" "}
                  {((prediction.model?.accuracy || 0) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="prediction-probabilities">
                <div className="probability-bar">
                  <div
                    className={`probability home ${getProbabilityClass(
                      prediction.homeTeamWinProbability
                    )}`}
                    style={{
                      width: formatPercentage(
                        prediction.homeTeamWinProbability
                      ),
                    }}
                  >
                    {formatPercentage(prediction.homeTeamWinProbability)}
                  </div>
                  <div
                    className={`probability draw ${getProbabilityClass(
                      prediction.drawProbability
                    )}`}
                    style={{
                      width: formatPercentage(prediction.drawProbability),
                    }}
                  >
                    {formatPercentage(prediction.drawProbability)}
                  </div>
                  <div
                    className={`probability away ${getProbabilityClass(
                      prediction.awayTeamWinProbability
                    )}`}
                    style={{
                      width: formatPercentage(
                        prediction.awayTeamWinProbability
                      ),
                    }}
                  >
                    {formatPercentage(prediction.awayTeamWinProbability)}
                  </div>
                </div>
              </div>

              <div className="prediction-result">
                <div className="result-label">Résultat prédit:</div>
                <div
                  className={`result ${getResultClass(
                    prediction.predictedResult
                  )}`}
                >
                  {prediction.predictedResult === "home"
                    ? "Victoire domicile"
                    : prediction.predictedResult === "away"
                    ? "Victoire extérieur"
                    : "Match nul"}
                </div>
                <div className="confidence">
                  Confiance: {formatPercentage(prediction.confidence)}
                </div>
              </div>

              {prediction.actualResult && (
                <div className="actual-result">
                  <div className="result-label">Résultat réel:</div>
                  <div
                    className={`result ${getResultClass(
                      prediction.actualResult
                    )} ${prediction.isCorrect ? "correct" : "incorrect"}`}
                  >
                    {prediction.actualResult === "home"
                      ? "Victoire domicile"
                      : prediction.actualResult === "away"
                      ? "Victoire extérieur"
                      : "Match nul"}
                  </div>
                  <div
                    className={`prediction-accuracy ${
                      prediction.isCorrect ? "correct" : "incorrect"
                    }`}
                  >
                    {prediction.isCorrect
                      ? "Prédiction correcte ✓"
                      : "Prédiction incorrecte ✗"}
                  </div>
                </div>
              )}

              <div className="prediction-timestamp">
                Générée le {formatDate(prediction.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AIAdvancedPrediction;
