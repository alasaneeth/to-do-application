import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon" aria-hidden="true">◈</div>
        <h3 className="empty-title">No tasks here</h3>
        <p className="empty-sub">Add a new task or try a different filter.</p>
      </div>
    );
  }

  return (
    <ul className="task-list" role="list">
      {tasks.map(task => (
        <li key={task.id}>
          <TaskItem
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
