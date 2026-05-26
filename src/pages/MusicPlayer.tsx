import { usePlayer } from "@/context/PlayerContext.tsx";
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Volume2, VolumeX, Heart, Music, Upload
} from "@/components/Icons.tsx";
import { fmtTime, fmtBytes, getGradient } from "@/utils/helpers.ts";

export default function MusicPlayer() {
  const {
    audioFiles, curAudioIdx, isAudioPlaying,
    audioProgress, audioDuration, audioCurrentTime,
    audioPositions, audioVolume, audioShuffle, audioRepeat,
    toggleAudio, prevAudio, nextAudio, seekAudioTo, setAudioVol,
    toggleShuffle, toggleRepeat, toggleLike, loadAudio, goPage
  } = usePlayer();

  const curFile = curAudioIdx >= 0 ? audioFiles[curAudioIdx] : null;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seekAudioTo((e.clientX - rect.left) / rect.width);
  };

  const handleVolClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAudioVol((e.clientX - rect.left) / rect.width);
  };

  return (
    <div className="music-player">
      <div className={`music-art${isAudioPlaying ? " spinning" : ""}`}>
        <Music size={80} color="rgba(255,255,255,0.8)" />
        <div className="music-art-rings" />
      </div>

      <div className="m-info">
        <div className="m-title">
          {curFile ? curFile.name.replace(/\.[^/.]+$/, "") : "Nothing Playing"}
          {curFile && (
            <button className="m-like-btn" onClick={toggleLike} aria-label="Like">
              <Heart size={22} fill={curFile.liked ? "currentColor" : "none"} />
            </button>
          )}
        </div>
        <div className="m-artist">
          {curFile ? `${fmtBytes(curFile.size)} · Local File` : "Select an audio file to start"}
        </div>
      </div>

      <div className="m-prog-wrap">
        <div className="m-progress" onClick={handleProgressClick}>
          <div className="m-prog-fill" style={{ width: `${audioProgress}%` }}>
            <div className="m-prog-thumb" />
          </div>
        </div>
        <div className="m-time-row">
          <span>{fmtTime(audioCurrentTime)}</span>
          <span>{fmtTime(audioDuration)}</span>
        </div>
      </div>

      <div className="m-ctrls">
        <button className={`m-btn${audioShuffle ? " active" : ""}`} onClick={toggleShuffle} aria-label="Shuffle">
          <Shuffle size={22} />
        </button>
        <button className="m-btn" onClick={prevAudio} aria-label="Previous">
          <SkipBack size={26} />
        </button>
        <button className="m-btn main" onClick={toggleAudio} aria-label="Play/Pause">
          {isAudioPlaying ? <Pause size={26} /> : <Play size={26} />}
        </button>
        <button className="m-btn" onClick={nextAudio} aria-label="Next">
          <SkipForward size={26} />
        </button>
        <button className={`m-btn${audioRepeat ? " active" : ""}`} onClick={toggleRepeat} aria-label="Repeat">
          <Repeat size={22} />
        </button>
      </div>

      <div className="m-vol">
        <button className="m-vol-icon m-btn" onClick={() => setAudioVol(audioVolume > 0 ? 0 : 1)} aria-label="Volume">
          {audioVolume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <div className="m-vol-track" onClick={handleVolClick}>
          <div className="m-vol-fill" style={{ width: `${audioVolume * 100}%` }}>
            <div className="m-vol-thumb" />
          </div>
        </div>
      </div>

      {audioFiles.length > 0 && (
        <div className="music-queue">
          <div className="sec-header" style={{ marginTop: 24 }}>
            <span className="sec-title">Queue</span>
          </div>
          <div className="audio-list">
            {audioFiles.slice(0, 8).map((f, i) => (
              <div key={f.name} className={`audio-item${i === curAudioIdx ? " active" : ""}`}
                style={{ padding: "10px 12px" }}
                onClick={() => loadAudio(i)}>
                <div className="ai-cover" style={{ width: 38, height: 38, borderRadius: 10, background: getGradient(i) }}>
                  <Music size={16} color="white" />
                </div>
                <div className="ai-info">
                  <div className="ai-title">{f.name.replace(/\.[^/.]+$/, "")}</div>
                </div>
                {i === curAudioIdx && isAudioPlaying ? (
                  <div className="ai-wave">
                    <span /><span /><span /><span />
                  </div>
                ) : (
                  <Play size={14} color="#5c6b8a" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {audioFiles.length === 0 && (
        <div className="empty-state" style={{ marginTop: 24 }}>
          <Music size={48} color="#5c6b8a" />
          <h3>No audio files</h3>
          <p>Upload audio files to start listening</p>
          <button className="empty-btn" onClick={() => goPage("upload")}>Upload Audio</button>
        </div>
      )}
    </div>
  );
}
