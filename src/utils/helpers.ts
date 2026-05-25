export function fmtTime(s: number): string {
  if (!s || isNaN(s)) return "0:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function fmtBytes(b: number): string {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  if (b < 1024 * 1024 * 1024) return (b / (1024 * 1024)).toFixed(1) + " MB";
  return (b / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
  if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
  return Math.floor(diff / 86400000) + "d ago";
}

export const GRADIENTS = [
  "linear-gradient(135deg,#5b6af5,#00cfff)",
  "linear-gradient(135deg,#ff3d9a,#5b6af5)",
  "linear-gradient(135deg,#ffa94d,#ff3d9a)",
  "linear-gradient(135deg,#2ecc91,#00cfff)",
  "linear-gradient(135deg,#5b6af5,#ff3d9a)",
  "linear-gradient(135deg,#00cfff,#2ecc91)",
  "linear-gradient(135deg,#ff3d9a,#ffa94d)",
  "linear-gradient(135deg,#ffa94d,#5b6af5)",
];

export function getGradient(i: number) {
  return GRADIENTS[i % GRADIENTS.length];
}
