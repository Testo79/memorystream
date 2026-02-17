import { useState } from 'react';
import { createPlace } from '../services/api';
import './CreatePlaceForm.css';

function CreatePlaceForm({ lat, lng, onPlaceCreated, onCancel }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('Veuillez entrer un nom pour ce lieu');
            return;
        }

        setLoading(true);
        try {
            const newPlace = await createPlace({
                name: name.trim(),
                lat,
                lng
            });
            
            // Reset form
            setName('');
            
            // Notify parent
            if (onPlaceCreated) {
                onPlaceCreated(newPlace);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création du lieu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-place-form">
            <h3>Créer un nouveau lieu</h3>
            <p className="coordinates">📍 {lat.toFixed(6)}, {lng.toFixed(6)}</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="place-name">Nom du lieu *</label>
                    <input
                        id="place-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Place de la République"
                        maxLength={200}
                        required
                        autoFocus
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="form-actions">
                    <button type="button" onClick={onCancel} disabled={loading}>
                        Annuler
                    </button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Création...' : 'Créer le lieu'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatePlaceForm;
