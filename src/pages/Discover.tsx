import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Compass, Film, Music, Play, Upload } from "@/components/Icons";
import { fmtBytes, getGradient } from "@/utils/helpers";

const CATEGORIES = ["All", "Videos", "Audio", "Liked"];

export default function Discover() {
  const { videoFiles, audioFiles, loadVideo, loadAudio, goPage } = usePlayer();
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");

  const q = query.toLowerCase();

  const filteredVideos = (cat === "All" || cat === "Videos") && videoFiles
    .filter(f => !q || f.name.toLowerCase().includes(q));

  const filteredAudio = (cat === "All" || cat === "Audio") && audioFiles
    .filter(f => !q || f.name.toLowerCase().includes(q));

  const likedAudio = cat === "Liked" && audioFiles.filter(f => f.liked);

  const showVideos = cat !== "Audio" && cat !== "Liked";
  const showAudio = cat !== "Videos";
  const showLiked = cat === "Liked";

  const hasContent = (filteredVideos && filteredVideos.length > 0) ||
    (filteredAudio && filteredAudio.length > 0) ||
    (likedAudio && likedAudio.length > 0);

  return (
    <div className="page-scroll">
      <div style={{
        background: "var(--surface2)",
        border: "1px solid var(--border2)",
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        marginBottom: 20
      }}>
        <Compass size={18} color="var(--muted2)" />
        <input
          type="search"
          placeholder="Search your media..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            color: "var(--text)", fontSize: 14, fontFamily: "Figtree, sans-serif"
          }}
        />
      </div>

      <div className="chip-row" style={{ marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button key={c} className={`chip${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      {!hasContent && (
        <div className="empty-state">
          <Compass size={48} color="#5c6b8a" />
          <h3>{query ? "No results found" : "Nothing here yet"}</h3>
          <p>{query ? `No media matching "${query}"` : "Upload media files to discover them here"}</p>
          {!query && <button className="empty-btn" onClick={() => goPage("upload")}>Upload Media</button>}
        </div>
      )}

      {showVideos && filteredVideos && filteredVideos.length > 0 && (
        <div className="discover-section">
          <div className="sec-header">
            <span className="sec-title">Videos ({filteredVideos.length})</span>
          </div>
          <div className="media-grid">
            {filteredVideos.map((f, i) => {
              const idx = videoFiles.indexOf(f);
              return (
                <div key={f.name} className="media-card" onClick={() => loadVideo(idx)}>
                  <div className="mc-thumb">
                    <div className="mc-gradient" style={{ background: getGradient(i), opacity: .7 }} />
                    <Film size={28} color="rgba(255,255,255,0.6)" style={{ position: "relative", zIndex: 1 }} />
                    <div className="mc-overlay">
                      <Play size={36} className="mc-play" color="white" />
                    </div>
                  </div>
                  <div className="mc-body">
                    <div className="mc-title">{f.name.replace(/\.[^/.]+$/, "")}</div>
                    <div className="mc-sub">{fmtBytes(f.size)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showAudio && !showLiked && filteredAudio && filteredAudio.length > 0 && (
        <div className="discover-section">
          <div className="sec-header">
            <span className="sec-title">Audio ({filteredAudio.length})</span>
          </div>
          <div className="audio-list">
            {filteredAudio.map((f, i) => {
              const idx = audioFiles.indexOf(f);
              return (
                <div key={f.name} className="audio-item" onClick={() => loadAudio(idx)}>
                  <div className="ai-cover" style={{ background: getGradient(i) }}>
                    <Music size={20} color="white" />
                  </div>
                  <div className="ai-info">
                    <div className="ai-title">{f.name.replace(/\.[^/.]+$/, "")}</div>
                    <div className="ai-sub">{fmtBytes(f.size)}</div>
                  </div>
                  {f.liked && <span style={{ color: "var(--accent3)" }}>♥</span>}
                  <Play size={16} color="#5c6b8a" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showLiked && likedAudio && (
        likedAudio.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: 40 }}>♥</span>
            <h3>No liked tracks</h3>
            <p>Like tracks in the music player to see them here</p>
          </div>
        ) : (
          <div className="audio-list">
            {likedAudio.map((f, i) => {
              const idx = audioFiles.indexOf(f);
              return (
                <div key={f.name} className="audio-item" onClick={() => loadAudio(idx)}>
                  <div className="ai-cover" style={{ background: getGradient(i) }}>
                    <Music size={20} color="white" />
                  </div>
                  <div className="ai-info">
                    <div className="ai-title">{f.name.replace(/\.[^/.]+$/, "")}</div>
                    <div className="ai-sub">{fmtBytes(f.size)}</div>
                  </div>
                  <span style={{ color: "var(--accent3)" }}>♥</span>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
