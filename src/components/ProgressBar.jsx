import { getProgressStats } from '../utils/taskUtils';

export default function ProgressBar({ tasks, activeTab }) {
  const stats = getProgressStats(tasks);
  const current = stats[activeTab];

  return (
    <div className="progress-section">
      <div className="progress-stats">
        <div className="stat-card">
          <span className="stat-number">{stats.all.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card stat-card--done">
          <span className="stat-number">{stats.all.completed}</span>
          <span className="stat-label">Done</span>
        </div>
        <div className="stat-card stat-card--pending">
          <span className="stat-number">{stats.all.total - stats.all.completed}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card stat-card--pct">
          <span className="stat-number">{stats.all.percentage}%</span>
          <span className="stat-label">Complete</span>
        </div>
      </div>

      {activeTab !== 'all' ? (
        <div className="type-progress">
          <div className="type-progress-header">
            <span className="type-progress-label">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tasks
            </span>
            <span className="type-progress-count">
              {current.completed} / {current.total} completed
            </span>
          </div>
          <div className="progress-track">
            <div
              className={`progress-fill progress-fill--${activeTab}`}
              style={{ width: `${current.percentage}%` }}
            />
          </div>
        </div>
      ) : (
        stats.all.total > 0 && (
          <div className="all-progress">
            <div className="progress-track progress-track--lg">
              <div
                className="progress-fill progress-fill--all"
                style={{ width: `${stats.all.percentage}%` }}
              >
                {stats.all.percentage > 8 && (
                  <span className="progress-fill-label">{stats.all.percentage}%</span>
                )}
              </div>
            </div>
            <div className="mini-legend">
              {['daily', 'weekly', 'monthly'].map(type => (
                <div key={type} className="mini-legend-item">
                  <span className={`mini-dot mini-dot--${type}`} />
                  <span>{type}: {stats[type].completed}/{stats[type].total}</span>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
