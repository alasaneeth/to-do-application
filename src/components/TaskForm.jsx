import { useState, useEffect, useRef } from 'react';
import { getToday } from '../utils/taskUtils';

const TYPE_OPTIONS = [
  { id: 'daily',   icon: '⊙', label: 'Daily',   desc: 'Resets every day'   },
  { id: 'weekly',  icon: '◫', label: 'Weekly',  desc: 'Resets every week'  },
  { id: 'monthly', icon: '◈', label: 'Monthly', desc: 'Resets every month' },
];

export default function TaskForm({ task, onSubmit, onClose }) {
  const [title, setTitle]     = useState('');
  const [type, setType]       = useState('daily');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors]   = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setType(task.type);
      setDueDate(task.dueDate || '');
    }
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [task]);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = 'Task title is required.';
    else if (title.trim().length > 120) e.title = 'Title must be under 120 characters.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ title: title.trim(), type, dueDate: dueDate || null });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Task form">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-body">
            {/* Title */}
            <div className="field">
              <label className="field-label" htmlFor="task-title">Title *</label>
              <input
                ref={inputRef}
                id="task-title"
                type="text"
                className={`field-input ${errors.title ? 'field-input--error' : ''}`}
                value={title}
                onChange={e => { setTitle(e.target.value); setErrors({}); }}
                placeholder="What needs to be done?"
                maxLength={120}
              />
              {errors.title && <p className="field-error">{errors.title}</p>}
              <p className="field-hint">{title.length}/120</p>
            </div>

            {/* Type */}
            <div className="field">
              <label className="field-label">Task Type</label>
              <div className="type-grid">
                {TYPE_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`type-card type-card--${opt.id} ${type === opt.id ? 'type-card--active' : ''}`}
                    onClick={() => setType(opt.id)}
                  >
                    <span className="type-card-icon" aria-hidden="true">{opt.icon}</span>
                    <span className="type-card-label">{opt.label}</span>
                    <span className="type-card-desc">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div className="field">
              <label className="field-label" htmlFor="task-due">Due Date <span className="field-optional">(optional)</span></label>
              <input
                id="task-due"
                type="date"
                className="field-input"
                value={dueDate}
                min={getToday()}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">
              {task ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
