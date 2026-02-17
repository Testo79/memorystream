import { useState } from 'react';
import { createStory } from '../services/api';
import './CreateStoryForm.css';

function CreateStoryForm({ placeId, placeName, onStoryCreated, onCancel }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim() || !content.trim()) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        try {
            await createStory({
                placeId,
                title: title.trim(),
                content: content.trim()
            });
            
            // Reset form
            setTitle('');
            setContent('');
            
            // Notify parent to refresh stories
            if (onStoryCreated) {
                onStoryCreated();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création de l\'histoire');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-story-form">
            <h3>Ajouter une histoire à {placeName}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="story-title">Titre *</label>
                    <input
                        id="story-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Mon premier jour ici"
                        maxLength={200}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="story-content">Histoire *</label>
                    <textarea
                        id="story-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Racontez votre histoire..."
                        rows={6}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="form-actions">
                    <button type="button" onClick={onCancel} disabled={loading}>
                        Annuler
                    </button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Création...' : 'Créer l\'histoire'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateStoryForm;
