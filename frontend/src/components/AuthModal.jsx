import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import './AuthModal.css';

function AuthModal({ isOpen, onClose }) {
    const { login, register } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(email, password);
            } else {
                await register(email, password, firstName, lastName);
            }
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            onClose?.();
        } catch (err) {
            setError(err?.response?.data?.message || 'Erreur lors de l’authentification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal">
            <div className="auth-backdrop" onClick={onClose} />
            <div className="auth-card" role="dialog" aria-modal="true">
                <div className="auth-header">
                    <h3>{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h3>
                    <button className="auth-close" onClick={onClose} aria-label="Fermer">✕</button>
                </div>

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => setMode('login')}
                        type="button"
                    >
                        Connexion
                    </button>
                    <button
                        className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                        onClick={() => setMode('register')}
                        type="button"
                    >
                        Créer un compte
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <div className="auth-name-row">
                            <div className="form-group">
                                <label htmlFor="auth-firstname">Prénom *</label>
                                <input
                                    id="auth-firstname"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="ex: Jean"
                                    required={mode === 'register'}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="auth-lastname">Nom *</label>
                                <input
                                    id="auth-lastname"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="ex: Dupont"
                                    required={mode === 'register'}
                                />
                            </div>
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="auth-email">Email *</label>
                        <input
                            id="auth-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ex: moi@email.com"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="auth-password">Mot de passe *</label>
                        <input
                            id="auth-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 8 caractères"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button type="button" onClick={onClose} disabled={loading}>
                            Annuler
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? '...' : (mode === 'login' ? 'Se connecter' : 'Créer le compte')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthModal;

