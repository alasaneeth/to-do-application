import useTasks from "./hooks/useTasks";
import Confetti from "./components/Confetti";
import MotivationPopup from "./components/MotivationPopup";
import Header from "./components/Header";
import StatCards from "./components/StatCards";
import ProgressBar from "./components/ProgressBar";
import FilterTabs from "./components/FilterTabs";
import TaskList from "./components/TaskList";
import Modal from "./components/Modal";

export default function App() {
  const {
    filtered, total, done, inprogress, pending,
    confetti, motivation,
    showModal, form, setForm,
    filterType, setFilterType,
    filterStatus, setFilterStatus,
    openAdd, openEdit, closeModal,
    saveTask, updateStatus, deleteTask,
    handleDragEnd,
  } = useTasks();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a10; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 4px; }
        select option { background: #111118; color: #e2e8f0; }
        @keyframes cardIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes modalIn { from { opacity:0; transform:translateY(12px) scale(0.97); } to { opacity:1; transform:none; } }
        @keyframes popIn   { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
        @keyframes shimmer { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
      `}</style>

      <Confetti active={confetti} />
      <MotivationPopup data={motivation} />

      <div style={{ minHeight: "100vh", background: "#0a0a10", padding: "0 0 80px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>
          <Header onAdd={openAdd} />
          <StatCards total={total} pending={pending} inprogress={inprogress} done={done} />
          <ProgressBar total={total} done={done} />
          <FilterTabs
            filterType={filterType}     setFilterType={setFilterType}
            filterStatus={filterStatus} setFilterStatus={setFilterStatus}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <TaskList
              filtered={filtered} total={total}
              onDragEnd={handleDragEnd} onStatus={updateStatus}
              onEdit={openEdit} onDelete={deleteTask} onAdd={openAdd}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <Modal
          form={form} setForm={setForm}
          onSave={saveTask} onClose={closeModal}
          isEdit={!!form.editId}
        />
      )}
    </>
  );
}