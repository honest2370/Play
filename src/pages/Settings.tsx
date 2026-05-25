import { usePlayer } from "@/context/PlayerContext";
import {
  Clock, Repeat, Play, Bell, Sliders, Moon, Volume2,
  Film, Music, Trash2, Settings as SettingsIcon, Headphones
} from "@/components/Icons";

interface SettingRowProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  desc: string;
  value?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
}

function SettingRow({ icon, iconBg, label, desc, value, onToggle, children }: SettingRowProps) {
  return (
    <div className="set-row">
      <div className="set-icon" style={{ background: iconBg }}>{icon}</div>
      <div className="set-info">
        <div className="set-label">{label}</div>
        <div className="set-desc">{desc}</div>
      </div>
      {children ?? (
        onToggle && (
          <button className={`toggle${value ? " on" : ""}`} onClick={onToggle} aria-label={label} />
        )
      )}
    </div>
  );
}

export default function Settings() {
  const { settings, toggleSetting, videoFiles, audioFiles, setVideoFiles, setAudioFiles, toast } = usePlayer();

  const clearVideos = () => {
    if (!videoFiles.length) return;
    videoFiles.forEach(f => URL.revokeObjectURL(f.url));
    setVideoFiles([]);
    toast("Video library cleared");
  };

  const clearAudio = () => {
    if (!audioFiles.length) return;
    audioFiles.forEach(f => URL.revokeObjectURL(f.url));
    setAudioFiles([]);
    toast("Audio library cleared");
  };

  return (
    <div className="page-scroll">
      <div className="settings-group">
        <div className="sg-header">Playback</div>
        <SettingRow
          icon={<Clock size={16} color="white" />}
          iconBg="linear-gradient(135deg,#5b6af5,#00cfff)"
          label="Resume Playback"
          desc="Resume from where you left off"
          value={settings.resume}
          onToggle={() => toggleSetting("resume")}
        />
        <SettingRow
          icon={<Repeat size={16} color="white" />}
          iconBg="linear-gradient(135deg,#ffa94d,#ff3d9a)"
          label="Loop Playlist"
          desc="Loop playlist when it ends"
          value={settings.loop}
          onToggle={() => toggleSetting("loop")}
        />
        <SettingRow
          icon={<Play size={16} color="white" />}
          iconBg="linear-gradient(135deg,#2ecc91,#00cfff)"
          label="Auto-play Next"
          desc="Automatically play next item"
          value={settings.autoplay}
          onToggle={() => toggleSetting("autoplay")}
        />
      </div>

      <div className="settings-group">
        <div className="sg-header">Audio</div>
        <SettingRow
          icon={<Volume2 size={16} color="white" />}
          iconBg="linear-gradient(135deg,#ff3d9a,#5b6af5)"
          label="High Quality"
          desc="Use higher audio quality when available"
          value={settings.hq}
          onToggle={() => toggleSetting("hq")}
        />
        <SettingRow
          icon={<Headphones size={16} color="white" />}
          iconBg="linear-gradient(135deg,#5b6af5,#ffa94d)"
          label="Crossfade"
          desc="Smooth transitions between tracks"
          value={settings.crossfade}
          onToggle={() => toggleSetting("crossfade")}
        />
      </div>

      <div className="settings-group">
        <div className="sg-header">App</div>
        <SettingRow
          icon={<Bell size={16} color="white" />}
          iconBg="linear-gradient(135deg,#ffa94d,#5b6af5)"
          label="Notifications"
          desc="Schedule and playback alerts"
          value={settings.notifications}
          onToggle={() => toggleSetting("notifications")}
        />
        <SettingRow
          icon={<Moon size={16} color="white" />}
          iconBg="linear-gradient(135deg,#2ecc91,#5b6af5)"
          label="Dark Mode"
          desc="Always use dark theme"
          value={settings.darkMode}
          onToggle={() => toggleSetting("darkMode")}
        />
      </div>

      <div className="settings-group">
        <div className="sg-header">Library</div>
        <SettingRow
          icon={<Film size={16} color="white" />}
          iconBg="linear-gradient(135deg,#5b6af5,#00cfff)"
          label={`Clear Videos (${videoFiles.length} files)`}
          desc="Remove all video files from library"
        >
          <button
            style={{ background: "rgba(255,61,154,.15)", border: "1px solid rgba(255,61,154,.3)", borderRadius: 10, padding: "7px 14px", color: "var(--accent3)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            onClick={clearVideos}
            disabled={!videoFiles.length}
          >
            <Trash2 size={14} /> Clear
          </button>
        </SettingRow>
        <SettingRow
          icon={<Music size={16} color="white" />}
          iconBg="linear-gradient(135deg,#ff3d9a,#5b6af5)"
          label={`Clear Audio (${audioFiles.length} files)`}
          desc="Remove all audio files from library"
        >
          <button
            style={{ background: "rgba(255,61,154,.15)", border: "1px solid rgba(255,61,154,.3)", borderRadius: 10, padding: "7px 14px", color: "var(--accent3)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            onClick={clearAudio}
            disabled={!audioFiles.length}
          >
            <Trash2 size={14} /> Clear
          </button>
        </SettingRow>
      </div>

      <div style={{ textAlign: "center", padding: "20px 0", color: "var(--muted)", fontSize: 12 }}>
        FLUX Media Player v1.0
      </div>
    </div>
  );
}
