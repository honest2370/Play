import { useState, useEffect } from "react";
import { PlayerProvider, usePlayer } from "@/context/PlayerContext";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";
import MiniBar from "@/components/layout/MiniBar";
import Home from "@/pages/Home";
import VideoPlayer from "@/pages/VideoPlayer";
import MusicPlayer from "@/pages/MusicPlayer";
import VideoLibrary from "@/pages/VideoLibrary";
import AudioLibrary from "@/pages/AudioLibrary";
import UploadPage from "@/pages/Upload";
import Schedule from "@/pages/Schedule";
import Playlists from "@/pages/Playlists";
import Equalizer from "@/pages/Equalizer";
import Recent from "@/pages/Recent";
import Settings from "@/pages/Settings";
import Discover from "@/pages/Discover";

function AppInner() {
  const { currentPage, toastMsg, toastVisible } = usePlayer();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on page nav via keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      <div className="nebula" />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <TopBar onMenuOpen={() => setSidebarOpen(true)} />

      <div className="pages">
        <div className={`page${currentPage === "home" ? " active" : ""}`}>
          <Home />
        </div>
        <div className={`page${currentPage === "video" ? " active" : ""}`}>
          <VideoPlayer />
        </div>
        <div className={`page${currentPage === "music" ? " active" : ""}`}>
          <MusicPlayer />
        </div>
        <div className={`page${currentPage === "video-library" ? " active" : ""}`}>
          <VideoLibrary />
        </div>
        <div className={`page${currentPage === "audio-library" ? " active" : ""}`}>
          <AudioLibrary />
        </div>
        <div className={`page${currentPage === "upload" ? " active" : ""}`}>
          <UploadPage />
        </div>
        <div className={`page${currentPage === "schedule" ? " active" : ""}`}>
          <Schedule />
        </div>
        <div className={`page${currentPage === "playlists" ? " active" : ""}`}>
          <Playlists />
        </div>
        <div className={`page${currentPage === "equalizer" ? " active" : ""}`}>
          <Equalizer />
        </div>
        <div className={`page${currentPage === "recent" ? " active" : ""}`}>
          <Recent />
        </div>
        <div className={`page${currentPage === "settings" ? " active" : ""}`}>
          <Settings />
        </div>
        <div className={`page${currentPage === "discover" ? " active" : ""}`}>
          <Discover />
        </div>
      </div>

      <MiniBar />
      <BottomNav />

      {/* Toast */}
      <div className={`toast${toastVisible ? " show" : ""}`}>
        {toastMsg}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppInner />
    </PlayerProvider>
  );
}
