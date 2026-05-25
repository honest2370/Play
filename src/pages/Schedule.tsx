import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Calendar, Trash2, Film, Music } from "@/components/Icons";

export default function Schedule() {
  const { schedules, addSchedule, removeSchedule } = usePlayer();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<"video" | "audio">("video");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !date || !time) return;
    addSchedule({ title: title.trim(), date, time, type, notes: notes.trim() });
    setTitle(""); setDate(""); setTime(""); setNotes("");
  };

  return (
    <div className="page-scroll">
      <div className="schedule-add">
        <div className="sched-label">Add Schedule</div>
        <input
          className="sched-input"
          placeholder="Event title *"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div className="sched-row">
          <input
            className="sched-input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <input
            className="sched-input"
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <select
            className="sched-input"
            value={type}
            onChange={e => setType(e.target.value as "video" | "audio")}
            style={{ marginBottom: 0 }}
          >
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <input
          className="sched-input"
          placeholder="Notes (optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <button className="sched-submit" onClick={handleSubmit}>Schedule Event</button>
      </div>

      <div className="sec-header">
        <span className="sec-title">Scheduled Events</span>
      </div>

      {schedules.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} color="#5c6b8a" />
          <h3>No schedules</h3>
          <p>Add a schedule above to plan your media sessions</p>
        </div>
      ) : (
        schedules.map(s => {
          const dt = new Date(`${s.date}T${s.time}`);
          const isPast = dt < new Date();
          return (
            <div key={s.id} className="sched-item">
              <div className="si-time">
                <div className="si-h">{String(dt.getHours()).padStart(2, "0")}:{String(dt.getMinutes()).padStart(2, "0")}</div>
                <div className="si-d">{s.date}</div>
              </div>
              <div className="si-info">
                <div className="si-title">{s.title}</div>
                <div className="si-sub">
                  {s.type === "video" ? <Film size={12} style={{ display: "inline", marginRight: 4 }} /> : <Music size={12} style={{ display: "inline", marginRight: 4 }} />}
                  {s.type === "video" ? "Video" : "Audio"}
                  {s.notes ? ` · ${s.notes}` : ""}
                </div>
              </div>
              <span
                className="si-badge"
                style={isPast ? { background: "rgba(255,61,154,.1)", color: "var(--accent3)", borderColor: "rgba(255,61,154,.25)" } : {}}
              >
                {isPast ? "Past" : "Upcoming"}
              </span>
              <button className="si-del" onClick={() => removeSchedule(s.id)} aria-label="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
