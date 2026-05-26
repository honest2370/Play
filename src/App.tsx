import { useState, useEffect } from "react";
import { PlayerProvider, usePlayer } from "@/context/PlayerContext.tsx";
import TopBar from "@/components/layout/TopBar.tsx";
import BottomNav from "@/components/layout/BottomNav.tsx";
import Sidebar from "@/components/layout/Sidebar.tsx";
import MiniBar from "@/components/layout/MiniBar.tsx";
import Home from "@/pages/Home.tsx";
import VideoPlayer from "@/pages/VideoPlayer.tsx";
import MusicPlayer from "@/pages/MusicPlayer.tsx";
import VideoLibrary from "@/pages/VideoLibrary.tsx";
import AudioLibrary from "@/pages/AudioLibrary.tsx";
import UploadPage from "@/pages/Upload.tsx";
import Schedule from "@/pages/Schedule.tsx";
import Playlists from "@/pages/Playlists.tsx";
import Equalizer from "@/pages/Equalizer.tsx";
import Recent from "@/pages/Recent.tsx";
import Settings from "@/pages/Settings.tsx";
import Discover from "@/pages/Discover.tsx";

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
