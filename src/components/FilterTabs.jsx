const TABS = [
  { id: 'all',     label: 'All Tasks', icon: '⊞' },
  { id: 'daily',   label: 'Daily',     icon: '⊙' },
  { id: 'weekly',  label: 'Weekly',    icon: '◫' },
  { id: 'monthly', label: 'Monthly',   icon: '◈' },
];

const FILTERS = [
  { id: 'all',       label: 'All'     },
  { id: 'pending',   label: 'Pending' },
  { id: 'completed', label: 'Done'    },
];

export default function FilterTabs({ activeTab, setActiveTab, filter, setFilter, tasks }) {
  const getCount = (tabId) =>
    tabId === 'all' ? tasks.length : tasks.filter(t => t.type === tabId).length;

  return (
    <div className="filter-section">
      <div className="tabs" role="tablist">
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab ${activeTab === tab.id ? 'tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            <span className={`tab-badge ${activeTab === tab.id ? 'tab-badge--active' : ''}`}>
              {getCount(tab.id)}
            </span>
          </button>
        ))}
      </div>

      <div className="filter-row">
        <span className="filter-row-label">Show:</span>
        <div className="filters">
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`filter-btn ${filter === f.id ? 'filter-btn--active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
