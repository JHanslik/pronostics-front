import { useState, useEffect } from "react";
import statsService from "../services/statsService";
import "./Statistics.css";

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await statsService.getGlobalStats();
        setStats(data);
      } catch (err) {
        setError("Erreur lors du chargement des statistiques");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="statistics-loading">Chargement des statistiques...</div>
    );
  }

  if (error) {
    return <div className="statistics-error">{error}</div>;
  }

  if (!stats) {
    return (
      <div className="statistics-no-data">Aucune statistique disponible</div>
    );
  }

  return (
    <div className="statistics-page">
      <h1>Statistiques</h1>

      <div className="stats-grid">
        <div className="stats-card">
          <h2>Statistiques des matchs</h2>
          <div className="stats-content">
            <div className="stat-highlight">
              <span className="stat-value">
                {stats.matchStats.totalMatches[0]?.count || 0}
              </span>
              <span className="stat-label">Matchs au total</span>
            </div>

            <div className="stat-section">
              <h3>Répartition par statut</h3>
              <div className="stat-bars">
                {stats.matchStats.statusCounts.map((status) => (
                  <div key={status._id} className="stat-bar-container">
                    <div className="stat-bar-label">
                      <span>
                        {status._id === "scheduled"
                          ? "À venir"
                          : status._id === "finished"
                          ? "Terminés"
                          : status._id === "live"
                          ? "En direct"
                          : status._id}
                      </span>
                      <span className="stat-count">{status.count}</span>
                    </div>
                    <div className="stat-bar-wrapper">
                      <div
                        className={`stat-bar status-${status._id}`}
                        style={{
                          width: `${
                            (status.count /
                              stats.matchStats.totalMatches[0]?.count) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {stats.matchStats.finishedMatchResults &&
              stats.matchStats.finishedMatchResults.length > 0 && (
                <div className="stat-section">
                  <h3>Résultats des matchs terminés</h3>
                  <div className="stat-pie-chart">
                    <div className="pie-chart-container">
                      <div className="pie-chart">
                        {stats.matchStats.finishedMatchResults.map(
                          (result, index) => {
                            const total =
                              stats.matchStats.finishedMatchResults.reduce(
                                (sum, r) => sum + r.count,
                                0
                              );
                            const percentage = (result.count / total) * 100;
                            return (
                              <div
                                key={result._id}
                                className={`pie-segment result-${result._id}`}
                                style={{
                                  "--percentage": `${percentage}%`,
                                  "--rotation": `${index * 120}deg`,
                                }}
                              ></div>
                            );
                          }
                        )}
                      </div>
                    </div>
                    <div className="pie-legend">
                      {stats.matchStats.finishedMatchResults.map((result) => (
                        <div key={result._id} className="legend-item">
                          <span
                            className={`legend-color result-${result._id}`}
                          ></span>
                          <span className="legend-label">
                            {result._id === "home"
                              ? "Victoires domicile"
                              : result._id === "away"
                              ? "Victoires extérieur"
                              : result._id === "draw"
                              ? "Matchs nuls"
                              : result._id}
                          </span>
                          <span className="legend-count">{result.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>

        <div className="stats-card">
          <h2>Statistiques des pronostics</h2>
          <div className="stats-content">
            <div className="stat-highlight">
              <span className="stat-value">
                {stats.pronosticStats.totalPronostics[0]?.count || 0}
              </span>
              <span className="stat-label">Pronostics au total</span>
            </div>

            <div className="stat-section">
              <h3>Répartition par statut</h3>
              <div className="stat-donut-chart">
                {stats.pronosticStats.statusCounts.map((status) => {
                  const total = stats.pronosticStats.statusCounts.reduce(
                    (sum, s) => sum + s.count,
                    0
                  );
                  const percentage = (status.count / total) * 100;
                  return (
                    <div key={status._id} className="donut-segment">
                      <div className="donut-label">
                        <div className={`status-indicator ${status._id}`}></div>
                        <span>
                          {status._id === "pending"
                            ? "En attente"
                            : status._id === "won"
                            ? "Gagnés"
                            : status._id === "lost"
                            ? "Perdus"
                            : status._id}
                        </span>
                      </div>
                      <div className="donut-bar-container">
                        <div
                          className={`donut-bar status-${status._id}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                        <span className="donut-percentage">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                      <div className="donut-count">{status.count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="stat-section">
              <h3>Répartition par prédiction</h3>
              <div className="prediction-distribution">
                {stats.pronosticStats.predictionCounts.map((pred) => {
                  const total = stats.pronosticStats.predictionCounts.reduce(
                    (sum, p) => sum + p.count,
                    0
                  );
                  const percentage = (pred.count / total) * 100;
                  return (
                    <div key={pred._id} className="prediction-item">
                      <div className="prediction-label">
                        <span>
                          {pred._id === "home"
                            ? "Victoire domicile"
                            : pred._id === "away"
                            ? "Victoire extérieur"
                            : pred._id === "draw"
                            ? "Match nul"
                            : pred._id}
                        </span>
                        <span className="prediction-count">{pred.count}</span>
                      </div>
                      <div className="prediction-bar-container">
                        <div
                          className={`prediction-bar ${pred._id}`}
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 15 ? `${Math.round(percentage)}%` : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {stats.pronosticStats.avgPointsBet &&
              stats.pronosticStats.avgPointsBet.length > 0 && (
                <div className="stat-highlight secondary">
                  <span className="stat-value">
                    {Math.round(stats.pronosticStats.avgPointsBet[0]?.avg || 0)}
                  </span>
                  <span className="stat-label">Points misés en moyenne</span>
                </div>
              )}
          </div>
        </div>

        <div className="stats-card">
          <h2>Statistiques des utilisateurs</h2>
          <div className="stats-content">
            <div className="stat-highlight">
              <span className="stat-value">
                {stats.userStats.totalUsers[0]?.count || 0}
              </span>
              <span className="stat-label">Utilisateurs au total</span>
            </div>

            <div className="stat-section">
              <h3>Répartition par rôle</h3>
              <div className="role-distribution">
                {stats.userStats.roleCounts.map((role) => {
                  const total = stats.userStats.roleCounts.reduce(
                    (sum, r) => sum + r.count,
                    0
                  );
                  const percentage = (role.count / total) * 100;
                  return (
                    <div key={role._id} className="role-item">
                      <div className="role-icon">
                        <i
                          className={
                            role._id === "admin"
                              ? "fas fa-crown"
                              : "fas fa-user"
                          }
                        ></i>
                      </div>
                      <div className="role-details">
                        <div className="role-name">
                          {role._id === "user"
                            ? "Utilisateurs"
                            : role._id === "admin"
                            ? "Administrateurs"
                            : role._id}
                        </div>
                        <div className="role-count">
                          {role.count} ({Math.round(percentage)}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {stats.userStats.pointsStats &&
              stats.userStats.pointsStats.length > 0 && (
                <div className="stat-section">
                  <h3>Statistiques des points</h3>
                  <div className="points-stats">
                    <div className="points-stat-item">
                      <div className="points-stat-value">
                        {Math.round(
                          stats.userStats.pointsStats[0]?.avgPoints || 0
                        )}
                      </div>
                      <div className="points-stat-label">Moyenne</div>
                    </div>
                    <div className="points-stat-item">
                      <div className="points-stat-value">
                        {stats.userStats.pointsStats[0]?.maxPoints || 0}
                      </div>
                      <div className="points-stat-label">Maximum</div>
                    </div>
                    <div className="points-stat-item">
                      <div className="points-stat-value">
                        {stats.userStats.pointsStats[0]?.minPoints || 0}
                      </div>
                      <div className="points-stat-label">Minimum</div>
                    </div>
                    <div className="points-stat-item total">
                      <div className="points-stat-value">
                        {stats.userStats.pointsStats[0]?.totalPoints || 0}
                      </div>
                      <div className="points-stat-label">Total</div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
