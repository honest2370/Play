import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";

export interface MediaFile {
  name: string;
  size: number;
  type: string;
  url: string;
  liked?: boolean;
}

export interface RecentItem {
  name: string;
  size: number;
  type: "video" | "audio";
  idx: number;
  ts: number;
}

export interface Schedule {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "video" | "audio";
  notes: string;
}

export interface Playlist {
  id: number;
  name: string;
  items: number[];
}

export type Page =
  | "home"
  | "video"
  | "music"
  | "video-library"
  | "audio-library"
  | "upload"
  | "schedule"
  | "playlists"
  | "equalizer"
  | "recent"
  | "settings"
  | "discover";

interface PlayerContextType {
  // Files
  videoFiles: MediaFile[];
  audioFiles: MediaFile[];
  setVideoFiles: React.Dispatch<React.SetStateAction<MediaFile[]>>;
  setAudioFiles: React.Dispatch<React.SetStateAction<MediaFile[]>>;

  // Video state
  curVideoIdx: number;
  isVideoPlaying: boolean;
  videoProgress: number;
  videoDuration: number;
  videoCurrentTime: number;
  videoPositions: Record<string, number>;
  videoSpeedIdx: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  loadVideo: (idx: number) => void;
  toggleVideo: () => void;
  seekVideo: (s: number) => void;
  seekVideoTo: (pct: number) => void;
  prevVideo: () => void;
  nextVideo: () => void;
  cycleSpeed: () => void;
  toggleVMute: () => void;
  videoMuted: boolean;

  // Audio state
  curAudioIdx: number;
  isAudioPlaying: boolean;
  audioProgress: number;
  audioDuration: number;
  audioCurrentTime: number;
  audioPositions: Record<string, number>;
  audioVolume: number;
  audioShuffle: boolean;
  audioRepeat: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  loadAudio: (idx: number) => void;
  toggleAudio: () => void;
  prevAudio: () => void;
  nextAudio: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: () => void;
  seekAudioTo: (pct: number) => void;
  setAudioVol: (v: number) => void;

  // Recent
  recentPlays: RecentItem[];
  clearRecent: () => void;

  // Schedules
  schedules: Schedule[];
  addSchedule: (s: Omit<Schedule, "id">) => void;
  removeSchedule: (id: number) => void;

  // Playlists
  playlists: Playlist[];
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: number) => void;

  // Settings
  settings: Record<string, boolean>;
  toggleSetting: (key: string) => void;

  // EQ
  eqBands: number[];
  setEqBand: (idx: number, val: number) => void;
  eqPreset: string;
  setEqPreset: (preset: string) => void;

  // Navigation
  currentPage: Page;
  goPage: (p: Page) => void;
  removeVideo: (idx: number) => void;
  removeAudio: (idx: number) => void;

  // Toast
  toast: (msg: string) => void;
  toastMsg: string;
  toastVisible: boolean;
}

const PlayerContext = createContext<PlayerContextType>(null!);

export function usePlayer() {
  return useContext(PlayerContext);
}

