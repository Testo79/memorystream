import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Vite proxy will handle routing to backend
});

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
