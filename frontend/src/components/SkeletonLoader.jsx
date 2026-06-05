export default function SkeletonLoader() {
    return (
        <div className="list">
            <div className="skeleton-wrapper">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div className="skeleton-item" key={i}>
                        <div className="skeleton-circle" />
                        <div className="skeleton-line skeleton-line-long" />
                        <div className="skeleton-line skeleton-line-short" />
                    </div>
                ))}
            </div>
        </div>
    );
}