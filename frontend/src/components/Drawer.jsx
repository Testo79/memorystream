import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import StoryList from './StoryList';
import StoryDetail from './StoryDetail';
import CreateStoryForm from './CreateStoryForm';
import { deleteStory, fetchStoriesForPlace, fetchStory } from '../services/api';
import './Drawer.css';

function Drawer({ isOpen, selectedPlace, selectedStory, onClose, onStoryClick, onBackToList, isAuthenticated, currentUserId, onRequireAuth }) {
    const drawerRef = useRef(null);
    const [stories, setStories] = useState([]);
    const [fullStory, setFullStory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [toast, setToast] = useState(null);

    // GSAP Animation for drawer open/close
    useEffect(() => {
        if (drawerRef.current) {
            if (isOpen) {
                gsap.to(drawerRef.current, {
                    x: 0,
                    duration: 0.4,
                    ease: 'power3.out'
                });
            } else {
                gsap.to(drawerRef.current, {
                    x: '100%',
                    duration: 0.3,
                    ease: 'power3.in'
                });
            }
        }
    }, [isOpen]);

    // Fetch stories when place is selected
    useEffect(() => {
        if (selectedPlace && !selectedStory && !showCreateForm) {
            const loadStories = async () => {
                setLoading(true);
                try {
                    const data = await fetchStoriesForPlace(selectedPlace.id);
                    setStories(data);
                } catch (error) {
                    console.error('Error loading stories:', error);
                } finally {
                    setLoading(false);
                }
            };

            loadStories();
            setFullStory(null);
        }
    }, [selectedPlace, selectedStory, showCreateForm]);

    // Reset create form when drawer closes
    useEffect(() => {
        if (!isOpen) {
            setShowCreateForm(false);
        }
    }, [isOpen]);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const reloadStories = async () => {
        if (!selectedPlace) return;
        setLoading(true);
        try {
            const data = await fetchStoriesForPlace(selectedPlace.id);
            setStories(data);
        } catch (error) {
            console.error('Error loading stories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStoryCreated = async () => {
        setShowCreateForm(false);
        await reloadStories();
    };

    const handleAddStory = () => {
        if (!isAuthenticated) {
            showToast('🔒 Connectez-vous pour ajouter une histoire', 'info');
            onRequireAuth?.();
            return;
        }
        setShowCreateForm(true);
    };

    const canDeleteCurrentStory = () => {
        if (!isAuthenticated || !currentUserId || !fullStory) return false;
        return fullStory.userId === currentUserId;
    };

    const handleDeleteStory = async () => {
        if (!fullStory) return;
        if (!canDeleteCurrentStory()) {
            showToast('Vous ne pouvez supprimer que vos propres histoires.', 'error');
            return;
        }
        const confirmed = window.confirm('Supprimer cette histoire ? Cette action est définitive.');
        if (!confirmed) return;

        try {
            await deleteStory(fullStory.id);
            showToast('Histoire supprimée.', 'success');
            // Revenir à la liste
            onBackToList();
            setFullStory(null);
            await reloadStories();
        } catch (error) {
            console.error('Error deleting story:', error);
            showToast('Erreur lors de la suppression de l’histoire.', 'error');
        }
    };

    // Fetch full story when story is selected
    useEffect(() => {
        if (selectedStory) {
            const loadFullStory = async () => {
                setLoading(true);
                try {
                    const data = await fetchStory(selectedStory.id);
                    setFullStory(data);
                } catch (error) {
                    console.error('Error loading full story:', error);
                } finally {
                    setLoading(false);
                }
            };

            loadFullStory();
        } else {
            setFullStory(null);
        }
    }, [selectedStory]);

    return (
        <>
            {/* Backdrop */}
            {isOpen && <div className="drawer-backdrop" onClick={onClose} />}

            {/* Drawer */}
            <div ref={drawerRef} className="drawer">
                <div className="drawer-header">
                    <h2>
                        {fullStory ? fullStory.title : selectedPlace?.name || 'Histoires'}
                    </h2>
                    <button className="close-btn" onClick={onClose} aria-label="Fermer">
                        ✕
                    </button>
                </div>

                <div className="drawer-content">
                    {loading ? (
                        <div className="loading">Chargement...</div>
                    ) : showCreateForm && selectedPlace ? (
                        <CreateStoryForm
                            placeId={selectedPlace.id}
                            placeName={selectedPlace.name}
                            onStoryCreated={handleStoryCreated}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    ) : fullStory ? (
                        <StoryDetail
                            story={fullStory}
                            onBack={onBackToList}
                            onDelete={canDeleteCurrentStory() ? handleDeleteStory : undefined}
                        />
                    ) : (
                        <StoryList
                            stories={stories}
                            placeName={selectedPlace?.name}
                            onStoryClick={onStoryClick}
                            onAddStory={handleAddStory}
                        />
                    )}
                </div>
            </div>

            {/* Toast Notification (uses global .toast styles from Map.css) */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </>
    );
}

export default Drawer;
