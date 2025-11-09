import { Draggable } from "@hello-pangea/dnd"
import { useSetAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { removeToDoAtom } from "../atoms";

const Card = styled.div<{isDragging:boolean}>`
  position: relative;
  border-radius: 20px;
  min-height: 80px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) => props.isDragging ? "#74b9ff" : props.theme.cardColor};
  box-shadow: ${(props) => props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
  &:hover button {
    opacity: 1;
    visibility: visible;
  }
`;

const Button = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: transparent;
  margin-right: 5px;
  color: #fff;
  border: none;
  border-radius: 3px;
  width: 18px;
  height: 18px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

function DraggableCard({toDoId, toDoText, index, boardId}: IDraggableCardProps) {
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
          <Button onClick={handleDelete}>❌</Button>
        </Card>
      )}
    </Draggable>
  )
}

export default React.memo(DraggableCard);