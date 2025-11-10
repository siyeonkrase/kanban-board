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
    a:    { base: string, soft: string, hover: string },
    b:    { base: string, soft: string,  hover: string },
    c:    { base: string, soft: string,   hover: string },
    d:    { base: string, soft: string,   hover: string },
  },
  }
}