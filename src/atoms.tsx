import { atom } from "jotai";

export const minuteState = atom(0);

export const hourState = atom(
  (get) => get(minuteState) / 60,
  (get, set, newValue: number) => {
    set(minuteState, newValue * 60);
  }
);                                                                                                             