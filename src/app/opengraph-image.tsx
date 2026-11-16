import { ImageResponse } from "next/og";
import { artworkSourceUrl } from "@/lib/pokemon";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Pokéfans: every Pokémon in one field guide";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #fff1ee 0%, #ffffff 50%, #eef6ff 100%)",
          fontFamily: "sans-serif",
          color: "#16181d",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 34, fontWeight: 600, color: "#e2342e" }}>Pokéfans</div>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1, marginTop: 16 }}>
            Every Pokémon.
          </div>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1, color: "#8a8f99" }}>
            One field guide.
          </div>
        </div>
        <div style={{ display: "flex", position: "relative", width: 460, height: 460 }}>
          {[
            { id: 1, left: 0, top: 170, size: 260 },
            { id: 7, left: 210, top: 180, size: 250 },
            { id: 4, left: 90, top: 0, size: 300 },
          ].map((p) => (
            // eslint-disable-next-line @next/next/no-img-element -- rendered by Satori
            <img
              key={p.id}
              src={artworkSourceUrl(p.id)}
              width={p.size}
              height={p.size}
              alt=""
              style={{ position: "absolute", left: p.left, top: p.top }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
