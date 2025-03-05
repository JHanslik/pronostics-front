import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import matchService from "../services/matchService";
import predictionService from "../services/predictionService";

function AdminPronostics() {
  const [matches, setMatches] = useState([]);
  const [processedMatches, setProcessedMatches] = useState([]);
  const [activeTab, setActiveTab] = useState("to-process");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const checkAdmin = async () => {
      const user = authService.getCurrentUser();
      if (!user || user.role !== "admin") {
        navigate("/");
        return;
      }

      fetchData();
    };

    checkAdmin();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Charger les matchs terminés à traiter
      const matchesToProcess = await matchService.getFinishedMatchesToProcess();
      setMatches(matchesToProcess);

      // Charger les matchs déjà traités
      const processedMatchesData = await matchService.getProcessedMatches();
      setProcessedMatches(processedMatchesData);

      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des matchs");
      setLoading(false);
      console.error(err);
    }
  };

  const handleProcessMatch = async (matchId) => {
    try {
      setLoading(true);
      const result = await predictionService.processMatchPredictions(matchId);

      // Rafraîchir les données
      await fetchData();

      setSuccessMessage(`${result.message}`);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors du traitement des pronostics"
      );
      setLoading(false);
      console.error(err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading && !matches.length && !processedMatches.length) {
    return <div>Chargement des matchs...</div>;
  }

  return (
    <div className="admin-pronostics-page">
      <h1>Administration des Pronostics</h1>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "to-process" ? "active" : ""}`}
          onClick={() => handleTabChange("to-process")}
        >
          Matchs à traiter
        </button>
        <button
          className={`tab-btn ${activeTab === "processed" ? "active" : ""}`}
          onClick={() => handleTabChange("processed")}
        >
          Matchs traités
        </button>
      </div>

      {activeTab === "to-process" && (
        <div className="admin-section">
          <h2>Matchs terminés à traiter</h2>

          {matches.length === 0 ? (
            <p>Aucun match terminé à traiter.</p>
          ) : (
            <div className="matches-list admin-matches">
              {matches.map((match) => (
                <div key={match._id} className="match-card admin-match-card">
                  <div className="match-teams">
                    <span className="home-team">{match.homeTeam}</span>
                    <span className="vs">vs</span>
                    <span className="away-team">{match.awayTeam}</span>
                  </div>

                  <div className="match-result">
                    <p>
                      Résultat: {match.result.homeScore} -{" "}
                      {match.result.awayScore}
                    </p>
                    <p>
                      Vainqueur:{" "}
                      {match.result.winner === "home"
                        ? match.homeTeam
                        : match.result.winner === "away"
                        ? match.awayTeam
                        : "Match nul"}
                    </p>
                  </div>

                  <div className="match-date">
                    Joué le: {new Date(match.startTime).toLocaleString("fr-FR")}
                  </div>

                  <button
                    onClick={() => handleProcessMatch(match._id)}
                    className="admin-action-btn"
                    disabled={loading}
                  >
                    Traiter les pronostics
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "processed" && (
        <div className="admin-section">
          <h2>Matchs déjà traités</h2>

          {processedMatches.length === 0 ? (
            <p>Aucun match traité.</p>
          ) : (
            <div className="matches-list admin-matches">
              {processedMatches.map((match) => (
                <div
                  key={match._id}
                  className="match-card admin-match-card processed"
                >
                  <div className="processed-status">
                    <span className="processed-badge">Traité</span>
                    <span className="processed-date">
                      {new Date(match.processedAt).toLocaleString("fr-FR")}
                    </span>
                  </div>

                  <div className="match-teams">
                    <span className="home-team">{match.homeTeam}</span>
                    <span className="vs">vs</span>
                    <span className="away-team">{match.awayTeam}</span>
                  </div>

                  <div className="match-result">
                    <p>
                      Résultat: {match.result.homeScore} -{" "}
                      {match.result.awayScore}
                    </p>
                    <p>
                      Vainqueur:{" "}
                      {match.result.winner === "home"
                        ? match.homeTeam
                        : match.result.winner === "away"
                        ? match.awayTeam
                        : "Match nul"}
                    </p>
                  </div>

                  <div className="match-date">
                    Joué le: {new Date(match.startTime).toLocaleString("fr-FR")}
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

export default AdminPronostics;
