import { usePlayer } from "@/context/PlayerContext.tsx";
import { Play, Pause, SkipForward, SkipBack, Music } from "@/components/Icons.tsx";
import { fmtBytes } from "@/utils/helpers.ts";

export default function MiniBar() {
  const {
    curAudioIdx, audioFiles, isAudioPlaying,
    toggleAudio, prevAudio, nextAudio, audioProgress,
    goPage
  } = usePlayer();

  const curTrack = curAudioIdx >= 0 ? audioFiles[curAudioIdx] : null;

  if (!curTrack) return null;

  return (
    <div className="mini-bar" onClick={() => goPage("music")} style={{ cursor: "pointer" }}>
      <div className={`mini-cover${isAudioPlaying ? " spinning" : ""}`}>
        <Music size={20} color="white" />
      </div>
      <div className="mini-info">
        <div className="mini-track">{curTrack.name.replace(/\.[^/.]+$/, "")}</div>
        <div className="mini-sub">{fmtBytes(curTrack.size)}</div>
      </div>
      <div className="mini-ctrls" onClick={e => e.stopPropagation()}>
        <button className="mini-btn" onClick={prevAudio} aria-label="Previous">
          <SkipBack size={18} />
        </button>
        <button className="mini-btn play" onClick={toggleAudio} aria-label="Play/Pause">
          {isAudioPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button className="mini-btn" onClick={nextAudio} aria-label="Next">
          <SkipForward size={18} />
        </button>
      </div>
      <div className="mini-prog">
        <div className="mini-prog-fill" style={{ width: `${audioProgress}%` }} />
      </div>
    </div>
  );
}
