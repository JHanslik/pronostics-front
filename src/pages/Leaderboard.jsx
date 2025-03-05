import { useState, useEffect } from "react";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    // Simulation de chargement du classement depuis l'API
    // À remplacer par un appel API réel
    setTimeout(() => {
      // Génération de données de test
      const testUsers = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        username: `user${i + 1}`,
        points: Math.floor(Math.random() * 1000) + 100,
        winCount: Math.floor(Math.random() * 50),
        totalPredictions: Math.floor(Math.random() * 100) + 10,
      }));

      // Tri par points décroissants
      testUsers.sort((a, b) => b.points - a.points);

      // Ajout du rang
      testUsers.forEach((user, index) => {
        user.rank = index + 1;
      });

      setUsers(testUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Chargement du classement...</div>;
  if (error) return <div>Erreur: {error}</div>;

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
            {currentUsers.map((user) => (
              <tr key={user.id} className={user.rank <= 3 ? "top-rank" : ""}>
                <td className="rank">
                  {user.rank === 1 && "🥇"}
                  {user.rank === 2 && "🥈"}
                  {user.rank === 3 && "🥉"}
                  {user.rank > 3 && user.rank}
                </td>
                <td>{user.username}</td>
                <td className="points">{user.points}</td>
                <td>{user.winCount}</td>
                <td>{user.totalPredictions}</td>
                <td>
                  {user.totalPredictions > 0
                    ? `${Math.round(
                        (user.winCount / user.totalPredictions) * 100
                      )}%`
                    : "0%"}
                </td>
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
