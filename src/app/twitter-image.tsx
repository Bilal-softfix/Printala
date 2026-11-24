import { ImageResponse } from "next/og";

export const alt = "Printala — Premium Posters & Split Wall Art";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#111827",
          color: "#FAFAFA",
        }}
      >
        <div style={{ display: "flex", fontSize: 132, fontWeight: 800, letterSpacing: "-0.05em" }}>
          Printala<span style={{ color: "#E10F80" }}>.</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 44, opacity: 0.85 }}>
          Premium posters &amp; split wall art
        </div>
        <div style={{ marginTop: 16, fontSize: 30, color: "#E10F80" }}>
          Anime · Gaming · Cricket · Cars · Movies — made in India
        </div>
      </div>
    ),
    size,
  );
}
