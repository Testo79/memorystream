import './StoryDetail.css';

function StoryDetail({ story, onBack }) {
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="story-detail">
            <button className="back-btn" onClick={onBack}>
                ← Retour aux histoires
            </button>

            <div className="story-detail-content">
                <div className="story-meta">
                    <span className="story-date-detail">{formatDate(story.createdAt)}</span>
                </div>

                <div className="story-body">
                    <p>{story.content}</p>
                </div>
            </div>
        </div>
    );
}

export default StoryDetail;
