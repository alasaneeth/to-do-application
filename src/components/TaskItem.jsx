import { formatDate, isOverdue } from '../utils/taskUtils';

const TYPE_META = {
  daily:   { icon: '⊙', label: 'Daily'   },
  weekly:  { icon: '◫', label: 'Weekly'  },
  monthly: { icon: '◈', label: 'Monthly' },
};

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task.dueDate, task.completed);
  const { icon, label } = TYPE_META[task.type];

  return (
    <div
      className={[
        'task-item',
        task.completed ? 'task-item--done' : '',
        overdue ? 'task-item--overdue' : '',
      ].filter(Boolean).join(' ')}
    >
      <button
        className={`task-checkbox ${task.completed ? 'task-checkbox--checked' : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className="task-body">
        <p className="task-title">{task.title}</p>
        <div className="task-meta">
          <span className={`type-badge type-badge--${task.type}`}>
            <span aria-hidden="true">{icon}</span> {label}
          </span>
          {task.dueDate && (
            <span className={`task-due ${overdue ? 'task-due--overdue' : ''}`}>
              {overdue ? '⚠ Overdue · ' : '◷ '}{formatDate(task.dueDate)}
            </span>
          )}
          <span className="task-created">
            {formatDate(task.createdAt)}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <button
          className="task-btn task-btn--edit"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          className="task-btn task-btn--delete"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          title="Delete"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
