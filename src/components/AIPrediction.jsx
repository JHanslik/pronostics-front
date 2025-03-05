import { useState, useEffect } from "react";
import predictionService from "../services/predictionService";

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
        setPrediction(data);
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

  // Obtenir la classe CSS pour le résultat (V/N/D)
  const getResultClass = (result) => {
    switch (result) {
      case "V":
        return "win";
      case "N":
        return "draw";
      case "D":
        return "loss";
      default:
        return "";
    }
  };

  return (
    <div className="ai-prediction">
      <h3>Prédiction IA</h3>

      <div className="prediction-probabilities">
        <div className="probability-bar">
          <div
            className="home-win"
            style={{ width: `${homeWinProbability}%` }}
            title={`${homeTeam}: ${homeWinProbability}%`}
          >
            {homeWinProbability}%
          </div>
          <div
            className="draw"
            style={{ width: `${drawProbability}%` }}
            title={`Match nul: ${drawProbability}%`}
          >
            {drawProbability}%
          </div>
          <div
            className="away-win"
            style={{ width: `${awayWinProbability}%` }}
            title={`${awayTeam}: ${awayWinProbability}%`}
          >
            {awayWinProbability}%
          </div>
        </div>

        <div className="prediction-labels">
          <span>{homeTeam}</span>
          <span>Nul</span>
          <span>{awayTeam}</span>
        </div>
      </div>

      <div className="prediction-details">
        <p className="predicted-score">
          Score prédit:{" "}
          <strong>
            {predictedScore.home} - {predictedScore.away}
          </strong>
        </p>

        <p className="prediction-result">
          Résultat le plus probable:
          <strong>
            {mostLikelyResult === "home" && ` Victoire ${homeTeam}`}
            {mostLikelyResult === "away" && ` Victoire ${awayTeam}`}
            {mostLikelyResult === "draw" && " Match nul"}
          </strong>
          <span className="confidence"> (Confiance: {confidence}%)</span>
        </p>

        <div className="data-quality">
          <div className="quality-indicator" title="Qualité des données">
            <div className="quality-bar">
              <div
                className="quality-fill"
                style={{ width: `${dataQuality.confidence}%` }}
              ></div>
            </div>
            <span>Qualité des données: {dataQuality.confidence}%</span>
          </div>
        </div>
      </div>

      <button
        className="toggle-details-btn"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Masquer les détails" : "Afficher les détails"}
      </button>

      {showDetails && (
        <div className="prediction-stats">
          <div className="stats-section">
            <h4>Forme récente: {homeTeam}</h4>
            <div className="recent-matches">
              {prediction.stats.homeTeam.recentMatches.map((match, index) => (
                <div key={index} className="recent-match">
                  <span className="match-date">{formatDate(match.date)}</span>
                  <span className="match-teams">
                    {match.isHome ? homeTeam : match.opponent} vs{" "}
                    {match.isHome ? match.opponent : homeTeam}
                  </span>
                  <span className="match-score">{match.score}</span>
                  <span
                    className={`match-result ${getResultClass(match.result)}`}
                  >
                    {match.result}
                  </span>
                </div>
              ))}
              {prediction.stats.homeTeam.recentMatches.length === 0 && (
                <p className="no-data">Aucune donnée disponible</p>
              )}
            </div>
          </div>

          <div className="stats-section">
            <h4>Forme récente: {awayTeam}</h4>
            <div className="recent-matches">
              {prediction.stats.awayTeam.recentMatches.map((match, index) => (
                <div key={index} className="recent-match">
                  <span className="match-date">{formatDate(match.date)}</span>
                  <span className="match-teams">
                    {match.isHome ? awayTeam : match.opponent} vs{" "}
                    {match.isHome ? match.opponent : awayTeam}
                  </span>
                  <span className="match-score">{match.score}</span>
                  <span
                    className={`match-result ${getResultClass(match.result)}`}
                  >
                    {match.result}
                  </span>
                </div>
              ))}
              {prediction.stats.awayTeam.recentMatches.length === 0 && (
                <p className="no-data">Aucune donnée disponible</p>
              )}
            </div>
          </div>

          <div className="stats-section">
            <h4>Confrontations directes</h4>
            <div className="h2h-matches">
              {prediction.stats.headToHead.recentMatches.map((match, index) => (
                <div key={index} className="h2h-match">
                  <span className="match-date">{formatDate(match.date)}</span>
                  <span className="match-score">
                    <strong>{homeTeam}</strong> {match.homeTeamScore} -{" "}
                    {match.awayTeamScore} <strong>{awayTeam}</strong>
                  </span>
                  <span className={`match-result ${match.result}`}>
                    {match.result === "home"
                      ? `Victoire ${homeTeam}`
                      : match.result === "away"
                      ? `Victoire ${awayTeam}`
                      : "Match nul"}
                  </span>
                </div>
              ))}
              {prediction.stats.headToHead.recentMatches.length === 0 && (
                <p className="no-data">Aucune confrontation directe récente</p>
              )}
            </div>
          </div>

          <div className="stats-summary">
            <div className="team-stats">
              <h4>{homeTeam}</h4>
              <p>Matchs joués: {prediction.stats.homeTeam.played}</p>
              <p>
                Victoires: {prediction.stats.homeTeam.wins} (
                {Math.round(prediction.stats.homeTeam.winRate * 100)}%)
              </p>
              <p>
                Buts marqués/match:{" "}
                {prediction.stats.homeTeam.averageGoalsScored.toFixed(1)}
              </p>
              <p>
                Buts encaissés/match:{" "}
                {prediction.stats.homeTeam.averageGoalsConceded.toFixed(1)}
              </p>
            </div>

            <div className="team-stats">
              <h4>{awayTeam}</h4>
              <p>Matchs joués: {prediction.stats.awayTeam.played}</p>
              <p>
                Victoires: {prediction.stats.awayTeam.wins} (
                {Math.round(prediction.stats.awayTeam.winRate * 100)}%)
              </p>
              <p>
                Buts marqués/match:{" "}
                {prediction.stats.awayTeam.averageGoalsScored.toFixed(1)}
              </p>
              <p>
                Buts encaissés/match:{" "}
                {prediction.stats.awayTeam.averageGoalsConceded.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="prediction-disclaimer">
        <small>
          Cette prédiction est basée sur les performances passées des équipes et
          ne garantit pas le résultat final.
        </small>
      </div>
    </div>
  );
}

export default AIPrediction;
