import './StoryDetail.css';

function StoryDetail({ story, onBack, onDelete }) {
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getAuthorLabel = () => {
        const first = story.authorFirstName?.trim();
        const last = story.authorLastName?.trim();
        if (first || last) {
            return `${first || ''} ${last || ''}`.trim();
        }
        return 'Auteur inconnu';
    };

    return (
        <div className="story-detail">
            <button className="back-btn" onClick={onBack}>
                ← Retour aux histoires
            </button>

            {onDelete && (
                <button className="delete-btn" onClick={onDelete}>
                    🗑️ Supprimer cette histoire
                </button>
            )}

            <div className="story-detail-content">
                <div className="story-meta">
                    <span className="story-date-detail">
                        {formatDate(story.createdAt)} · {getAuthorLabel()}
                    </span>
                </div>

                <div className="story-body">
                    <p>{story.content}</p>
                </div>
            </div>
        </div>
    );
}

export default StoryDetail;
