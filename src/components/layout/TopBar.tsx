import { usePlayer } from "@/context/PlayerContext";
import { Menu, Search, Bell, Music, Film } from "@/components/Icons";

const PAGE_TITLES: Record<string, string> = {
  home: "FLUX",
  video: "Video Player",
  music: "Music Player",
  "video-library": "Video Library",
  "audio-library": "Audio Library",
  upload: "Upload",
  schedule: "Schedule",
  playlists: "Playlists",
  equalizer: "Equalizer",
  recent: "History",
  settings: "Settings",
  discover: "Discover",
};

export default function TopBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const { currentPage, goPage, curAudioIdx, isAudioPlaying } = usePlayer();

  return (
    <div className="topbar">
      <button className="ham-btn" onClick={onMenuOpen} aria-label="Menu">
        <span /><span /><span />
      </button>
      <div className="topbar-title">{PAGE_TITLES[currentPage] || "FLUX"}</div>
      <div className="topbar-actions">
        <button className="t-btn" onClick={() => goPage("discover")} aria-label="Discover">
          <Search size={16} />
        </button>
        <button className="t-btn" onClick={() => goPage("schedule")} aria-label="Schedule">
          <Bell size={16} />
        </button>
        {curAudioIdx >= 0 && (
          <button
            className="t-btn music"
            onClick={() => goPage("music")}
            aria-label="Now Playing"
          >
            {isAudioPlaying ? <Music size={16} /> : <Music size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
