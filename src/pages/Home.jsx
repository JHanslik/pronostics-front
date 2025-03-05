import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulation de chargement des matchs depuis l'API
    // À remplacer par un appel API réel
    setTimeout(() => {
      setMatches([
        {
          id: 1,
          homeTeam: "PSG",
          awayTeam: "Marseille",
          date: "2025-03-15T20:00:00",
        },
        {
          id: 2,
          homeTeam: "Lyon",
          awayTeam: "Monaco",
          date: "2025-03-16T15:00:00",
        },
        {
          id: 3,
          homeTeam: "Lille",
          awayTeam: "Lens",
          date: "2025-03-16T17:00:00",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div>Chargement des matchs...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="home-page">
      <h1>Matchs à venir</h1>
      <div className="matches-list">
        {matches.map((match) => (
          <div key={match.id} className="match-card">
            <div className="match-teams">
              <span className="home-team">{match.homeTeam}</span>
              <span className="vs">vs</span>
              <span className="away-team">{match.awayTeam}</span>
            </div>
            <div className="match-date">
              {new Date(match.date).toLocaleString("fr-FR")}
            </div>
            <Link to={`/match/${match.id}`} className="match-link">
              Voir détails
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
