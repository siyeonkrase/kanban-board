import { atom } from "jotai";

export interface IToDo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: IToDo[];
}

export const toDoState = atom<IToDoState>({
  "To Do": [],
  Doing: [],
  Done: [],
});