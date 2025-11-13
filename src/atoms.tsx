import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface IToDo {
  id: number;
  text: string;
}

type BoardMeta = {
  accentId: string;
  items: IToDo[];
};

interface IToDoState {
  [key: string]: BoardMeta;
}

export const toDoState = atomWithStorage<IToDoState>("board", {
  "To Do":  { accentId: "a", items: [] },
  Doing:    { accentId: "b", items: [] },
  Done:     { accentId: "c", items: [] },
});

export const boarderOrderState = atomWithStorage<string[]>(
  "borderOrder",
  ["To Do", "Doing", "Done"]
);

export const removeToDoAtom = atom(
  null,
  (get, set, { column, index }: { column: string; index: number }) => {
    const boards = structuredClone(get(toDoState));
    const meta = boards[column];
    if (!meta) return;
    const items = [...meta.items];
    if (index < 0 || index >= items.length) return;
    items.splice(index, 1);
    boards[column] = { ...meta, items };
    set(toDoState, boards);
  }
);

export const resetBoardAtom = atom(null, (_get, set) => {
  set(toDoState, {});
});

export const removeBoardAtom = atom(null, (get, set, boardId: string) => {
  const boards = structuredClone(get(toDoState));
  if (!boards[boardId]) return;
  delete boards[boardId];
  set(toDoState, boards);
  set(boarderOrderState, prev => prev.filter(id => id !== boardId));
});

// const uniqueName = (obj: Record<string, unknown>, base: string) => {
//   if (!obj[base]) return base;
//   let i = 1;
//   while (obj[`${base} (${i})`]) i++;
//   return `${base} (${i})`;
// };

export const renameBoardAtom = atom(
  null,
  (get, set, { oldId, newId, accentId }: { oldId: string; newId: string, accentId?: string; }) => {
    const boards = structuredClone(get(toDoState));
    const src = (oldId ?? "").trim();
    let dst = (newId ?? "").trim();
    const srcMeta = boards[src];

    if (!src || !boards[src]) return;
    if (!dst) return;
    // if (board[dst]) dst = uniqueName(board, dst);

    if (dst === src) {
      // changing color only
      boards[src] = {
        ...srcMeta,
        accentId: accentId ?? srcMeta.accentId,
      };
      set(toDoState, boards);
      return;
    }

    boards[dst] = {
      ...srcMeta,
      accentId: accentId ?? srcMeta.accentId,
    };

    delete boards[src];
    set(toDoState, boards);

    set(boarderOrderState, prev =>
      prev.map(id => (id === src ? dst : id))
    );
  }
);

export const addBoardAtom = atom(
  null,
  (get, set, payload: {name: string; accentId?: string}) => {
    const boards = structuredClone(get(toDoState));
    let safeName = (payload.name ?? "").trim();
    if (!safeName) return;
    // if (boards[safeName]) safeName = uniqueName(boards, safeName);

    const accentId = payload.accentId ?? "a";

    boards[safeName] = {
      accentId,
      items: [],
    };

    set(toDoState, boards);
    set(boarderOrderState, prev => [...prev, safeName]);
  }
);

export const reorder = <T,>(list: T[], start: number, end: number) => {
  const next = list.slice();
  const [moved] = next.splice(start, 1);
  next.splice(end, 0, moved);
  return next;
}