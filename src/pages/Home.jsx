import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import matchService from "../services/matchService";

function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Récupération des matchs depuis l'API
    const fetchMatches = async () => {
      try {
        const data = await matchService.getMatches();
        setMatches(data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des matchs");
        setLoading(false);
        console.error(err);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <div>Chargement des matchs...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (matches.length === 0) return <div>Aucun match à venir</div>;

  return (
    <div className="home-page">
      <h1>Matchs à venir</h1>
      <div className="matches-list">
        {matches.map((match) => (
          <div key={match._id} className="match-card">
            <div className="match-teams">
              <span className="home-team">{match.homeTeam}</span>
              <span className="vs">vs</span>
              <span className="away-team">{match.awayTeam}</span>
            </div>
            <div className="match-date">
              {new Date(match.date).toLocaleString("fr-FR")}
            </div>
            <Link to={`/match/${match._id}`} className="match-link">
              Voir détails
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
