import { ImageResponse } from "next/og";

export const alt = "Al Ponte — boutique hotel above Lake Lugano, Ticino";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded, self-contained OG card (no external image fetch). Auto-wired by
// Next into openGraph.images / twitter.images for every route below app/.
export default function OpengraphImage() {
  const forest = "#1f3d2b";
  const paper = "#fafaf7";
  const gold = "#c8a24a";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: forest,
          color: paper,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 64,
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: gold,
          }}
        >
          Cademario · Ticino · Switzerland
        </div>

        <div style={{ display: "flex", fontSize: 132, lineHeight: 1 }}>
          Al Ponte
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 40,
            color: "rgba(250,250,247,0.85)",
          }}
        >
          Boutique Hotel · Lago di Lugano
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 56,
            width: 96,
            height: 3,
            background: gold,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
