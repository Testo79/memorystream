import { useState } from 'react';
import Map from './components/Map';
import Drawer from './components/Drawer';
import AuthModal from './components/AuthModal';
import { useAuth } from './auth/AuthContext';
import './App.css';

function App() {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedStory, setSelectedStory] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

    const handlePlaceClick = (place) => {
        setSelectedPlace(place);
        setSelectedStory(null);
        setIsDrawerOpen(true);
    };

    const handleStoryClick = (story) => {
        setSelectedStory(story);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => {
            setSelectedPlace(null);
            setSelectedStory(null);
        }, 300); // Wait for animation to complete
    };

    const handleBackToList = () => {
        setSelectedStory(null);
    };

    return (
        <div className="app">
            <button
                className="auth-btn"
                onClick={() => {
                    if (authLoading) return;
                    if (isAuthenticated) logout();
                    else setIsAuthOpen(true);
                }}
                title={isAuthenticated ? 'Se déconnecter' : 'Se connecter'}
            >
                {authLoading
                    ? '...'
                    : isAuthenticated
                        ? `Déconnexion (${[user.firstName, user.lastName].filter(Boolean).join(' ') || user.email})`
                        : 'Se connecter'}
            </button>

            <Map
                onPlaceClick={handlePlaceClick}
                isAuthenticated={isAuthenticated}
                onRequireAuth={() => setIsAuthOpen(true)}
            />
            <Drawer
                isOpen={isDrawerOpen}
                selectedPlace={selectedPlace}
                selectedStory={selectedStory}
                onClose={handleCloseDrawer}
                onStoryClick={handleStoryClick}
                onBackToList={handleBackToList}
                isAuthenticated={isAuthenticated}
                currentUserId={user?.id}
                onRequireAuth={() => setIsAuthOpen(true)}
            />

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
    );
}

export default App;
