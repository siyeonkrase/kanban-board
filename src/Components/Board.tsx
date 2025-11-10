import { useForm } from "react-hook-form";
import { Droppable } from "@hello-pangea/dnd";
import DraggableCard from "./DraggableCard";
import styled, { css, useTheme } from "styled-components";
import { IToDo, toDoState, removeBoardAtom, renameBoardAtom } from "../atoms";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { getAccent } from "../colorMap";
import ConfirmModal from "./ConfirmModal";

const Wrapper = styled.div`
  width: 320px; min-height: 360px;
  padding: 14px 14px 18px;
  background: ${({theme})=>theme.boardBg};
  border: 1px solid ${({theme})=>theme.boardBorder};
  border-radius: ${({theme})=>theme.rBoard};
  box-shadow: ${({theme})=>theme.shBoard};
  display: flex; flex-direction: column;
`;

const Title = styled.div<{color:string}>`
  font-family: 'YoonchoUsanChildrenS', cursive;
  display:flex; align-items:center; gap:10px; margin-bottom:12px;
  .flag{
    position:relative; padding:4px 10px; border-radius:10px;
    background: ${({color})=>`${color}1f`}; color: ${({color})=>color};
    font-weight:800;
  }
  .count{
    display:inline-flex; justify-content:center; align-items:center;
    width:22px; height:22px; border-radius:50%; background:#fff;
    border:1px solid rgba(0,0,0,.06); font-weight:700;
    box-shadow: 0 2px 6px rgba(0,0,0,.08);
    color: ${(prop) => prop.color};
  }
`;

const Area = styled.div<{isDraggingOver:boolean; isDraggingFromThis:boolean; $soft:string}>`
  background: ${(prop) => prop.isDraggingOver ? prop.$soft : "transparent"};
  border: 1px dashed rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  flex-grow: 1; padding: 14px;
  transition: background-color .2s ease;
`;

const AddTaskButton = styled.button<{ $base:string; $soft:string }>`
  width: 80%; margin: 12px auto 0; display: block;
  padding: 10px 0;
  border: 2px dashed ${(prop) => prop.$base};
  border-radius: 12px;
  background: ${(prop) => prop.$soft};
  color: ${(prop) => prop.$base};
  font-family: 'YoonchoUsanChildrenS', cursive;
  font-weight: 700; letter-spacing: .2px; cursor: pointer;
  transition: .2s;
  &:hover{
    background: ${(prop)=>prop.$soft}; /* 유지 */
    filter: brightness(0.98);
    transform: translateY(-1px);
  }
`;

const PopupWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PopupInput = styled.div<{ $base:string; $soft:string; $hover:string }>`
  position: absolute; left: 50%; transform: translateX(-50%);
  bottom: 56px; width: calc(100% - 28px);
  background:#fff; border:1px solid ${({theme})=>theme.boardBorder};
  border-radius: 12px; padding: 10px; z-index: 5;
  box-shadow: 0 12px 26px rgba(0,0,0,0.12);
  animation: show .18s ease;
  @keyframes show { from{opacity:0; transform: translate(-50%,6px);} to{opacity:1; transform: translate(-50%,0);} }
  form{ display:grid; grid-template-columns: 1fr auto; gap: 8px; }
  input{
    border:1px solid #E5E1D6;
    border-radius: 8px;
    padding: 8px 10px;
    font-size:15px;
    font-family: 'YoonchoUsanChildrenS', cursive;
    &:focus{
      outline: none;
      border-color: ${(prop)=>prop.$base};
      box-shadow: 0 0 0 3px ${(prop)=>prop.$soft};
    }
  }
  button{
    background: ${(prop)=>prop.$base};
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    font-weight: 700;
    cursor: pointer;
    transition: .2s;
    font-family: 'YoonchoUsanChildrenS', cursive;
    &:hover{
      background: ${(prop)=>prop.$hover};
    }
  }
`;

const MenuButton = styled.button`
  position: absolute; top: 0; right: 0;
  width: 28px; height: 28px;
  display: inline-flex; justify-content: center; align-items: center;
  border: none;
  background-color: transparent;
  color: ${(prop) => prop.color};
  cursor: pointer; transition: .15s;
  &:hover { filter: brightness(.97); }
  svg { width: 16px; height: 16px; }
`;

