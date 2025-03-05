import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import matchService from "../services/matchService";

function PastMatches() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, home-win, away-win, draw

  useEffect(() => {
    const fetchPastMatches = async () => {
      try {
        const data = await matchService.getFinishedMatches();
        setMatches(data);
        setFilteredMatches(data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des matchs passés");
        setLoading(false);
        console.error(err);
      }
    };

    fetchPastMatches();
  }, []);

  useEffect(() => {
    // Filtrer les matchs selon le filtre sélectionné
    if (filter === "all") {
      setFilteredMatches(matches);
    } else if (filter === "home-win") {
      setFilteredMatches(
        matches.filter((match) => match.result.winner === "home")
      );
    } else if (filter === "away-win") {
      setFilteredMatches(
        matches.filter((match) => match.result.winner === "away")
      );
    } else if (filter === "draw") {
      setFilteredMatches(
        matches.filter((match) => match.result.winner === "draw")
      );
    }
  }, [filter, matches]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading) return <div>Chargement des matchs passés...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (matches.length === 0) return <div>Aucun match passé trouvé</div>;

  return (
    <div className="past-matches-page">
      <h1>Matchs passés</h1>

      <div className="match-filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => handleFilterChange("all")}
        >
          Tous les matchs
        </button>
        <button
          className={`filter-btn ${filter === "home-win" ? "active" : ""}`}
          onClick={() => handleFilterChange("home-win")}
        >
          Victoires domicile
        </button>
        <button
          className={`filter-btn ${filter === "away-win" ? "active" : ""}`}
          onClick={() => handleFilterChange("away-win")}
        >
          Victoires extérieur
        </button>
        <button
          className={`filter-btn ${filter === "draw" ? "active" : ""}`}
          onClick={() => handleFilterChange("draw")}
        >
          Matchs nuls
        </button>
      </div>

      {filteredMatches.length === 0 ? (
        <p className="no-matches">Aucun match ne correspond à ce filtre.</p>
      ) : (
        <div className="matches-list">
          {filteredMatches.map((match) => (
            <div key={match._id} className="match-card past-match">
              <div className="match-teams">
                <span className="home-team">{match.homeTeam}</span>
                <span className="vs">vs</span>
                <span className="away-team">{match.awayTeam}</span>
              </div>
              <div className="match-result">
                <p>
                  Score: {match.result.homeScore} - {match.result.awayScore}
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
                {new Date(match.startTime).toLocaleString("fr-FR")}
              </div>
              <Link to={`/match/${match._id}`} className="match-link">
                Voir détails
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PastMatches;
