import { useState, useEffect } from "react";
import userService from "../services/userService";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    // Récupération du classement depuis l'API
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await userService.getLeaderboard();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement du classement");
        setLoading(false);
        console.error(err);
      }
    };

    fetchLeaderboard();
  }, []);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Chargement du classement...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (users.length === 0) return <div>Aucun utilisateur trouvé</div>;

  return (
    <div className="leaderboard-page">
      <h1>Classement des joueurs</h1>

      <div className="leaderboard-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rang</th>
              <th>Joueur</th>
              <th>Points</th>
              <th>Victoires</th>
              <th>Pronostics</th>
              <th>Taux de réussite</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user._id} className={index < 3 ? "top-rank" : ""}>
                <td className="rank">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && indexOfFirstUser + index + 1}
                </td>
                <td>{user.username}</td>
                <td className="points">{user.points}</td>
                <td>{user.winCount || 0}</td>
                <td>{user.totalPredictions || 0}</td>
                <td>{user.successRate || 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn"
            >
              &laquo;
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
