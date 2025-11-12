import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface IToDo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: IToDo[];
}

export const toDoState = atomWithStorage<IToDoState>("board", {
  Monday: [],
  Tuseday: [],
  Wednesday: [],
  Thursday: [],
});

export const removeToDoAtom = atom(
  null,
  (get, set, { column, index }: { column: string; index: number }) => {
    const board = structuredClone(get(toDoState));
    const list = board[column] ?? (board[column] = []);
    list.splice(index, 1);
    set(toDoState, board);
  }
);

export const resetBoardAtom = atom(null, (_get, set) => {
  set(toDoState, {
    "To Do": [],
    Doing: [],
    Done: [],
  });
});

export const removeBoardAtom = atom(null, (get, set, boardId: string) => {
  const board = structuredClone(get(toDoState));
  if (!board[boardId]) return;
  delete board[boardId];
  set(toDoState, board);
});

const uniqueName = (obj: Record<string, unknown>, base: string) => {
  if (!obj[base]) return base;
  let i = 1;
  while (obj[`${base} (${i})`]) i++;
  return `${base} (${i})`;
};

export const renameBoardAtom = atom(
  null,
  (get, set, { oldId, newId }: { oldId: string; newId: string }) => {
    const board = structuredClone(get(toDoState));
    const src = (oldId ?? "").trim();
    let dst = (newId ?? "").trim();
    if (!src || !board[src]) return;
    if (!dst || src === dst) return;

    if (board[dst]) dst = uniqueName(board, dst);

    board[dst] = board[src];
    delete board[src];
    set(toDoState, board);
  }
);