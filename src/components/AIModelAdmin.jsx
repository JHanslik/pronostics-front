import { useState, useEffect } from "react";
import aiService from "../services/aiService";
import { useAuth } from "../contexts/AuthContext";
import "./AIModelAdmin.css";

function AIModelAdmin() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trainingModel, setTrainingModel] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [selectedModelType, setSelectedModelType] = useState("combined");
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchModels();
    }
  }, [user]);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await aiService.getModels();
      if (response.success) {
        setModels(response.models);
      } else {
        setError("Erreur lors du chargement des modèles");
      }
    } catch (err) {
      setError("Erreur lors du chargement des modèles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModelStatus = async (modelId, currentStatus) => {
    try {
      const response = await aiService.toggleModelStatus(
        modelId,
        !currentStatus
      );
      if (response.success) {
        // Mettre à jour l'état local
        setModels(
          models.map((model) =>
            model.id === modelId ? { ...model, active: !currentStatus } : model
          )
        );
      } else {
        setError("Erreur lors de la modification du statut du modèle");
      }
    } catch (err) {
      setError("Erreur lors de la modification du statut du modèle");
      console.error(err);
    }
  };

  const trainNewModel = async () => {
    try {
      setTrainingModel(true);
      const response = await aiService.trainModel(selectedModelType);
      if (response.success) {
        // Rafraîchir la liste des modèles
        fetchModels();
      } else {
        setError("Erreur lors de l'entraînement du modèle");
      }
    } catch (err) {
      setError("Erreur lors de l'entraînement du modèle");
      console.error(err);
    } finally {
      setTrainingModel(false);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      setFetchingData(true);
      const response = await aiService.fetchHistoricalData();
      if (response.success) {
        alert("Récupération des données historiques terminée avec succès");
      } else {
        setError("Erreur lors de la récupération des données historiques");
      }
    } catch (err) {
      setError("Erreur lors de la récupération des données historiques");
      console.error(err);
    } finally {
      setFetchingData(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (user && user.role !== "admin") {
    return (
      <div className="ai-model-admin unauthorized">
        <h3>Administration des modèles IA</h3>
        <div className="error-message">
          Vous n'avez pas les droits d'accès à cette page.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="ai-model-admin loading">
        <h3>Administration des modèles IA</h3>
        <div className="loading-spinner">Chargement des modèles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-model-admin error">
        <h3>Administration des modèles IA</h3>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="ai-model-admin">
      <h3>Administration des modèles IA</h3>

      <div className="admin-actions">
        <div className="action-group">
          <h4>Récupérer des données historiques</h4>
          <p>
            Récupère les données historiques des matchs pour les équipes des
            matchs à venir. Cette opération peut prendre plusieurs minutes.
          </p>
          <button
            className="action-button fetch-data"
            onClick={fetchHistoricalData}
            disabled={fetchingData}
          >
            {fetchingData
              ? "Récupération en cours..."
              : "Récupérer les données"}
          </button>
        </div>

        <div className="action-group">
          <h4>Entraîner un nouveau modèle</h4>
          <p>
            Entraîne un nouveau modèle d'IA sur les données historiques
            disponibles. Cette opération peut prendre plusieurs minutes.
          </p>
          <div className="model-type-selector">
            <label>Type de modèle:</label>
            <select
              value={selectedModelType}
              onChange={(e) => setSelectedModelType(e.target.value)}
              disabled={trainingModel}
            >
              <option value="h2h">Face à face uniquement</option>
              <option value="team_performance">Performance des équipes</option>
              <option value="combined">Combiné (recommandé)</option>
            </select>
          </div>
          <button
            className="action-button train-model"
            onClick={trainNewModel}
            disabled={trainingModel}
          >
            {trainingModel ? "Entraînement en cours..." : "Entraîner un modèle"}
          </button>
        </div>
      </div>

      <div className="models-list">
        <h4>Modèles disponibles</h4>
        {models.length === 0 ? (
          <div className="no-models">Aucun modèle disponible.</div>
        ) : (
          <table className="models-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Précision</th>
                <th>Entraîné le</th>
                <th>Dernière utilisation</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr
                  key={model.id}
                  className={model.active ? "active-model" : ""}
                >
                  <td>{model.name}</td>
                  <td>{model.modelType}</td>
                  <td>{(model.accuracy * 100).toFixed(1)}%</td>
                  <td>{formatDate(model.trainedOn)}</td>
                  <td>{formatDate(model.lastUsed)}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        model.active ? "active" : "inactive"
                      }`}
                    >
                      {model.active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`toggle-button ${
                        model.active ? "deactivate" : "activate"
                      }`}
                      onClick={() => toggleModelStatus(model.id, model.active)}
                    >
                      {model.active ? "Désactiver" : "Activer"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AIModelAdmin;
