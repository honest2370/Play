import { useRef, useState } from "react";
import { usePlayer, MediaFile } from "@/context/PlayerContext.tsx";
import { Film, Music, Upload as UploadIcon, X } from "@/components/Icons.tsx";
import { fmtBytes, getGradient } from "@/utils/helpers.ts";

type Tab = "video" | "audio";

export default function UploadPage() {
  const { videoFiles, audioFiles, setVideoFiles, setAudioFiles, removeVideo, removeAudio, toast } = usePlayer();
  const [tab, setTab] = useState<Tab>("video");
  const [videoDrag, setVideoDrag] = useState(false);
  const [audioDrag, setAudioDrag] = useState(false);
  const vInputRef = useRef<HTMLInputElement>(null);
  const aInputRef = useRef<HTMLInputElement>(null);

  const handleVideoFiles = (files: FileList | null) => {
    if (!files) return;
    const added: MediaFile[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("video/") && !f.name.match(/\.(mp4|mkv|avi|mov|webm|wmv|flv|m4v)$/i)) continue;
      if (videoFiles.find(x => x.name === f.name)) continue;
      added.push({ name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f) });
    }
    if (added.length) {
      setVideoFiles(prev => [...prev, ...added]);
      toast(`${added.length} video${added.length > 1 ? "s" : ""} added`);
    } else {
      toast("No valid video files found");
    }
  };

  const handleAudioFiles = (files: FileList | null) => {
    if (!files) return;
    const added: MediaFile[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("audio/") && !f.name.match(/\.(mp3|wav|ogg|m4a|aac|flac|opus|wma)$/i)) continue;
      if (audioFiles.find(x => x.name === f.name)) continue;
      added.push({ name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f) });
    }
    if (added.length) {
      setAudioFiles(prev => [...prev, ...added]);
      toast(`${added.length} audio file${added.length > 1 ? "s" : ""} added`);
    } else {
      toast("No valid audio files found");
    }
  };

  return (
    <div className="page-scroll">
      <div className="upload-tabs">
        <button className={`upload-tab${tab === "video" ? " active" : ""}`} onClick={() => setTab("video")}>
          Video
        </button>
        <button className={`upload-tab${tab === "audio" ? " active" : ""}`} onClick={() => setTab("audio")}>
          Audio
        </button>
      </div>

      {tab === "video" ? (
        <>
          <div
            className={`drop-zone${videoDrag ? " drag" : ""}`}
            onDragOver={e => { e.preventDefault(); setVideoDrag(true); }}
            onDragLeave={() => setVideoDrag(false)}
            onDrop={e => { e.preventDefault(); setVideoDrag(false); handleVideoFiles(e.dataTransfer.files); }}
            onClick={() => vInputRef.current?.click()}
          >
            <input
              ref={vInputRef}
              type="file"
              accept="video/*,.mkv"
              multiple
              style={{ display: "none" }}
              onChange={e => handleVideoFiles(e.target.files)}
            />
            <div className="drop-icon">
              <Film size={48} />
            </div>
            <div className="drop-title">Drop videos here</div>
            <div className="drop-sub">
              Supports MP4, MKV, AVI, MOV, WebM and more<br />
              Drag & drop or click to browse
            </div>
            <button className="drop-btn" onClick={e => { e.stopPropagation(); vInputRef.current?.click(); }}>
              Browse Files
            </button>
          </div>

          {videoFiles.length > 0 && (
            <>
              <div className="sec-header">
                <span className="sec-title">Uploaded Videos ({videoFiles.length})</span>
              </div>
              <div className="uploaded-list">
                {videoFiles.map((f, i) => (
                  <div key={f.name} className="ul-item">
                    <div className="ul-icon" style={{ background: getGradient(i) }}>
                      <Film size={16} color="white" />
                    </div>
                    <div className="ul-info">
                      <div className="ul-name">{f.name}</div>
                      <div className="ul-size">{fmtBytes(f.size)}</div>
                    </div>
                    <button className="ul-remove" onClick={() => removeVideo(i)} aria-label="Remove">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div
            className={`drop-zone${audioDrag ? " drag" : ""}`}
            onDragOver={e => { e.preventDefault(); setAudioDrag(true); }}
            onDragLeave={() => setAudioDrag(false)}
            onDrop={e => { e.preventDefault(); setAudioDrag(false); handleAudioFiles(e.dataTransfer.files); }}
            onClick={() => aInputRef.current?.click()}
          >
            <input
              ref={aInputRef}
              type="file"
              accept="audio/*"
              multiple
              style={{ display: "none" }}
              onChange={e => handleAudioFiles(e.target.files)}
            />
            <div className="drop-icon">
              <Music size={48} />
            </div>
            <div className="drop-title">Drop audio here</div>
            <div className="drop-sub">
              Supports MP3, WAV, OGG, M4A, FLAC and more<br />
              Drag & drop or click to browse
            </div>
            <button className="drop-btn" onClick={e => { e.stopPropagation(); aInputRef.current?.click(); }}>
              Browse Files
            </button>
          </div>

          {audioFiles.length > 0 && (
            <>
              <div className="sec-header">
                <span className="sec-title">Uploaded Audio ({audioFiles.length})</span>
              </div>
              <div className="uploaded-list">
                {audioFiles.map((f, i) => (
                  <div key={f.name} className="ul-item">
                    <div className="ul-icon" style={{ background: getGradient(i) }}>
                      <Music size={16} color="white" />
                    </div>
                    <div className="ul-info">
                      <div className="ul-name">{f.name}</div>
                      <div className="ul-size">{fmtBytes(f.size)}</div>
                    </div>
                    <button className="ul-remove" onClick={() => removeAudio(i)} aria-label="Remove">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
