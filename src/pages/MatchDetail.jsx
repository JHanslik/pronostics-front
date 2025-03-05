import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [points, setPoints] = useState(10);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // À remplacer par un contexte d'authentification

  useEffect(() => {
    // Simulation de chargement des détails du match depuis l'API
    // À remplacer par un appel API réel
    setTimeout(() => {
      // Vérifier si l'ID est valide
      if (id > 0 && id < 4) {
        const matchData = {
          id: parseInt(id),
          homeTeam: ["PSG", "Lyon", "Lille"][id - 1],
          awayTeam: ["Marseille", "Monaco", "Lens"][id - 1],
          date: [
            "2025-03-15T20:00:00",
            "2025-03-16T15:00:00",
            "2025-03-16T17:00:00",
          ][id - 1],
          stadium: ["Parc des Princes", "Groupama Stadium", "Pierre-Mauroy"][
            id - 1
          ],
          league: "Ligue 1",
          status: "À venir",
        };
        setMatch(matchData);
        setLoading(false);
      } else {
        setError("Match non trouvé");
        setLoading(false);
      }
    }, 1000);
  }, [id]);

  const handlePredictionChange = (e) => {
    setPrediction(e.target.value);
  };

  const handlePointsChange = (e) => {
    setPoints(parseInt(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Simulation d'envoi de pronostic
    // À remplacer par un appel API réel
    console.log("Pronostic soumis:", {
      matchId: match.id,
      prediction,
      points,
    });

    alert("Votre pronostic a été enregistré !");
  };

  if (loading) return <div>Chargement des détails du match...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="match-detail-page">
      <h1>Détails du match</h1>

      <div className="match-info">
        <div className="match-header">
          <div className="teams">
            <span className="home-team">{match.homeTeam}</span>
            <span className="vs">vs</span>
            <span className="away-team">{match.awayTeam}</span>
          </div>
          <div className="match-meta">
            <p>Date: {new Date(match.date).toLocaleString("fr-FR")}</p>
            <p>Stade: {match.stadium}</p>
            <p>Compétition: {match.league}</p>
            <p>Statut: {match.status}</p>
          </div>
        </div>

        <div className="prediction-section">
          <h2>Faire un pronostic</h2>
          <form onSubmit={handleSubmit} className="prediction-form">
            <div className="form-group">
              <label htmlFor="prediction">Votre pronostic</label>
              <select
                id="prediction"
                value={prediction}
                onChange={handlePredictionChange}
                required
              >
                <option value="">Sélectionnez...</option>
                <option value="home">Victoire {match.homeTeam}</option>
                <option value="draw">Match nul</option>
                <option value="away">Victoire {match.awayTeam}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="points">Points à miser (1-100)</label>
              <input
                type="number"
                id="points"
                min="1"
                max="100"
                value={points}
                onChange={handlePointsChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Valider mon pronostic
            </button>
          </form>

          {!isLoggedIn && (
            <p className="login-prompt">
              Vous devez être connecté pour faire un pronostic.
            </p>
          )}
        </div>
      </div>

      <button onClick={() => navigate(-1)} className="back-btn">
        Retour
      </button>
    </div>
  );
}

export default MatchDetail;
