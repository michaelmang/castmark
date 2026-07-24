import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#e2b04f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#16130a",
              display: "flex",
            }}
          >
            C
          </span>
        </div>
        <span
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#f5f5f4",
            letterSpacing: -2,
            display: "flex",
          }}
        >
          Castmark
        </span>
        <span
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "#a3a3a0",
            display: "flex",
          }}
        >
          One sponsor link. Every episode, forever.
        </span>
      </div>
    ),
    { ...size },
  );
}
