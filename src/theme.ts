import { DefaultTheme } from "styled-components";

export const theme:DefaultTheme = {
  bgA: "#F6F1E7",
  bgB: "#FFFDF8",
  text: "#4E4A42",
  subText: "#7B756B",
  boardBg: "#FFFFFF",
  boardBorder: "#E8E3D9",
  cardBg: "#FFFFFF",
  cardBorder: "#EEE7DB",
  rBoard: "18px",
  rCard: "14px",
  shBoard: "0 12px 28px rgba(0,0,0,0.06)",
  shCard: "0 8px 18px rgba(0,0,0,0.08)",
  accents: {
    a: { id: "a", base: "#E06C9F", soft: "rgba(224,108,159,.12)", hover: "#CD5A8F" },
    b: { id: "b", base: "#6AA84F", soft: "rgba(106,168,79,.12)", hover: "#5D9846" },
    c: { id: "c", base: "#F2B400", soft: "rgba(242,180,0,.14)", hover: "#DCA300" },
    d: { id: "d", base: "#4FC3F7", soft: "rgba(79,195,247,.14)", hover: "#41B4E8" },
    e: { id: "e", base: "#B58CE6", soft:"rgba(181,140,230,.14)",  hover:"#A377D1"},
  },
};

export const accentOptions = [
  { id: "a",   base: "#E06C9F", soft: "rgba(224,108,159,.12)", hover:"#CD5A8F" },
  { id: "b",  base: "#6AA84F", soft: "rgba(106,168,79,.12)",   hover:"#5D9846" },
  { id: "c", base: "#F2B400", soft: "rgba(242,180,0,.14)",   hover:"#DCA300" },
  { id: "d",    base: "#5CAFF9", soft: "rgba(92,175,249,.14)",  hover:"#4A9CE8" },
  { id: "e", base: "#B58CE6", soft:"rgba(181,140,230,.14)",  hover:"#A377D1" },
];