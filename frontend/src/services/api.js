import axios from 'axios';

export const TOKEN_STORAGE_KEY = 'memorystream_token';

const normalizeBaseUrl = (url) => {
    if (!url) return url;
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

const api = axios.create({
    // Dev: Vite proxy handles /api → backend
    // Prod (single-service): backend serves frontend, so same-origin /api works
    // Prod (split deploy): set VITE_API_BASE_URL=https://<backend-host>/api
    baseURL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) || '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const register = async (email, password, firstName, lastName) => {
    const response = await api.post('/auth/register', { email, password, firstName, lastName });
    return response.data;
};

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const fetchMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

// Fetch places within bounding box
export const fetchPlaces = async (bounds) => {
    try {
        const { minLat, minLng, maxLat, maxLng } = bounds;
        const response = await api.get('/places', {
            params: { minLat, minLng, maxLat, maxLng }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching places:', error);
        throw error;
    }
};

// Create a new place
export const createPlace = async (placeData) => {
    try {
        const response = await api.post('/places', placeData);
        return response.data;
    } catch (error) {
        console.error('Error creating place:', error);
        throw error;
    }
};

// Fetch stories for a specific place
export const fetchStoriesForPlace = async (placeId) => {
    try {
        const response = await api.get(`/places/${placeId}/stories`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stories for place:', error);
        throw error;
    }
};

// Fetch full story content
export const fetchStory = async (storyId) => {
    try {
        const response = await api.get(`/stories/${storyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching story:', error);
        throw error;
    }
};

// Create a new story
export const createStory = async (storyData) => {
    try {
        const response = await api.post('/stories', storyData);
        return response.data;
    } catch (error) {
        console.error('Error creating story:', error);
        throw error;
    }
};

// Delete a story
export const deleteStory = async (storyId) => {
    try {
        await api.delete(`/stories/${storyId}`);
    } catch (error) {
        console.error('Error deleting story:', error);
        throw error;
    }
};
