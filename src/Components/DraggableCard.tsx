import { Draggable } from "@hello-pangea/dnd"
import { useSetAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { removeToDoAtom } from "../atoms";

const Card = styled.div<{isDragging:boolean}>`
  position: relative;
  background: ${({theme})=>theme.cardBg};
  border: 1px solid ${({theme})=>theme.cardBorder};
  border-radius: ${({theme})=>theme.rCard};
  box-shadow: ${({theme})=>theme.shCard};
  padding: 12px; margin-bottom: 10px;
  transition: transform .15s ease, box-shadow .15s ease;
  &:hover { transform: translateY(-1px); }
  &:hover button { opacity:1; visibility:visible; }
  font-family: 'YoonchoUsanChildrenS', cursive;

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
  }

  @media (min-width: 1500px) {
    padding: 16px;
    font-size: 17px;
  }
`;

// const Button = styled.button`
//   position: absolute;
//   top: 5px;
//   right: 5px;
//   background-color: transparent;
//   margin-right: 5px;
//   color: #fff;
//   border: none;
//   border-radius: 3px;
//   width: 18px;
//   height: 18px;
//   font-size: 12px;
//   cursor: pointer;
//   opacity: 0;
//   visibility: hidden;
//   transition: opacity 0.2s ease, visibility 0.2s ease;
// `;

const Close = styled.button`
  position: absolute; top: 6px; right: 6px;
  width: 18px; height: 18px; border-radius: 6px;
  background: transparent;
  color: ${(props) => props.color};
  border: none; font-size: 12px; line-height: 18px;
  cursor: pointer; opacity:0; visibility:hidden; transition:.15s;
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
  color: string;
}

function DraggableCard({toDoId, toDoText, index, boardId, color}: IDraggableCardProps) {
  const remove = useSetAtom(removeToDoAtom);
  const handleDelete = () => {
    remove({ column: boardId, index });
    console.log(toDoId)
  };
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {toDoText}
          <Close onClick={handleDelete} color={color}>X</Close>
        </Card>
      )}
    </Draggable>
  )
}

export default React.memo(DraggableCard);