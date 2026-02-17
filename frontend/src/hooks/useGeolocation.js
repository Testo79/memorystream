import { useState, useCallback } from 'react';

export const useGeolocation = () => {
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getCurrentPosition = useCallback(() => {
        if (!navigator.geolocation) {
            setError('La géolocalisation n\'est pas supportée par votre navigateur');
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
                setLoading(false);
            },
            (err) => {
                let errorMessage = 'Impossible de récupérer votre position';

                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = 'Permission de géolocalisation refusée. Vous pouvez continuer à utiliser la carte normalement.';
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = 'Position non disponible';
                        break;
                    case err.TIMEOUT:
                        errorMessage = 'La demande de géolocalisation a expiré';
                        break;
                    default:
                        errorMessage = 'Une erreur inconnue s\'est produite';
                }

                setError(errorMessage);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }, []);

    return { position, error, loading, getCurrentPosition };
};
