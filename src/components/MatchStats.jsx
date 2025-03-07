import { useState, useEffect } from "react";
import statsService from "../services/statsService";

function MatchStats({ matchId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await statsService.getMatchPronosticsStats(matchId);
        setStats(data);
      } catch (err) {
        setError("Erreur lors du chargement des statistiques");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      fetchStats();
    }
  }, [matchId]);

  if (loading) {
    return <div>Chargement des statistiques du match...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!stats || !stats.stats || stats.stats.length === 0) {
    return <div>Aucun pronostic disponible pour ce match</div>;
  }

  return (
    <div className="match-stats">
      <h3>Statistiques des pronostics (Agrégation MongoDB)</h3>

      <div>
        <p>Total des pronostics: {stats.totalPronostics}</p>
      </div>

      <div>
        <h4>Répartition des pronostics:</h4>
        <ul>
          {stats.stats.map((stat) => (
            <li key={stat.prediction}>
              {stat.prediction === "home"
                ? "Victoire domicile"
                : stat.prediction === "away"
                ? "Victoire extérieur"
                : stat.prediction === "draw"
                ? "Match nul"
                : stat.prediction}
              :{stat.count} pronostics ({stat.percentage}%)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MatchStats;
