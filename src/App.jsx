import { useState, useEffect, useCallback } from 'react';
import TaskForm    from './components/TaskForm';
import TaskList    from './components/TaskList';
import FilterTabs  from './components/FilterTabs';
import ProgressBar from './components/ProgressBar';
import useLocalStorage from './hooks/useLocalStorage';
import {
  generateId,
  checkAndResetTasks,
  filterAndSortTasks,
} from './utils/taskUtils';
import './App.css';

const INITIAL_TRACKER = { daily: '', weekly: '', monthly: '' };

export default function App() {
  const [tasks,        setTasks]        = useLocalStorage('tf_tasks',   []);
  const [resetTracker, setResetTracker] = useLocalStorage('tf_reset',   INITIAL_TRACKER);
  const [darkMode,     setDarkMode]     = useLocalStorage('tf_dark',    false);
  const [activeTab,    setActiveTab]    = useState('all');
  const [filter,       setFilter]       = useState('all');
  const [showForm,     setShowForm]     = useState(false);
  const [editingTask,  setEditingTask]  = useState(null);
  const [toasts,       setToasts]       = useState([]);

  /* ── auto-reset on mount ─────────────────────────────────────────── */
  useEffect(() => {
    const { updatedTasks, updatedTracker, hasChanges, resetMessages } =
      checkAndResetTasks(tasks, resetTracker);
    if (hasChanges) {
      setTasks(updatedTasks);
      setResetTracker(updatedTracker);
      resetMessages.forEach(msg => addToast(msg, 'info'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── dark-mode class ─────────────────────────────────────────────── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  /* ── toast helper ────────────────────────────────────────────────── */
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  /* ── task handlers ───────────────────────────────────────────────── */
  const handleAdd = (data) => {
    setTasks(prev => [{
      id: generateId(),
      ...data,
      completed: false,
      createdAt: new Date().toISOString(),
    }, ...prev]);
    closeForm();
    addToast('Task added!');
  };

  const handleUpdate = (data) => {
    setTasks(prev => prev.map(t =>
      t.id === editingTask.id ? { ...t, ...data } : t
    ));
    closeForm();
    addToast('Task updated!');
  };

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    addToast('Task deleted.', 'info');
  };

  const handleToggle = (id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const openEdit = (task) => { setEditingTask(task); setShowForm(true); };
  const openNew  = ()     => { setEditingTask(null); setShowForm(true); };
  const closeForm = ()    => { setShowForm(false);   setEditingTask(null); };

  const visibleTasks = filterAndSortTasks(tasks, activeTab, filter);

  return (
    <div className="app">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">◈</span>
            <span className="brand-name">TaskFlow</span>
          </div>
          <div className="header-right">
            <button
              className="icon-btn"
              onClick={() => setDarkMode(d => !d)}
              aria-label="Toggle colour theme"
              title="Toggle theme"
            >
              {darkMode
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            <button className="new-task-btn" onClick={openNew}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Task
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main className="app-main">
        <ProgressBar tasks={tasks} activeTab={activeTab} />

        <FilterTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filter={filter}
          setFilter={setFilter}
          tasks={tasks}
        />

        <TaskList
          tasks={visibleTasks}
          onToggle={handleToggle}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* ── Form Modal ───────────────────────────────────────────────── */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleAdd}
          onClose={closeForm}
        />
      )}

      {/* ── Toasts ───────────────────────────────────────────────────── */}
      <div className="toast-stack" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast--${t.type}`}>{t.message}</div>
        ))}
      </div>
    </div>
  );
}
