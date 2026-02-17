import { useState } from 'react';
import Map from './components/Map';
import Drawer from './components/Drawer';
import './App.css';

function App() {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedStory, setSelectedStory] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
            <Map onPlaceClick={handlePlaceClick} />
            <Drawer
                isOpen={isDrawerOpen}
                selectedPlace={selectedPlace}
                selectedStory={selectedStory}
                onClose={handleCloseDrawer}
                onStoryClick={handleStoryClick}
                onBackToList={handleBackToList}
            />
        </div>
    );
}

export default App;
