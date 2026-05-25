import { useRef, useEffect, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import {
  Play, Pause, SkipBack, SkipForward, Maximize2, VolumeX, Volume2,
  Upload, Film, ChevronLeft, FastForward, Rewind
} from "@/components/Icons";
import { fmtTime, fmtBytes, getGradient } from "@/utils/helpers";

export default function VideoPlayer() {
  const {
    videoRef, videoFiles, curVideoIdx, isVideoPlaying,
    videoProgress, videoDuration, videoCurrentTime, videoPositions,
    videoSpeedIdx, videoMuted,
    toggleVideo, prevVideo, nextVideo, seekVideoTo, seekVideo,
    cycleSpeed, toggleVMute, goPage, loadVideo
  } = usePlayer();

  const [showOverlay, setShowOverlay] = useState(false);
  const overlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const VIDEO_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const curFile = curVideoIdx >= 0 ? videoFiles[curVideoIdx] : null;

  const showControls = () => {
    setShowOverlay(true);
    if (overlayTimer.current) clearTimeout(overlayTimer.current);
    overlayTimer.current = setTimeout(() => {
      if (isVideoPlaying) setShowOverlay(false);
    }, 3000);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seekVideoTo((e.clientX - rect.left) / rect.width);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  };

  return (
    <div className="player-wrap">
      {curFile ? (
        <>
          <div className="video-container" ref={containerRef} onClick={showControls}>
            <video
              ref={videoRef as React.RefObject<HTMLVideoElement>}
              style={{ width: "100%", maxHeight: "55vh", objectFit: "contain", display: "block", background: "#000" }}
            />
            <div className={`v-overlay${showOverlay ? " show" : ""}`}>
              <div className="v-top">
                <div>
                  <div className="v-title">{curFile.name.replace(/\.[^/.]+$/, "")}</div>
                  <div className="v-sub">{fmtBytes(curFile.size)} · Local File</div>
                </div>
                <div className="v-badges">
                  <span className="vbadge hd">HD</span>
                  <span className="vbadge fps">60fps</span>
                </div>
              </div>

              <div className="v-mid">
                <button className="v-ctrl sm" onClick={e => { e.stopPropagation(); seekVideo(-10); }} aria-label="Rewind 10s">
                  <Rewind size={18} />
                </button>
                <button className="v-ctrl sm" onClick={e => { e.stopPropagation(); prevVideo(); }} aria-label="Previous">
                  <SkipBack size={20} />
                </button>
                <button className="v-ctrl main" onClick={e => { e.stopPropagation(); toggleVideo(); }} aria-label="Play/Pause">
                  {isVideoPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button className="v-ctrl sm" onClick={e => { e.stopPropagation(); nextVideo(); }} aria-label="Next">
                  <SkipForward size={20} />
                </button>
                <button className="v-ctrl sm" onClick={e => { e.stopPropagation(); seekVideo(10); }} aria-label="Forward 10s">
                  <FastForward size={18} />
                </button>
              </div>

              <div className="v-bottom">
                <div className="v-progress" onClick={e => { e.stopPropagation(); handleProgressClick(e); }}>
                  <div className="v-prog-fill" style={{ width: `${videoProgress}%` }}>
                    <div className="v-prog-thumb" />
                  </div>
                </div>
                <div className="v-time-row">
                  <span className="v-time">{fmtTime(videoCurrentTime)} / {fmtTime(videoDuration)}</span>
                  <div className="v-sub-ctrls">
                    <button className="v-sub-btn" onClick={e => { e.stopPropagation(); toggleVMute(); }} aria-label="Mute">
                      {videoMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                    <button className="v-sub-btn" onClick={e => { e.stopPropagation(); cycleSpeed(); }} aria-label="Speed">
                      {VIDEO_SPEEDS[videoSpeedIdx]}x
                    </button>
                    <button className="v-sub-btn" onClick={e => { e.stopPropagation(); handleFullscreen(); }} aria-label="Fullscreen">
                      <Maximize2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="v-info-bar">
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 }}>
              {curFile.name.replace(/\.[^/.]+$/, "")}
            </div>
            <div className="v-info-row">
              <span>{fmtBytes(curFile.size)}</span>
              <span>{curVideoIdx + 1} of {videoFiles.length}</span>
              {videoPositions[curFile.name] ? <span>Saved: {fmtTime(videoPositions[curFile.name])}</span> : null}
            </div>
          </div>

          <div className="v-queue">
            {videoFiles.map((f, i) => (
              <div key={f.name} className={`q-item${i === curVideoIdx ? " active" : ""}`}
                onClick={() => loadVideo(i)}>
                <div className="q-num">{i === curVideoIdx ? "▶" : i + 1}</div>
                <div className="q-icon" style={{ background: getGradient(i) }}>
                  <Film size={15} color="white" />
                </div>
                <div className="q-info">
                  <div className="q-name">{f.name.replace(/\.[^/.]+$/, "")}</div>
                  <div className="q-meta">{fmtBytes(f.size)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <Film size={48} color="#5c6b8a" />
          <h3>No video loaded</h3>
          <p>Upload a video file or select one from your library</p>
          <button className="empty-btn" onClick={() => goPage("upload")}>Upload Video</button>
        </div>
      )}
    </div>
  );
}
