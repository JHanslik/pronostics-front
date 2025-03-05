import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import matchService from "../services/matchService";
import predictionService from "../services/predictionService";

function AdminPronostics() {
  const [matches, setMatches] = useState([]);
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

      // Charger les matchs terminés
      try {
        const finishedMatches = await matchService.getFinishedMatches();
        // Filtrer pour ne montrer que les matchs qui n'ont pas encore été traités
        // Cette logique pourrait être déplacée vers le backend si vous ajoutez un champ "processed" au modèle Match
        setMatches(finishedMatches);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des matchs");
        setLoading(false);
        console.error(err);
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleProcessMatch = async (matchId) => {
    try {
      setLoading(true);
      const result = await predictionService.processMatchPredictions(matchId);

      // Mettre à jour la liste des matchs
      setMatches(matches.filter((match) => match._id !== matchId));

      setSuccessMessage(`${result.message}`);
      setTimeout(() => setSuccessMessage(""), 5000);

      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors du traitement des pronostics"
      );
      setLoading(false);
      console.error(err);
    }
  };

  if (loading) return <div>Chargement des matchs terminés...</div>;

  return (
    <div className="admin-pronostics-page">
      <h1>Administration des Pronostics</h1>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

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
    </div>
  );
}

export default AdminPronostics;
