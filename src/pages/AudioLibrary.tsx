import { usePlayer } from "@/context/PlayerContext";
import { Music, Upload, Play } from "@/components/Icons";
import { fmtBytes, fmtTime, getGradient } from "@/utils/helpers";

export default function AudioLibrary() {
  const { audioFiles, loadAudio, curAudioIdx, isAudioPlaying, audioPositions, goPage } = usePlayer();

  return (
    <div className="page-scroll">
      {audioFiles.length === 0 ? (
        <div className="empty-state">
          <Music size={48} color="#5c6b8a" />
          <h3>No audio files</h3>
          <p>Upload audio files to see them here</p>
          <button className="empty-btn" onClick={() => goPage("upload")}>Upload Audio</button>
        </div>
      ) : (
        <div className="audio-list">
          {audioFiles.map((f, i) => (
            <div key={f.name} className={`audio-item${i === curAudioIdx ? " active" : ""}`}
              onClick={() => loadAudio(i)}>
              <div className="ai-cover" style={{ background: getGradient(i) }}>
                <Music size={20} color="white" />
              </div>
              <div className="ai-info">
                <div className="ai-title">{f.name.replace(/\.[^/.]+$/, "")}</div>
                <div className="ai-sub">
                  {fmtBytes(f.size)}
                  {audioPositions[f.name] ? ` · ${fmtTime(audioPositions[f.name])} saved` : ""}
                </div>
              </div>
              {i === curAudioIdx && isAudioPlaying ? (
                <div className="ai-wave">
                  <span /><span /><span /><span />
                </div>
              ) : (
                <Play size={16} color="#5c6b8a" />
              )}
              {f.liked && (
                <span style={{ color: "var(--accent3)", fontSize: 16, marginLeft: 4 }}>♥</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
