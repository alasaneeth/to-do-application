import { useState, useEffect } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { MOTIVATIONS } from "./constants/meta";
import { applyAutoResets } from "./utils/resetHelpers";
import Confetti from "./components/Confetti";
import MotivationPopup from "./components/MotivationPopup";
import SortableTaskCard from "./components/SortableTaskCard";
import Modal from "./components/Modal";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("taskflow_v2") || "[]");
      return applyAutoResets(saved);
    } catch { return []; }
  });
  const [filterType,   setFilterType]   = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal,    setShowModal]    = useState(false);
  const [editId,       setEditId]       = useState(null);
  const [confetti,     setConfetti]     = useState(false);
  const [motivation,   setMotivation]   = useState(null);
  const [form, setForm] = useState({ title: "", desc: "", type: "daily", status: "pending" });

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    localStorage.setItem("taskflow_v2", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setTasks((prev) => applyAutoResets([...prev]));
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  const celebrate = () => {
    const m = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
    setMotivation(m);
    setConfetti(true);
    setTimeout(() => { setConfetti(false); setMotivation(null); }, 4000);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const openAdd  = () => { setForm({ title: "", desc: "", type: "daily", status: "pending" }); setEditId(null); setShowModal(true); };
  const openEdit = (task) => { setForm({ title: task.title, desc: task.desc || "", type: task.type, status: task.status }); setEditId(task.id); setShowModal(true); };

  const saveTask = () => {
    if (!form.title.trim()) return;
    if (editId) {
      const old = tasks.find((t) => t.id === editId);
      setTasks((p) => p.map((t) => t.id === editId ? { ...t, ...form } : t));
      if (old?.status !== "done" && form.status === "done") celebrate();
    } else {
      setTasks((p) => [{ id: crypto.randomUUID(), ...form, createdAt: new Date().toISOString() }, ...p]);
      if (form.status === "done") celebrate();
    }
    setShowModal(false);
  };

  const updateStatus = (id, status) => {
    const old = tasks.find((t) => t.id === id);
    setTasks((p) => p.map((t) => t.id === id ? { ...t, status } : t));
    if (old?.status !== "done" && status === "done") celebrate();
  };

  const deleteTask = (id) => setTasks((p) => p.filter((t) => t.id !== id));

  const filtered = tasks.filter((t) =>
    (filterType   === "all" || t.type   === filterType) &&
    (filterStatus === "all" || t.status === filterStatus)
  );

  const total      = tasks.length;
  const done       = tasks.filter((t) => t.status === "done").length;
  const inprogress = tasks.filter((t) => t.status === "inprogress").length;
  const pending    = tasks.filter((t) => t.status === "pending").length;
  const progress   = total > 0 ? Math.round((done / total) * 100) : 0;

  const typeTabs = [
    { v: "all",     l: "All" },
    { v: "daily",   l: "📅 Daily" },
    { v: "weekly",  l: "📆 Weekly" },
    { v: "monthly", l: "🗓️ Monthly" },
  ];
  const statusTabs = [
    { v: "all",        l: "All Status" },
    { v: "pending",    l: "⏳ Pending" },
    { v: "inprogress", l: "⚡ In Progress" },
    { v: "done",       l: "✅ Done" },
  ];

  const pillBase   = { fontSize: 12, padding: "6px 14px", borderRadius: 100, border: "1px solid #2a2a3e", background: "transparent", color: "#4b5563", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s", fontFamily: "inherit", fontWeight: 500 };
  const pillActive = { ...pillBase, background: "#1a1a2e", border: "1px solid #3a3a5e", color: "#e2e8f0" };

  const statCards = [
    { label: "Total",    value: total,      color: "#60a5fa", bg: "#0d1a2e", border: "#1a2e4a" },
    { label: "Pending",  value: pending,    color: "#f87171", bg: "#2d0f0f", border: "#4a1a1a" },
    { label: "Progress", value: inprogress, color: "#fbbf24", bg: "#2d1a0a", border: "#4a2e10" },
    { label: "Done",     value: done,       color: "#34d399", bg: "#0a2d1a", border: "#0f4a2e" },
  ];

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

          {/* ── HEADER ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "#f1f5f9", fontWeight: 400, letterSpacing: "-0.01em" }}>
                ⚡ TaskFlow
              </h1>
              <p style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>உன் கனவை நினைவாக்கு • Make it happen</p>
            </div>
            <button onClick={openAdd}
              style={{ background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 12, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit", transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1d4ed8"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New Task
            </button>
          </div>

          {/* ── STAT CARDS ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
            {statCards.map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "14px 12px", textAlign: "center", animation: `cardIn 0.3s ease ${i * 0.06}s both` }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 5, fontFamily: "'DM Serif Display', serif" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 10, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── PROGRESS BAR ── */}
          {total > 0 && (
            <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#4b5563" }}>Overall Progress</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24" }}>{progress}%</span>
              </div>
              <div style={{ height: 6, background: "#1e1e2e", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #1d4ed8, #60a5fa)", borderRadius: 6, transition: "width 0.7s cubic-bezier(.4,0,.2,1)" }} />
              </div>
            </div>
          )}

          {/* ── TYPE FILTER ── */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 8, scrollbarWidth: "none" }}>
            {typeTabs.map((tab) => (
              <button key={tab.v} onClick={() => setFilterType(tab.v)} style={filterType === tab.v ? pillActive : pillBase}>{tab.l}</button>
            ))}
          </div>

          {/* ── STATUS FILTER ── */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 24, scrollbarWidth: "none" }}>
            {statusTabs.map((tab) => (
              <button key={tab.v} onClick={() => setFilterStatus(tab.v)} style={filterStatus === tab.v ? pillActive : pillBase}>{tab.l}</button>
            ))}
          </div>

          {/* ── TASK LIST ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16, animation: "shimmer 2s infinite" }}>📋</div>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginBottom: 6, fontFamily: "'DM Serif Display', serif" }}>No tasks found</p>
                <p style={{ fontSize: 13, color: "#1f2937" }}>
                  {total === 0 ? "Add your first task to get started! 🚀" : "No tasks match the selected filters."}
                </p>
                {total === 0 && (
                  <button onClick={openAdd}
                    style={{ marginTop: 20, background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 12, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#1d4ed8")}
                  >+ Add First Task</button>
                )}
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filtered.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  {filtered.map((task) => (
                    <SortableTaskCard
                      key={task.id}
                      task={task}
                      onStatus={updateStatus}
                      onEdit={openEdit}
                      onDelete={deleteTask}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>

        </div>
      </div>

      {showModal && (
        <Modal form={form} setForm={setForm} onSave={saveTask} onClose={() => setShowModal(false)} isEdit={!!editId} />
      )}
    </>
  );
}