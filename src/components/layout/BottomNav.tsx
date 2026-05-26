import { usePlayer, Page } from "@/context/PlayerContext.tsx";
import { Home, Film, Music, Upload, MoreHorizontal } from "@/components/Icons.tsx";

const NAV_ITEMS: { page: Page; label: string; Icon: React.FC<{ size: number }> }[] = [
  { page: "home", label: "Home", Icon: Home },
  { page: "video-library", label: "Videos", Icon: Film },
  { page: "music", label: "Music", Icon: Music },
  { page: "upload", label: "Upload", Icon: Upload },
  { page: "discover", label: "More", Icon: MoreHorizontal },
];

export default function BottomNav() {
  const { currentPage, goPage } = usePlayer();

  return (
    <div className="bottom-nav">
      {NAV_ITEMS.map(({ page, label, Icon }) => (
        <button
          key={page}
          className={`bnav-item${currentPage === page ? " active" : ""}`}
          onClick={() => goPage(page)}
          aria-label={label}
        >
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
