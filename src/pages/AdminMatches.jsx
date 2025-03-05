import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import matchService from "../services/matchService";

function AdminMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("scheduled"); // scheduled, finished
  const navigate = useNavigate();

  // État pour le formulaire de modification
  const [editingMatch, setEditingMatch] = useState(null);
  const [formData, setFormData] = useState({
    homeScore: 0,
    awayScore: 0,
    winner: "home",
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const checkAdmin = async () => {
      const user = authService.getCurrentUser();
      if (!user || user.role !== "admin") {
        navigate("/");
        return;
      }

      // Charger les matchs
      fetchMatches();
    };

    checkAdmin();
  }, [navigate, activeTab]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      let data;

      if (activeTab === "scheduled") {
        data = await matchService.getMatches();
      } else {
        data = await matchService.getFinishedMatches();
      }

      setMatches(data);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des matchs");
      setLoading(false);
      console.error(err);
    }
  };

  const handleEditClick = (match) => {
    setEditingMatch(match);
    setFormData({
      homeScore: match.result?.homeScore || 0,
      awayScore: match.result?.awayScore || 0,
      winner: match.result?.winner || "home",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "homeScore" || name === "awayScore" ? parseInt(value) : value,
    });
  };

  const handleFinishMatch = async (e) => {
    e.preventDefault();

    if (!editingMatch) return;

    try {
      setLoading(true);

      // Déterminer automatiquement le vainqueur en fonction des scores
      let winner;
      if (formData.homeScore > formData.awayScore) {
        winner = "home";
      } else if (formData.awayScore > formData.homeScore) {
        winner = "away";
      } else {
        winner = "draw";
      }

      const result = await matchService.updateMatchResult(editingMatch._id, {
        homeScore: formData.homeScore,
        awayScore: formData.awayScore,
        winner: winner,
      });

      setSuccessMessage(
        `Match ${editingMatch.homeTeam} vs ${editingMatch.awayTeam} terminé avec succès!`
      );
      setTimeout(() => setSuccessMessage(""), 5000);

      // Rafraîchir la liste des matchs
      fetchMatches();

      // Réinitialiser le formulaire
      setEditingMatch(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de la mise à jour du match"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMatch(null);
  };

  if (loading && !editingMatch) return <div>Chargement des matchs...</div>;

  return (
    <div className="admin-matches-page">
      <h1>Administration des Matchs</h1>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "scheduled" ? "active" : ""}`}
          onClick={() => setActiveTab("scheduled")}
        >
          Matchs à venir
        </button>
        <button
          className={`tab-btn ${activeTab === "finished" ? "active" : ""}`}
          onClick={() => setActiveTab("finished")}
        >
          Matchs terminés
        </button>
      </div>

      {editingMatch ? (
        <div className="edit-match-form">
          <h2>Terminer le match</h2>
          <form onSubmit={handleFinishMatch}>
            <div className="match-teams-header">
              <span className="team">{editingMatch.homeTeam}</span>
              <span className="vs">vs</span>
              <span className="team">{editingMatch.awayTeam}</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="homeScore">Score {editingMatch.homeTeam}</label>
                <input
                  type="number"
                  id="homeScore"
                  name="homeScore"
                  min="0"
                  value={formData.homeScore}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="awayScore">Score {editingMatch.awayTeam}</label>
                <input
                  type="number"
                  id="awayScore"
                  name="awayScore"
                  min="0"
                  value={formData.awayScore}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Traitement..." : "Terminer le match"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelEdit}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="matches-container">
          {matches.length === 0 ? (
            <p className="no-matches">
              Aucun match {activeTab === "scheduled" ? "à venir" : "terminé"}{" "}
              trouvé.
            </p>
          ) : (
            <div className="matches-list admin-matches">
              {matches.map((match) => (
                <div
                  key={match._id}
                  className={`match-card admin-match-card ${match.status}`}
                >
                  <div className="match-teams">
                    <span className="home-team">{match.homeTeam}</span>
                    <span className="vs">vs</span>
                    <span className="away-team">{match.awayTeam}</span>
                  </div>

                  {match.status === "finished" ? (
                    <div className="match-result">
                      <p>
                        Score: {match.result.homeScore} -{" "}
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
                  ) : (
                    <div className="match-date">
                      Prévu le:{" "}
                      {new Date(match.startTime).toLocaleString("fr-FR")}
                    </div>
                  )}

                  {match.status !== "finished" && (
                    <button
                      onClick={() => handleEditClick(match)}
                      className="admin-action-btn"
                    >
                      Terminer ce match
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminMatches;
