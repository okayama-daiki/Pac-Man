import { style } from "@vanilla-extract/css";

export const configRoot = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
});

export const itemContainer = style({
  width: "500px",
  padding: "2rem 10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.5rem",
});

export const item = style({
  width: "80%",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
});
