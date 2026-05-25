import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Clock, Film, Music, Trash2 } from "@/components/Icons";
import { fmtBytes, fmtTime, timeAgo, getGradient } from "@/utils/helpers";

type Filter = "all" | "video" | "audio";

export default function Recent() {
  const { recentPlays, clearRecent, videoFiles, audioFiles, loadVideo, loadAudio, videoPositions, audioPositions, toast } = usePlayer();
  const [filter, setFilter] = useState<Filter>("all");

  const items = filter === "all" ? recentPlays : recentPlays.filter(r => r.type === filter);

  const handleClick = (r: typeof recentPlays[0]) => {
    if (r.type === "video") {
      const idx = videoFiles.findIndex(f => f.name.replace(/\.[^/.]+$/, "") === r.name || f.name === r.name);
      if (idx >= 0) loadVideo(idx);
      else toast("File no longer in library");
    } else {
      const idx = audioFiles.findIndex(f => f.name.replace(/\.[^/.]+$/, "") === r.name || f.name === r.name);
      if (idx >= 0) loadAudio(idx);
      else toast("File no longer in library");
    }
  };

  return (
    <div className="page-scroll">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="chip-row" style={{ marginBottom: 0 }}>
          {(["all", "video", "audio"] as Filter[]).map(f => (
            <button key={f} className={`chip${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f === "video" ? "Videos" : "Audio"}
            </button>
          ))}
        </div>
        {recentPlays.length > 0 && (
          <button
            style={{ background: "none", border: "none", color: "var(--accent3)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}
            onClick={clearRecent}
          >
            <Trash2 size={14} /> Clear
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <Clock size={48} color="#5c6b8a" />
          <h3>No history yet</h3>
          <p>Play some media to see it here</p>
        </div>
      ) : (
        items.map((r, i) => {
          const pos = r.type === "video"
            ? videoPositions[videoFiles.find(f => f.name.replace(/\.[^/.]+$/, "") === r.name || f.name === r.name)?.name || ""]
            : audioPositions[audioFiles.find(f => f.name.replace(/\.[^/.]+$/, "") === r.name || f.name === r.name)?.name || ""];
          return (
            <div key={`${r.name}-${r.ts}`} className="recent-item" onClick={() => handleClick(r)}>
              <div className="ri-cover" style={{ background: getGradient(i) }}>
                {r.type === "video" ? <Film size={18} color="white" /> : <Music size={18} color="white" />}
              </div>
              <div className="ri-info">
                <div className="ri-title">{r.name}</div>
                <div className="ri-meta">{timeAgo(r.ts)} · {r.type === "video" ? "Video" : "Audio"} · {fmtBytes(r.size)}</div>
                {pos ? <div className="ri-resume">Resume from {fmtTime(pos)}</div> : null}
              </div>
              <span className={`ri-badge${r.type === "audio" ? " audio" : ""}`}>
                {r.type === "video" ? "Video" : "Audio"}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
