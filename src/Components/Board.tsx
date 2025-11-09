import { useForm } from "react-hook-form"
import { Droppable } from "@hello-pangea/dnd";
import DraggableCard from "./DraggableCard";
import styled from "styled-components";
import { IToDo, toDoState } from "../atoms";
import { useSetAtom } from "jotai";
import { useState } from "react";

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 20px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  margin: 0% 1%;
`;

const Title = styled.h2`
  text-align: left;
  font-weight: 600;
  margin: 10px 20px;
  font-size: 18px;
`

const Area = styled.div<IAreaProps>`
  background-color: ${(props) => props.isDraggingOver ? "#dfe6e9" : props.isDraggingFromThis ? "#b2bec3" : "transparent"};
  flex-grow: 1;
  transition: background-color .3s ease-in-out;
  padding: 20px;
`
const Form = styled.form`
  width: 100%;
  input {
    width: 100%
  }
`
const Count = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px; 
  height: 24px;
  border-radius: 50%;
  background-color: #fff;
  color: #2d3436;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  margin-right: 8px;
`;

const AddTaskButton = styled.button`
  width: 90%;
  align-self: center;
  padding: 10px 0;
  margin: 12px;
  border: 2px dashed;
  border-radius: 10px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background-color: rgba(162, 155, 254, 0.18);
    transform: scale(1.02);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const PopupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`;

const PopupInput = styled.div`
  position: absolute;
  bottom: 50px;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: fadeIn 0.2s ease;
  z-index: 5;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  input {
    border: 1px solid #dfe6e9;
    border-radius: 6px;
    padding: 8px;
    font-size: 14px;
    outline: none;

    &:focus {
      border-color: #a29bfe;
      box-shadow: 0 0 0 2px rgba(162, 155, 254, 0.2);
    }
  }

  button {
    background-color: #6c5ce7;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background-color: #5f43e8;
    }
  }
`;

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
}

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetAtom(toDoState);
  const [showPopup, setShowPopup] = useState(false);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    }
    setToDos(allBoards => {
      return {
        ...allBoards,
        [boardId]: [
          ...allBoards[boardId],
          newToDo
        ]
      }
    });
    setValue("toDo", "");
    setShowPopup(false);
  };

  return (
    <Wrapper>
      <Title>
        <Count>{toDos.length}</Count>
        {boardId}
      </Title>
      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
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
          <PopupInput>
            <form onSubmit={handleSubmit(onValid)}>
              <input
                {...register("toDo", { required: true })}
                type="text"
                placeholder={`Add task on ${boardId}`}
              />
              <button type="submit">Add</button>
            </form>
          </PopupInput>
        )}
        <AddTaskButton onClick={() => setShowPopup((prev) => !prev)}>
          ＋ Add new task
        </AddTaskButton>
      </PopupWrapper>
    </Wrapper>
  );
}

export default Board;