import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import matchService from "../services/matchService";
import authService from "../services/authService";
import predictionService from "../services/predictionService";
import userService from "../services/userService";

function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [points, setPoints] = useState(10);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Vérification de l'authentification
    const checkAuth = () => {
      const user = authService.getCurrentUser();
      setIsLoggedIn(!!user);
    };

    // Récupération des détails du match
    const fetchMatchDetails = async () => {
      try {
        const data = await matchService.getMatchById(id);
        setMatch(data);
        setLoading(false);
      } catch (err) {
        setError("Match non trouvé");
        setLoading(false);
        console.error(err);
      }
    };

    checkAuth();
    fetchMatchDetails();
  }, [id]);

  const handlePredictionChange = (e) => {
    setPrediction(e.target.value);
  };

  const handlePointsChange = (e) => {
    setPoints(parseInt(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      // Appel API pour créer un pronostic
      await predictionService.createPrediction({
        matchId: match._id,
        prediction,
        pointsBet: points,
      });

      // Mettre à jour les informations utilisateur
      await authService.updateUserInfo();

      alert("Votre pronostic a été enregistré !");

      // Rediriger vers la page des pronostics
      navigate("/my-predictions");
    } catch (err) {
      alert(
        "Erreur lors de l'enregistrement du pronostic: " +
          (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  if (loading) return <div>Chargement des détails du match...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!match) return <div>Match non trouvé</div>;

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
            <p>
              Date:
              <span className="match-day">
                {new Date(match.startTime).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="match-time">
                {new Date(match.startTime).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
            <p>Stade: {match.stadium || "Non spécifié"}</p>
            <p>Compétition: {match.league || "Non spécifiée"}</p>
            <p>Statut: {match.status || "À venir"}</p>
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
