import { usePlayer, Page } from "@/context/PlayerContext.tsx";
import {
  X, Home, Film, Music, Upload, Calendar, List, Sliders,
  Clock, Settings, Compass, Play, Pause, SkipForward,
  Headphones, LayoutGrid
} from "@/components/Icons.tsx";
import { fmtBytes } from "@/utils/helpers.ts";

interface SidebarItem {
  page: Page;
  label: string;
  Icon: React.FC<{ size: number }>;
  badge?: string;
}

const MAIN_NAV: SidebarItem[] = [
  { page: "home", label: "Home", Icon: Home },
  { page: "discover", label: "Discover", Icon: Compass },
  { page: "recent", label: "History", Icon: Clock },
];

const MEDIA_NAV: SidebarItem[] = [
  { page: "video-library", label: "Video Library", Icon: Film },
  { page: "audio-library", label: "Audio Library", Icon: Headphones },
  { page: "playlists", label: "Playlists", Icon: List },
];

const TOOLS_NAV: SidebarItem[] = [
  { page: "upload", label: "Upload", Icon: Upload },
  { page: "equalizer", label: "Equalizer", Icon: Sliders },
  { page: "schedule", label: "Schedule", Icon: Calendar },
  { page: "settings", label: "Settings", Icon: Settings },
];

function NavItem({ item, active, onClick }: { item: SidebarItem; active: boolean; onClick: () => void }) {
  const { Icon, label, badge } = item;
  return (
    <div className={`snav-item${active ? " active" : ""}`} onClick={onClick}>
      <div className="snav-icon">
        <Icon size={16} />
      </div>
      {label}
      {badge && <span className="snav-badge">{badge}</span>}
    </div>
  );
}

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { currentPage, goPage, curAudioIdx, audioFiles, isAudioPlaying, toggleAudio, nextAudio } = usePlayer();

  const nav = (page: Page) => { goPage(page); onClose(); };
  const curTrack = curAudioIdx >= 0 ? audioFiles[curAudioIdx] : null;

  return (
    <>
      <div className={`sidebar-overlay${open ? " open" : ""}`} onClick={onClose} />
      <div className={`sidebar${open ? " open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3" fill="white" />
            </svg>
          </div>
          <span className="sidebar-brand">FLUX</span>
          <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
            <X size={14} />
          </button>
        </div>

        <div className="sidebar-nav">
          <div className="snav-section">Main</div>
          {MAIN_NAV.map(item => (
            <NavItem key={item.page} item={item} active={currentPage === item.page} onClick={() => nav(item.page)} />
          ))}

          <div className="snav-section">Media</div>
          {MEDIA_NAV.map(item => (
            <NavItem key={item.page} item={item} active={currentPage === item.page} onClick={() => nav(item.page)} />
          ))}

          <div className="snav-section">Tools</div>
          {TOOLS_NAV.map(item => (
            <NavItem key={item.page} item={item} active={currentPage === item.page} onClick={() => nav(item.page)} />
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="now-playing-mini" onClick={() => nav("music")}>
            <div className="npm-thumb">
              <Music size={16} color="white" />
            </div>
            <div className="npm-info">
              <div className="npm-title">{curTrack ? curTrack.name.replace(/\.[^/.]+$/, "") : "Nothing Playing"}</div>
              <div className="npm-sub">{curTrack ? (isAudioPlaying ? "Now Playing" : "Paused") : "Select a track"}</div>
            </div>
            {curTrack && (
              <button className="npm-ctrl" onClick={e => { e.stopPropagation(); toggleAudio(); }} aria-label="Play/Pause">
                {isAudioPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
