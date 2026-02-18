import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { fetchPlaces, createPlace } from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import { useDebounce } from '../hooks/useDebounce';
import CreatePlaceForm from './CreatePlaceForm';
import './Map.css';

// Tile server URL (can be overridden via Vite env variable)
const TILE_URL = import.meta.env.VITE_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

// Fix Leaflet default marker icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icon for places
const placeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// User location marker icon (blue)
const userLocationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [30, 48],
    iconAnchor: [15, 48],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle map events and update bounds
function MapEventHandler({ onBoundsChange, onCreateMode, createMode }) {
    useMapEvents({
        moveend: (e) => {
            const bounds = e.target.getBounds();
            onBoundsChange(bounds);
        },
        zoomend: (e) => {
            const bounds = e.target.getBounds();
            onBoundsChange(bounds);
        },
        click: (e) => {
            if (createMode && onCreateMode) {
                onCreateMode(e.latlng.lat, e.latlng.lng);
            }
        }
    });
    return null;
}

// Component to handle map center changes
function MapCenterController({ center, zoom }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, zoom || map.getZoom(), {
                animate: true,
                duration: 1
            });
        }
    }, [center, zoom, map]);

    return null;
}

function Map({ onPlaceClick, isAuthenticated, onRequireAuth }) {
    const [places, setPlaces] = useState([]);
    const [bounds, setBounds] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [toast, setToast] = useState(null);
    const [createMode, setCreateMode] = useState(false);
    const [createLocation, setCreateLocation] = useState(null);

    const { position, error, loading, getCurrentPosition } = useGeolocation();
    const debouncedBounds = useDebounce(bounds, 400);

    // Lille center coordinates
    const defaultCenter = [50.6292, 3.0573];
    const defaultZoom = 13;

    // Fetch places when debounced bounds change
    useEffect(() => {
        if (debouncedBounds) {
            const fetchPlacesData = async () => {
                try {
                    const boundsData = {
                        minLat: debouncedBounds.getSouth(),
                        minLng: debouncedBounds.getWest(),
                        maxLat: debouncedBounds.getNorth(),
                        maxLng: debouncedBounds.getEast()
                    };

                    const data = await fetchPlaces(boundsData);
                    setPlaces(data);
                } catch (err) {
                    console.error('Error loading places:', err);
                }
            };

            fetchPlacesData();
        }
    }, [debouncedBounds]);

    // Handle geolocation success
    useEffect(() => {
        if (position) {
            setMapCenter([position.lat, position.lng]);
            showToast('📍 Position trouvée !', 'success');
        }
    }, [position]);

    // Handle geolocation error
    useEffect(() => {
        if (error) {
            showToast(error, 'error');
        }
    }, [error]);

    const handleBoundsChange = useCallback((newBounds) => {
        setBounds(newBounds);
    }, []);

    const handleGeolocationClick = () => {
        getCurrentPosition();
    };

    const handleAddStoryHere = async () => {
        if (!isAuthenticated) {
            showToast('🔒 Connectez-vous pour ajouter une histoire ici', 'info');
            onRequireAuth?.();
            return;
        }

        if (!position) {
            showToast('Active la localisation puis réessaie.', 'info');
            getCurrentPosition();
            return;
        }

        try {
            const newPlace = await createPlace({
                name: 'Lieu près de vous',
                lat: position.lat,
                lng: position.lng
            });

            // Rafraîchir la liste des lieux autour si on a les bounds
            if (bounds) {
                const boundsData = {
                    minLat: bounds.getSouth(),
                    minLng: bounds.getWest(),
                    maxLat: bounds.getNorth(),
                    maxLng: bounds.getEast()
                };
                const data = await fetchPlaces(boundsData);
                setPlaces(data);
            }

            showToast('✅ Lieu créé à votre position. Vous pouvez ajouter une histoire.', 'success');
            onPlaceClick?.(newPlace);
        } catch (err) {
            console.error('Error creating place at current position:', err);
            showToast('Erreur lors de la création du lieu à votre position.', 'error');
        }
    };

    const handleMapClick = (lat, lng) => {
        if (createMode) {
            setCreateLocation({ lat, lng });
        }
    };

    const handlePlaceCreated = async (newPlace) => {
        setCreateLocation(null);
        setCreateMode(false);
        showToast('✅ Lieu créé avec succès !', 'success');
        
        // Refresh places
        if (bounds) {
            try {
                const boundsData = {
                    minLat: bounds.getSouth(),
                    minLng: bounds.getWest(),
                    maxLat: bounds.getNorth(),
                    maxLng: bounds.getEast()
                };
                const data = await fetchPlaces(boundsData);
                setPlaces(data);
            } catch (err) {
                console.error('Error refreshing places:', err);
            }
        }
        
        // Open the new place
        if (onPlaceClick) {
            onPlaceClick(newPlace);
        }
    };

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    return (
        <div className="map-container">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ height: '100%', width: '100%' }}
                className="leaflet-map"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                    url={TILE_URL}
                />

                <MapEventHandler 
                    onBoundsChange={handleBoundsChange} 
                    onCreateMode={handleMapClick}
                    createMode={createMode}
                />
                <MapCenterController center={mapCenter} zoom={15} />

                {/* User location marker */}
                {position && (
                    <Marker
                        position={[position.lat, position.lng]}
                        icon={userLocationIcon}
                    >
                        <Popup>
                            <div className="marker-popup">
                                <strong>📍 Votre position</strong>
                                <p>Vous êtes ici</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Place markers */}
                {places.map((place) => (
                    <Marker
                        key={place.id}
                        position={[place.lat, place.lng]}
                        icon={placeIcon}
                        eventHandlers={{
                            click: () => onPlaceClick(place)
                        }}
                    >
                        <Popup>
                            <div className="marker-popup">
                                <strong>{place.name || 'Lieu'}</strong>
                                <p>{place.storyCount} {place.storyCount > 1 ? 'histoires' : 'histoire'}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Create Mode Toggle Button */}
            <button
                className={`create-place-btn ${createMode ? 'active' : ''}`}
                onClick={() => {
                    if (!createMode && !isAuthenticated) {
                        showToast('🔒 Connectez-vous pour créer un lieu', 'info');
                        onRequireAuth?.();
                        return;
                    }
                    setCreateMode(!createMode);
                    setCreateLocation(null);
                    showToast(createMode ? 'Mode consultation activé' : 'Mode création activé - Cliquez sur la carte', 'info');
                }}
                title={createMode ? 'Désactiver le mode création' : 'Activer le mode création'}
            >
                {createMode ? '✕ Annuler' : '+ Créer un lieu'}
            </button>

            {/* Geolocation Button */}
            <button
                className={`geolocation-btn ${loading ? 'loading' : ''}`}
                onClick={handleGeolocationClick}
                disabled={loading}
                title="Me localiser"
            >
                📍 {loading ? 'Localisation...' : 'Me localiser'}
            </button>

            {/* Add Story At Current Location Button */}
            <button
                className="story-here-btn"
                onClick={handleAddStoryHere}
                title="Créer un lieu à ma position puis ajouter une histoire"
            >
                ✨ Ajouter une histoire ici
            </button>

            {/* Create Place Form Modal */}
            {createLocation && (
                <div className="create-place-modal">
                    <div className="modal-backdrop" onClick={() => {
                        setCreateLocation(null);
                        setCreateMode(false);
                    }} />
                    <CreatePlaceForm
                        lat={createLocation.lat}
                        lng={createLocation.lng}
                        onPlaceCreated={handlePlaceCreated}
                        onCancel={() => {
                            setCreateLocation(null);
                            setCreateMode(false);
                        }}
                    />
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}

export default Map;
