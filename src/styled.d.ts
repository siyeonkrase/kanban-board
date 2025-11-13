import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
  bgA: string,
  bgB: string,
  text: string,
  subText: string,
  boardBg: string,
  boardBorder: string,
  cardBg: string,
  cardBorder: string,
  rBoard: string,
  rCard: string,
  shBoard: string,
  shCard: string,
  accents: {
    a:    { id: string; base: string, soft: string, hover: string },
    b:    { id: string; base: string, soft: string,  hover: string },
    c:    { id: string; base: string, soft: string,   hover: string },
    d:    { id: string; base: string, soft: string,   hover: string },
    e:    { id: string; base: string, soft: string,   hover: string },
  },
  }
}