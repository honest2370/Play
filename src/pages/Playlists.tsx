import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { List, Plus, Trash2, Music } from "@/components/Icons";
import { getGradient } from "@/utils/helpers";

export default function Playlists() {
  const { playlists, createPlaylist, deletePlaylist } = usePlayer();
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    createPlaylist(newName.trim());
    setNewName("");
    setShowModal(false);
  };

  return (
    <div className="page-scroll">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px",
            background: "linear-gradient(135deg,var(--accent),var(--accent2))",
            border: "none", borderRadius: 12,
            color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
            boxShadow: "0 0 20px var(--glow)"
          }}
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} /> New Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="empty-state">
          <List size={48} color="#5c6b8a" />
          <h3>No playlists yet</h3>
          <p>Create a playlist to organise your media</p>
          <button className="empty-btn" onClick={() => setShowModal(true)}>Create Playlist</button>
        </div>
      ) : (
        playlists.map((p, i) => (
          <div key={p.id} className="pl-item">
            <div className="pl-cover" style={{ background: getGradient(i) }}>
              <Music size={22} color="white" />
            </div>
            <div className="pl-info">
              <div className="pl-name">{p.name}</div>
              <div className="pl-count">{p.items.length} tracks</div>
            </div>
            <button className="pl-del" onClick={() => deletePlaylist(p.id)} aria-label="Delete playlist">
              <Trash2 size={18} />
            </button>
          </div>
        ))
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">New Playlist</div>
            <input
              className="modal-input"
              placeholder="Playlist name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleCreate(); }}
              autoFocus
            />
            <div className="modal-btns">
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-btn confirm" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
