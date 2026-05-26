import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext.tsx";
import { Film, Upload, Play } from "@/components/Icons.tsx";
import { fmtBytes, fmtTime, getGradient } from "@/utils/helpers.ts";

type Filter = "all" | "large" | "small";

export default function VideoLibrary() {
  const { videoFiles, loadVideo, videoPositions, goPage } = usePlayer();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "large"
    ? videoFiles.filter(f => f.size > 100 * 1024 * 1024)
    : filter === "small"
    ? videoFiles.filter(f => f.size <= 100 * 1024 * 1024)
    : videoFiles;

  return (
    <div className="page-scroll">
      <div className="chip-row">
        {(["all", "large", "small"] as Filter[]).map(f => (
          <button key={f} className={`chip${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f === "large" ? "Large (>100MB)" : "Small"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Film size={48} color="#5c6b8a" />
          <h3>{filter !== "all" ? "No videos match this filter" : "No videos yet"}</h3>
          <p>Upload video files to see them here</p>
          <button className="empty-btn" onClick={() => goPage("upload")}>Upload Videos</button>
        </div>
      ) : (
        <div className="media-grid">
          {filtered.map((f, i) => {
            const idx = videoFiles.indexOf(f);
            const savedPos = videoPositions[f.name];
            return (
              <div key={f.name} className="media-card" onClick={() => loadVideo(idx)}>
                <div className="mc-thumb">
                  <div className="mc-gradient" style={{ background: getGradient(i), opacity: .7 }} />
                  <Film size={32} color="rgba(255,255,255,0.6)" style={{ position: "relative", zIndex: 1 }} />
                  <div className="mc-overlay">
                    <Play size={36} className="mc-play" color="white" />
                  </div>
                  {savedPos && (
                    <div className="mc-badge">▶ {fmtTime(savedPos)}</div>
                  )}
                </div>
                <div className="mc-body">
                  <div className="mc-title">{f.name.replace(/\.[^/.]+$/, "")}</div>
                  <div className="mc-sub">{fmtBytes(f.size)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
