import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pokéfans: the Pokémon field guide",
    short_name: "Pokéfans",
    description: "Every Pokémon, move, ability and type in one fast field guide.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafb",
    theme_color: "#e2342e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
