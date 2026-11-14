import { ImageResponse } from "next/og";
import { artworkUrl, formatDexNumber } from "@/lib/pokemon";
import { findPokemon } from "@/lib/pokemon-index";
import { TYPE_HEX } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Pokémon artwork with name, number and types";

/** Link-preview card: artwork on a soft type gradient, name, number, types. */
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = findPokemon(id.toLowerCase());
  const types = p?.types ?? ["normal"];
  const [c1, c2 = c1] = types.map((t) => TYPE_HEX[t] ?? "#A8A77A");
  // Only ever render names from our own index, never raw URL text.
  const name = p ? p.name.replace(/-/g, " ") : "Pokémon";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "64px 72px",
          background: `linear-gradient(135deg, ${c1}33 0%, #ffffff 55%, ${c2}33 100%)`,
          fontFamily: "sans-serif",
          color: "#16181d",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {p && (
            <div style={{ fontSize: 36, color: "#6b6f7a", letterSpacing: 2 }}>
              {formatDexNumber(p.id)}
            </div>
          )}
          <div
            style={{
              fontSize: 112,
              fontWeight: 700,
              letterSpacing: -4,
              textTransform: "capitalize",
              lineHeight: 1,
              marginTop: 8,
            }}
          >
            {name}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
            {types.map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "10px 28px",
                  borderRadius: 999,
                  background: TYPE_HEX[t],
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "auto", fontSize: 30, fontWeight: 600, color: "#e2342e" }}>
            Pokéfans
          </div>
        </div>
        {p && (
          // eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser
          <img src={artworkUrl(p.id)} width={500} height={500} alt="" />
        )}
      </div>
    ),
    size,
  );
}
