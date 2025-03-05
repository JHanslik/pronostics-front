import { useState, useEffect } from "react";
import predictionService from "../services/predictionService";
import "./AIPrediction.css";

function AIPrediction({ matchId }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        const data = await predictionService.getAIPrediction(matchId);

        if (data && data.success) {
          setPrediction(data);
        } else {
          setError(
            data?.message || "Erreur lors du chargement de la prédiction"
          );
        }

        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement de la prédiction");
        setLoading(false);
        console.error(err);
      }
    };

    fetchPrediction();
  }, [matchId]);

  if (loading)
    return <div className="ai-prediction loading">Analyse en cours...</div>;
  if (error) return <div className="ai-prediction error">{error}</div>;
  if (!prediction) return null;

  const {
    homeWinProbability,
    drawProbability,
    awayWinProbability,
    predictedScore,
    mostLikelyResult,
    confidence,
  } = prediction.prediction;
  const { homeTeam, awayTeam } = prediction.match;
  const { dataQuality } = prediction;

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Formater le pourcentage
  const formatPercentage = (value) => {
    if (value === undefined || value === null) return "0.0%";
    return (value * 100).toFixed(1) + "%";
  };

  // Formater la largeur pour le CSS
  const formatWidth = (value) => {
    if (value === undefined || value === null) return "0%";
    // Minimum 5% pour la visibilité
    return Math.max(5, value * 100) + "%";
  };

  // Obtenir la classe CSS en fonction de la probabilité
  const getProbabilityClass = (value) => {
    if (!value) return "low-probability";
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

  // Obtenir la classe CSS en fonction de la qualité des données
  const getDataQualityClass = (quality) => {
    switch (quality) {
      case "high":
        return "high-quality";
      case "medium":
        return "medium-quality";
      case "low":
        return "low-quality";
      default:
        return "";
    }
  };

  // Obtenir le texte en fonction de la qualité des données
  const getDataQualityText = (quality) => {
    switch (quality) {
      case "high":
        return "Haute";
      case "medium":
        return "Moyenne";
      case "low":
        return "Faible";
      default:
        return "Inconnue";
    }
  };

  return (
    <div className="ai-prediction">
      <div className="prediction-header">
        <h3>Prédiction IA</h3>
        <div className={`data-quality ${getDataQualityClass(dataQuality)}`}>
          Fiabilité: {getDataQualityText(dataQuality)}
        </div>
      </div>

      <div className="prediction-content">
        <div className="teams">
          <div className="team home-team">{homeTeam}</div>
          <div className="vs">VS</div>
          <div className="team away-team">{awayTeam}</div>
        </div>

        <div className="probabilities">
          <div className="probability-bar">
            <div
              className={`probability home ${getProbabilityClass(
                homeWinProbability
              )}`}
              style={{ width: formatWidth(homeWinProbability) }}
            >
              {formatPercentage(homeWinProbability)}
            </div>
            <div
              className={`probability draw ${getProbabilityClass(
                drawProbability
              )}`}
              style={{ width: formatWidth(drawProbability) }}
            >
              {formatPercentage(drawProbability)}
            </div>
            <div
              className={`probability away ${getProbabilityClass(
                awayWinProbability
              )}`}
              style={{ width: formatWidth(awayWinProbability) }}
            >
              {formatPercentage(awayWinProbability)}
            </div>
          </div>
          <div className="probability-labels">
            <div className="label">Victoire {homeTeam}</div>
            <div className="label">Match nul</div>
            <div className="label">Victoire {awayTeam}</div>
          </div>
        </div>

        <div className="prediction-result">
          <div className="result-label">Résultat prédit:</div>
          <div className={`result ${getResultClass(mostLikelyResult)}`}>
            {mostLikelyResult === "home"
              ? `Victoire ${homeTeam}`
              : mostLikelyResult === "away"
              ? `Victoire ${awayTeam}`
              : "Match nul"}
          </div>
          <div className="predicted-score">
            Score prédit: {predictedScore.home} - {predictedScore.away}
          </div>
        </div>

        <button
          className="details-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Masquer les détails" : "Afficher les détails"}
        </button>

        {showDetails && (
          <div className="prediction-details">
            <div className="details-section">
              <h4>Statistiques {homeTeam}</h4>
              {prediction.stats && prediction.stats.home ? (
                <>
                  <div className="stat-item">
                    <span className="stat-label">Taux de victoire:</span>
                    <span className="stat-value">
                      {formatPercentage(prediction.stats.home.winRate)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Buts marqués (moy.):</span>
                    <span className="stat-value">
                      {prediction.stats.home.avgGoalsScored !== undefined
                        ? prediction.stats.home.avgGoalsScored.toFixed(1)
                        : "0.0"}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Buts concédés (moy.):</span>
                    <span className="stat-value">
                      {prediction.stats.home.avgGoalsConceded !== undefined
                        ? prediction.stats.home.avgGoalsConceded.toFixed(1)
                        : "0.0"}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Matchs analysés:</span>
                    <span className="stat-value">
                      {prediction.stats.home.matchesPlayed || 0}
                    </span>
                  </div>
                </>
              ) : (
                <div className="no-data">Aucune donnée disponible</div>
              )}
            </div>

            <div className="details-section">
              <h4>Statistiques {awayTeam}</h4>
              {prediction.stats && prediction.stats.away ? (
                <>
                  <div className="stat-item">
                    <span className="stat-label">Taux de victoire:</span>
                    <span className="stat-value">
                      {formatPercentage(prediction.stats.away.winRate)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Buts marqués (moy.):</span>
                    <span className="stat-value">
                      {prediction.stats.away.avgGoalsScored !== undefined
                        ? prediction.stats.away.avgGoalsScored.toFixed(1)
                        : "0.0"}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Buts concédés (moy.):</span>
                    <span className="stat-value">
                      {prediction.stats.away.avgGoalsConceded !== undefined
                        ? prediction.stats.away.avgGoalsConceded.toFixed(1)
                        : "0.0"}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Matchs analysés:</span>
                    <span className="stat-value">
                      {prediction.stats.away.matchesPlayed || 0}
                    </span>
                  </div>
                </>
              ) : (
                <div className="no-data">Aucune donnée disponible</div>
              )}
            </div>

            <div className="details-section">
              <h4>Face à face</h4>
              {prediction.stats && prediction.stats.h2h ? (
                <>
                  <div className="stat-item">
                    <span className="stat-label">Victoires {homeTeam}:</span>
                    <span className="stat-value">
                      {prediction.stats.h2h.homeWins || 0}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Victoires {awayTeam}:</span>
                    <span className="stat-value">
                      {prediction.stats.h2h.awayWins || 0}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Matchs nuls:</span>
                    <span className="stat-value">
                      {prediction.stats.h2h.draws || 0}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total confrontations:</span>
                    <span className="stat-value">
                      {prediction.stats.h2h.matchesPlayed || 0}
                    </span>
                  </div>
                </>
              ) : (
                <div className="no-data">
                  Aucune confrontation directe disponible
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIPrediction;
