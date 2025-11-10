export type Accent = { base: string; soft: string; hover: string };

export const getAccent = (index: number, theme: any): Accent => {
  const palette = [
    theme.accents.a,
    theme.accents.b,
    theme.accents.c,
    theme.accents.d,
  ];

  return palette[index % palette.length] || theme.accents.default;
};
