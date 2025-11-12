import { useAtom } from "jotai";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  gap: 16px;
  padding: 0 16px 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  & > * {
    flex: 0 0 min(88vw, 360px);
    scroll-snap-align: start;
  }

  @media (min-width: 768px) {
    overflow: visible;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;

    & > * {
      flex: 0 0 320px;
      scroll-snap-align: none;
    }
  }
`;

function App() {
  const [toDos, setToDos] = useAtom(toDoState);
  const onDragEnd = (info: DropResult) => {
    const {destination, draggableId, source} = info;
    if(!destination) return;
    if(destination?.droppableId === source.droppableId) {
      // same board movement
      setToDos((allBoards) => {
        const boardCopy  = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [destination.droppableId]: boardCopy,
        };
      });
    };
    if(destination.droppableId !== source.droppableId) {
      // cross board movement
      setToDos((allBoards) => {
        const sourceBoard  = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard  = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    };
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId, idx) => (
            <Board
              key={boardId}
              boardId={boardId}
              boardIndex={idx}
              toDos={toDos[boardId]}
            />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;