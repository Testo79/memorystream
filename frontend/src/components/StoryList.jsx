import './StoryList.css';

function StoryList({ stories, placeName, onStoryClick, onAddStory }) {
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="story-list">
            <div className="story-list-header">
                <p className="story-count">
                    {stories.length} {stories.length > 1 ? 'histoires' : 'histoire'} à découvrir
                </p>
                {onAddStory && (
                    <button className="add-story-btn" onClick={onAddStory}>
                        + Ajouter une histoire
                    </button>
                )}
            </div>

            {stories.length === 0 ? (
                <div className="empty-state">
                    <p>Aucune histoire disponible pour ce lieu.</p>
                    {onAddStory && (
                        <button className="add-story-btn-empty" onClick={onAddStory}>
                            + Ajouter la première histoire
                        </button>
                    )}
                </div>
            ) : (
                <div className="stories">
                    {stories.map((story) => (
                        <div
                            key={story.id}
                            className="story-card"
                            onClick={() => onStoryClick(story)}
                        >
                            <h3 className="story-title">{story.title}</h3>
                            <p className="story-date">{formatDate(story.createdAt)}</p>
                            <div className="story-card-footer">
                                <span className="read-more">Lire l'histoire →</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StoryList;