const Dropdown = styled.div<{ $closing?: boolean }>`
  position: absolute; top: 34px; right: 0; z-index: 20;
  min-width: 160px; background: #fff;
  border: 1px solid rgba(0,0,0,0.08); border-radius: 10px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.12); padding: 6px;

  animation: ${p =>
    p.$closing
      ? css`menuOut .16s ease forwards`
      : css`menuIn .16s ease`};

  @keyframes menuIn {
    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes menuOut {
    from { opacity: 1; transform: translateY(0)    scale(1); }
    to   { opacity: 0; transform: translateY(-6px) scale(0.98); }
  }
`;

const Item = styled.button`
  width: 100%; text-align: left;
  border: 0; background: transparent; cursor: pointer;
  color: ${({theme})=>theme.text}; font-size: 14px;
  padding: 10px; border-radius: 8px; display: flex; gap: 8px; align-items: center;
  &:hover { background: rgba(0,0,0,0.04); }
  &.danger { color: #B34747; }
  font-family: 'YoonchoUsanChildrenS', cursive;
`;

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
  boardIndex: number;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId, boardIndex }: IBoardProps) {
  const theme = useTheme();
  const accent = getAccent(boardIndex, theme);
  const removeBoard = useSetAtom(removeBoardAtom);
  const renameBoard = useSetAtom(renameBoardAtom);

  const setToDos = useSetAtom(toDoState);
  const [showPopup, setShowPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [delConfirmOpen, setDelConfirmOpen] = useState(false);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { register, setValue, handleSubmit, setFocus } = useForm<IForm>();

  const onValid = ({ toDo }: IForm) => {
    const newToDo = { id: Date.now(), text: toDo };
    setToDos(allBoards => ({
      ...allBoards,
      [boardId]: [...(allBoards[boardId] ?? []), newToDo],
    }));
    setValue("toDo", "");
    setShowPopup(false);
  };

  const onDeleteBoard = () => setDelConfirmOpen(true);

  const doDelete = () => {
    removeBoard(boardId);
    setDelConfirmOpen(false);
    setMenuOpen(false);
  };

  const cancelDelete = () => setDelConfirmOpen(false);

  useEffect(() => {
    if (showPopup) {
      requestAnimationFrame(() => setFocus("toDo"));
    }
  }, [showPopup, setFocus]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const onEditBoard = () => {
    const next = prompt("Please enter a new board name.", boardId);
    if (!next) return;
    renameBoard({ oldId: boardId, newId: next });
    setMenuOpen(false);
  };

  return (
    <Wrapper>
      <div style={{ position: "relative" }} ref={menuRef}>
        <Title color={accent.base}>
          <span className="count">{toDos.length}</span>
          <span className="flag">{boardId}</span>
        </Title>

        <MenuButton
          color={accent.base}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Board menu"
          onClick={() => setMenuOpen(v => !v)}
        >

          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="2.1" fill="currentColor" />
            <circle cx="12" cy="12" r="2.1" fill="currentColor" />
            <circle cx="12" cy="19" r="2.1" fill="currentColor" />
          </svg>
        </MenuButton>

        {menuOpen && (
          <Dropdown role="menu">
            <Item onClick={onEditBoard}>Edit name</Item>
            <Item className="danger" onClick={onDeleteBoard}>Delete board</Item>
          </Dropdown>
        )}
      </div>

      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
            $soft={accent.soft}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
                boardId={boardId}
              />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>

      <PopupWrapper>
        {showPopup && (
          <PopupInput $base={accent.base} $soft={accent.soft} $hover={accent.hover}>
            <form onSubmit={handleSubmit(onValid)}>
              <input
                id="input"
                {...register("toDo", { required: true })}
                type="text"
                placeholder={`Add task on ${boardId}`}
              />
              <button type="submit">Add</button>
            </form>
          </PopupInput>
        )}
        <AddTaskButton
          $base={accent.base}
          $soft={accent.soft}
          onClick={() => setShowPopup((prev) => !prev)}
        >
          ＋ Add new task
        </AddTaskButton>
      </PopupWrapper>
      {delConfirmOpen && (
        <ConfirmModal
          title="Delete board?"
          message={`Are you sure you want to delete the "${boardId}" board? (All cards will be removed as well.)`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          accent={accent.base}
          onConfirm={doDelete}
          onCancel={cancelDelete}
        />
      )}

    </Wrapper>
  );
}

export default Board;
