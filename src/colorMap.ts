export type Accent = { base: string; soft: string; hover: string };

export const getAccent = (accentId: string, theme: any): Accent => {
  const map = theme.accents as Record<string, Accent>;
  return map[accentId] ?? map.default;
};
