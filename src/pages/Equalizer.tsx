import { usePlayer } from "@/context/PlayerContext.tsx";
import { Sliders } from "@/components/Icons.tsx";

const EQ_LABELS = ["32Hz", "64Hz", "125Hz", "250Hz", "500Hz", "1kHz", "4kHz", "16kHz"];
const EQ_PRESETS = ["Flat", "Rock", "Pop", "Jazz", "Bass", "Treble", "Classical", "Custom"];

export default function Equalizer() {
  const { eqBands, setEqBand, eqPreset, setEqPreset } = usePlayer();

  return (
    <div className="page-scroll">
      <div className="eq-wrap" style={{ padding: 0 }}>
        <div className="sec-header">
          <span className="sec-title">Presets</span>
        </div>
        <div className="eq-preset-list">
          {EQ_PRESETS.map(p => (
            <button
              key={p}
              className={`eq-preset${eqPreset === p ? " active" : ""}`}
              onClick={() => setEqPreset(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="sec-header">
          <span className="sec-title">Bands</span>
          <span style={{ fontSize: 12, color: "var(--muted2)" }}>
            {eqPreset}
          </span>
        </div>

        <div className="eq-bands">
          {eqBands.map((val, i) => (
            <div key={EQ_LABELS[i]} className="eq-band">
              <div className="eq-val">{val > 0 ? "+" : ""}{val}dB</div>
              <div className="eq-slider-wrap">
                <input
                  type="range"
                  className="eq-slider"
                  min={-12}
                  max={12}
                  step={1}
                  value={val}
                  onChange={e => setEqBand(i, Number(e.target.value))}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="eq-label">{EQ_LABELS[i]}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 20,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 16,
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <Sliders size={20} color="var(--accent2)" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Note</div>
            <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 2 }}>
              Equalizer settings are saved automatically and applied to audio playback.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
