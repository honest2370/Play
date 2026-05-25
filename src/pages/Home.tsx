import { usePlayer } from "@/context/PlayerContext";
import { Film, Music, Upload, Clock, Plus, Play } from "@/components/Icons";
import { fmtBytes, timeAgo, getGradient } from "@/utils/helpers";

export default function Home() {
  const { videoFiles, audioFiles, recentPlays, goPage, loadVideo, loadAudio, schedules } = usePlayer();

  return (
    <div className="page-scroll">
      <div className="home-hero">
        <div className="hero-glow" />
        <div className="hero-title">Welcome to FLUX</div>
        <div className="hero-sub">Your personal media player. Upload and enjoy your videos and music anywhere.</div>
        <div className="hero-stats">
          <div className="hstat">
            <div className="hstat-num">{videoFiles.length}</div>
            <div className="hstat-lbl">Videos</div>
          </div>
          <div className="hstat">
            <div className="hstat-num">{audioFiles.length}</div>
            <div className="hstat-lbl">Tracks</div>
          </div>
          <div className="hstat">
            <div className="hstat-num">{recentPlays.length}</div>
            <div className="hstat-lbl">Played</div>
          </div>
          <div className="hstat">
            <div className="hstat-num">{schedules.length}</div>
            <div className="hstat-lbl">Scheduled</div>
          </div>
        </div>
      </div>

      <div className="quick-btns">
        <button className="q-btn" onClick={() => goPage("upload")}>
          <div className="q-btn-icon" style={{ background: "linear-gradient(135deg,#5b6af5,#00cfff)" }}>
            <Film size={20} color="white" />
          </div>
          <div>
            <div className="q-btn-text">Videos</div>
            <div className="q-btn-sub">{videoFiles.length} files</div>
          </div>
        </button>
        <button className="q-btn" onClick={() => goPage("upload")}>
          <div className="q-btn-icon" style={{ background: "linear-gradient(135deg,#ff3d9a,#5b6af5)" }}>
            <Music size={20} color="white" />
          </div>
          <div>
            <div className="q-btn-text">Music</div>
            <div className="q-btn-sub">{audioFiles.length} tracks</div>
          </div>
        </button>
        <button className="q-btn" onClick={() => goPage("recent")}>
          <div className="q-btn-icon" style={{ background: "linear-gradient(135deg,#ffa94d,#ff3d9a)" }}>
            <Clock size={20} color="white" />
          </div>
          <div>
            <div className="q-btn-text">Recent</div>
            <div className="q-btn-sub">{recentPlays.length} items</div>
          </div>
        </button>
        <button className="q-btn" onClick={() => goPage("playlists")}>
          <div className="q-btn-icon" style={{ background: "linear-gradient(135deg,#2ecc91,#00cfff)" }}>
            <Plus size={20} color="white" />
          </div>
          <div>
            <div className="q-btn-text">Playlists</div>
            <div className="q-btn-sub">Organise media</div>
          </div>
        </button>
      </div>

      {recentPlays.length > 0 && (
        <>
          <div className="sec-header">
            <span className="sec-title">Recently Played</span>
            <button className="sec-link" onClick={() => goPage("recent")}>See all</button>
          </div>
          {recentPlays.slice(0, 5).map((r, i) => (
            <div key={`${r.name}-${r.ts}`} className="recent-item" onClick={() => {
              if (r.type === "video") {
                const idx = videoFiles.findIndex(f => f.name.replace(/\.[^/.]+$/, "") === r.name || f.name === r.name);
                if (idx >= 0) loadVideo(idx);
              } else {
                const idx = audioFiles.findIndex(f => f.name.replace(/\.[^/.]+$/, "") === r.name || f.name === r.name);
                if (idx >= 0) loadAudio(idx);
              }
            }}>
              <div className="ri-cover" style={{ background: getGradient(i) }}>
                {r.type === "video" ? <Film size={18} color="white" /> : <Music size={18} color="white" />}
              </div>
              <div className="ri-info">
                <div className="ri-title">{r.name}</div>
                <div className="ri-meta">{timeAgo(r.ts)} · {r.type === "video" ? "Video" : "Audio"} · {fmtBytes(r.size)}</div>
              </div>
              <span className={`ri-badge${r.type === "audio" ? " audio" : ""}`}>
                {r.type === "video" ? "Video" : "Audio"}
              </span>
            </div>
          ))}
        </>
      )}

      {videoFiles.length > 0 && (
        <>
          <div className="sec-header" style={{ marginTop: 24 }}>
            <span className="sec-title">Videos</span>
            <button className="sec-link" onClick={() => goPage("video-library")}>See all</button>
          </div>
          <div className="media-grid">
            {videoFiles.slice(0, 4).map((f, i) => (
              <div key={f.name} className="media-card" onClick={() => loadVideo(i)}>
                <div className="mc-thumb">
                  <div className="mc-gradient" style={{ background: getGradient(i), opacity: .7 }} />
                  <div className="mc-overlay">
                    <Play size={36} className="mc-play" color="white" />
                  </div>
                </div>
                <div className="mc-body">
                  <div className="mc-title">{f.name.replace(/\.[^/.]+$/, "")}</div>
                  <div className="mc-sub">{fmtBytes(f.size)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {audioFiles.length > 0 && (
        <>
          <div className="sec-header" style={{ marginTop: 24 }}>
            <span className="sec-title">Music</span>
            <button className="sec-link" onClick={() => goPage("audio-library")}>See all</button>
          </div>
          <div className="audio-list">
            {audioFiles.slice(0, 5).map((f, i) => (
              <div key={f.name} className="audio-item" onClick={() => loadAudio(i)}>
                <div className="ai-cover" style={{ background: getGradient(i) }}>
                  <Music size={20} color="white" />
                </div>
                <div className="ai-info">
                  <div className="ai-title">{f.name.replace(/\.[^/.]+$/, "")}</div>
                  <div className="ai-sub">{fmtBytes(f.size)}</div>
                </div>
                <Play size={16} color="#5c6b8a" />
              </div>
            ))}
          </div>
        </>
      )}

      {videoFiles.length === 0 && audioFiles.length === 0 && (
        <div className="empty-state" style={{ paddingTop: 32 }}>
          <Upload size={48} color="#5c6b8a" />
          <h3>No media yet</h3>
          <p>Upload your first video or audio file to get started</p>
          <button className="empty-btn" onClick={() => goPage("upload")}>Upload Now</button>
        </div>
      )}
    </div>
  );
}