const VIDEO_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const EQ_PRESET_VALUES: Record<string, number[]> = {
  Flat: [0, 0, 0, 0, 0, 0, 0, 0],
  Rock: [4, 3, -1, -2, 0, 2, 4, 4],
  Pop: [-1, 2, 4, 4, 2, 0, -1, -1],
  Jazz: [3, 2, 1, 2, -2, -1, 2, 3],
  Bass: [8, 6, 4, 2, 0, 0, 0, 0],
  Treble: [0, 0, 0, 0, 2, 4, 6, 8],
  Classical: [4, 3, -2, -3, 0, 2, 3, 4],
  Custom: [0, 0, 0, 0, 0, 0, 0, 0],
};

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [videoFiles, setVideoFiles] = useState<MediaFile[]>([]);
  const [audioFiles, setAudioFiles] = useState<MediaFile[]>([]);
  const [curVideoIdx, setCurVideoIdx] = useState(-1);
  const [curAudioIdx, setCurAudioIdx] = useState(-1);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [videoPositions, setVideoPositions] = useState<Record<string, number>>({});
  const [audioPositions, setAudioPositions] = useState<Record<string, number>>({});
  const [audioVolume, setAudioVolumeState] = useState(1);
  const [audioShuffle, setAudioShuffle] = useState(false);
  const [audioRepeat, setAudioRepeat] = useState(false);
  const [videoSpeedIdx, setVideoSpeedIdx] = useState(2);
  const [videoMuted, setVideoMuted] = useState(false);
  const [recentPlays, setRecentPlays] = useState<RecentItem[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [settings, setSettings] = useState<Record<string, boolean>>({
    resume: true,
    loop: false,
    autoplay: true,
    notifications: true,
    hq: true,
    darkMode: true,
  });
  const [eqBands, setEqBands] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [eqPreset, setEqPresetState] = useState("Flat");
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const goPage = useCallback((p: Page) => setCurrentPage(p), []);

  const addRecent = useCallback((item: Omit<RecentItem, "ts">) => {
    setRecentPlays(prev => {
      const filtered = prev.filter(r => r.name !== item.name);
      return [{ ...item, ts: Date.now() }, ...filtered].slice(0, 50);
    });
  }, []);

  // Video
  const loadVideo = useCallback((idx: number) => {
    const f = videoFiles[idx];
    if (!f || !videoRef.current) return;
    setCurVideoIdx(idx);
    const v = videoRef.current;
    v.src = f.url;
    v.load();
    const savedPos = videoPositions[f.name];
    if (savedPos && settings.resume) {
      v.addEventListener("loadedmetadata", function handler() {
        v.currentTime = savedPos;
        v.removeEventListener("loadedmetadata", handler);
      }, { once: true });
    }
    v.play().catch(() => {});
    setIsVideoPlaying(true);
    addRecent({ name: f.name.replace(/\.[^/.]+$/, ""), size: f.size, type: "video", idx });
    goPage("video");
  }, [videoFiles, videoPositions, settings.resume, addRecent, goPage]);

  const toggleVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isVideoPlaying) { v.pause(); setIsVideoPlaying(false); }
    else { v.play().catch(() => {}); setIsVideoPlaying(true); }
  }, [isVideoPlaying]);

  const seekVideo = useCallback((s: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + s));
  }, []);

  const seekVideoTo = useCallback((pct: number) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    v.currentTime = pct * v.duration;
  }, []);

  const prevVideo = useCallback(() => {
    if (curVideoIdx > 0) loadVideo(curVideoIdx - 1);
  }, [curVideoIdx, loadVideo]);

  const nextVideo = useCallback(() => {
    if (curVideoIdx < videoFiles.length - 1) loadVideo(curVideoIdx + 1);
    else if (settings.loop && videoFiles.length > 0) loadVideo(0);
  }, [curVideoIdx, videoFiles, settings.loop, loadVideo]);

  const cycleSpeed = useCallback(() => {
    const newIdx = (videoSpeedIdx + 1) % VIDEO_SPEEDS.length;
    setVideoSpeedIdx(newIdx);
    if (videoRef.current) videoRef.current.playbackRate = VIDEO_SPEEDS[newIdx];
    toast(`Speed: ${VIDEO_SPEEDS[newIdx]}x`);
  }, [videoSpeedIdx, toast]);

  const toggleVMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setVideoMuted(v.muted);
  }, []);

  const removeVideo = useCallback((i: number) => {
    setVideoFiles(prev => {
      const arr = [...prev];
      if (i === curVideoIdx && videoRef.current) {
        videoRef.current.src = "";
        setIsVideoPlaying(false);
        setCurVideoIdx(-1);
      } else if (i < curVideoIdx) {
        setCurVideoIdx(c => c - 1);
      }
      URL.revokeObjectURL(arr[i].url);
      arr.splice(i, 1);
      return arr;
    });
    toast("Video removed");
  }, [curVideoIdx, toast]);

  // Audio
  const loadAudio = useCallback((idx: number) => {
    const f = audioFiles[idx];
    if (!f || !audioRef.current) return;
    setCurAudioIdx(idx);
    const a = audioRef.current;
    a.src = f.url;
    a.load();
    const savedPos = audioPositions[f.name];
    if (savedPos && settings.resume) {
      a.addEventListener("loadedmetadata", function handler() {
        a.currentTime = savedPos;
        a.removeEventListener("loadedmetadata", handler);
      }, { once: true });
    }
    a.play().catch(() => {});
    setIsAudioPlaying(true);
    addRecent({ name: f.name.replace(/\.[^/.]+$/, ""), size: f.size, type: "audio", idx });
  }, [audioFiles, audioPositions, settings.resume, addRecent]);

  const toggleAudio = useCallback(() => {
    if (audioFiles.length === 0) { goPage("upload"); return; }
    if (curAudioIdx < 0) { loadAudio(0); return; }
    const a = audioRef.current;
    if (!a) return;
    if (isAudioPlaying) { a.pause(); setIsAudioPlaying(false); }
    else { a.play().catch(() => {}); setIsAudioPlaying(true); }
  }, [audioFiles, curAudioIdx, isAudioPlaying, loadAudio, goPage]);

  const prevAudio = useCallback(() => {
    if (curAudioIdx > 0) loadAudio(curAudioIdx - 1);
    else if (audioFiles.length > 0) loadAudio(audioFiles.length - 1);
  }, [curAudioIdx, audioFiles, loadAudio]);

  const nextAudio = useCallback(() => {
    if (audioFiles.length === 0) return;
    if (audioShuffle) { loadAudio(Math.floor(Math.random() * audioFiles.length)); return; }
    if (audioRepeat && audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => {}); return; }
    if (curAudioIdx < audioFiles.length - 1) loadAudio(curAudioIdx + 1);
    else if (settings.loop) loadAudio(0);
    else setIsAudioPlaying(false);
  }, [audioFiles, curAudioIdx, audioShuffle, audioRepeat, settings.loop, loadAudio]);

  const toggleShuffle = useCallback(() => {
    setAudioShuffle(s => !s);
    toast("Shuffle toggled");
  }, [toast]);

  const toggleRepeat = useCallback(() => {
    setAudioRepeat(r => !r);
    toast("Repeat toggled");
  }, [toast]);

  const toggleLike = useCallback(() => {
    if (curAudioIdx < 0) return;
    setAudioFiles(prev => {
      const arr = [...prev];
      arr[curAudioIdx] = { ...arr[curAudioIdx], liked: !arr[curAudioIdx].liked };
      return arr;
    });
  }, [curAudioIdx]);

  const seekAudioTo = useCallback((pct: number) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    a.currentTime = pct * a.duration;
  }, []);

  const setAudioVol = useCallback((v: number) => {
    const vol = Math.max(0, Math.min(1, v));
    setAudioVolumeState(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  }, []);

  const removeAudio = useCallback((i: number) => {
    setAudioFiles(prev => {
      const arr = [...prev];
      if (i === curAudioIdx && audioRef.current) {
        audioRef.current.src = "";
        setIsAudioPlaying(false);
        setCurAudioIdx(-1);
      } else if (i < curAudioIdx) {
        setCurAudioIdx(c => c - 1);
      }
      URL.revokeObjectURL(arr[i].url);
      arr.splice(i, 1);
      return arr;
    });
    toast("Audio removed");
  }, [curAudioIdx, toast]);

  const clearRecent = useCallback(() => {
    setRecentPlays([]);
    toast("History cleared");
  }, [toast]);

  const addSchedule = useCallback((s: Omit<Schedule, "id">) => {
    setSchedules(prev => [...prev, { ...s, id: Date.now() }].sort(
      (a, b) => new Date(a.date + "T" + a.time).getTime() - new Date(b.date + "T" + b.time).getTime()
    ));
    toast("Scheduled: " + s.title);
  }, [toast]);

  const removeSchedule = useCallback((id: number) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast("Schedule removed");
  }, [toast]);

  const createPlaylist = useCallback((name: string) => {
    setPlaylists(prev => [...prev, { id: Date.now(), name, items: [] }]);
    toast("Playlist created");
  }, [toast]);

  const deletePlaylist = useCallback((id: number) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    toast("Playlist deleted");
  }, [toast]);

  const toggleSetting = useCallback((key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const setEqBand = useCallback((idx: number, val: number) => {
    setEqBands(prev => {
      const arr = [...prev];
      arr[idx] = val;
      return arr;
    });
    setEqPresetState("Custom");
  }, []);

  const setEqPreset = useCallback((preset: string) => {
    setEqPresetState(preset);
    const vals = EQ_PRESET_VALUES[preset];
    if (vals) setEqBands([...vals]);
    toast(`Preset: ${preset}`);
  }, [toast]);

  // Video events
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (!v.duration) return;
      setVideoProgress(v.currentTime / v.duration * 100);
      setVideoCurrentTime(v.currentTime);
      setVideoDuration(v.duration);
      if (curVideoIdx >= 0 && videoFiles[curVideoIdx]) {
        setVideoPositions(p => ({ ...p, [videoFiles[curVideoIdx].name]: v.currentTime }));
      }
    };
    const onEnded = () => { setIsVideoPlaying(false); nextVideo(); };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    v.addEventListener("loadedmetadata", () => setVideoDuration(v.duration));
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
    };
  }, [curVideoIdx, videoFiles, nextVideo]);

  // Audio events
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      if (!a.duration) return;
      setAudioProgress(a.currentTime / a.duration * 100);
      setAudioCurrentTime(a.currentTime);
      setAudioDuration(a.duration);
      if (curAudioIdx >= 0 && audioFiles[curAudioIdx]) {
        setAudioPositions(p => ({ ...p, [audioFiles[curAudioIdx].name]: a.currentTime }));
      }
    };
    const onEnded = () => nextAudio();
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
    };
  }, [curAudioIdx, audioFiles, nextAudio]);

  return (
    <PlayerContext.Provider value={{
      videoFiles, audioFiles, setVideoFiles, setAudioFiles,
      curVideoIdx, isVideoPlaying, videoProgress, videoDuration, videoCurrentTime,
      videoPositions, videoSpeedIdx, videoRef, videoMuted,
      loadVideo, toggleVideo, seekVideo, seekVideoTo, prevVideo, nextVideo, cycleSpeed, toggleVMute,
      curAudioIdx, isAudioPlaying, audioProgress, audioDuration, audioCurrentTime,
      audioPositions, audioVolume, audioShuffle, audioRepeat, audioRef,
      loadAudio, toggleAudio, prevAudio, nextAudio, toggleShuffle, toggleRepeat,
      toggleLike, seekAudioTo, setAudioVol,
      recentPlays, clearRecent,
      schedules, addSchedule, removeSchedule,
      playlists, createPlaylist, deletePlaylist,
      settings, toggleSetting,
      eqBands, setEqBand, eqPreset, setEqPreset,
      currentPage, goPage,
      removeVideo, removeAudio,
      toast, toastMsg, toastVisible,
    }}>
      <video ref={videoRef as React.RefObject<HTMLVideoElement>} style={{ display: "none" }} />
      <audio ref={audioRef as React.RefObject<HTMLAudioElement>} style={{ display: "none" }} />
      {children}
    </PlayerContext.Provider>
  );
}
