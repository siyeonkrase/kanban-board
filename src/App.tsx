import { useAtom } from "jotai";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import styled from "styled-components";
import { boarderOrderState, reorder, toDoState } from "./atoms";
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

  /* div:first-child {
    margin-left: 20px;
  } */

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
  const [order, setOrder] = useAtom(boarderOrderState);
  const onDragEnd = (info: DropResult) => {
    const {destination, draggableId, source, type} = info;
    if(!destination) return;
    if (type === "BOARD") {
      if (source.index === destination.index) return;
      setOrder(prev => reorder(prev, source.index, destination.index));
      return;
    }

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId === destId) {
      setToDos(allBoards => {
        const meta = allBoards[sourceId];
        if (!meta) return allBoards;

        const items = [...meta.items];
        const [moved] = items.splice(source.index, 1);
        items.splice(destination.index, 0, moved);

        return {
          ...allBoards,
          [sourceId]: { ...meta, items },
        };
      });
      return;
    }
    setToDos(allBoards => {
      const sourceMeta = allBoards[sourceId];
      const destMeta = allBoards[destId];
      if (!sourceMeta || !destMeta) return allBoards;

      const sourceItems = [...sourceMeta.items];
      const destItems = [...destMeta.items];

      const [moved] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, moved);

      return {
        ...allBoards,
        [sourceId]: { ...sourceMeta, items: sourceItems },
        [destId]: { ...destMeta, items: destItems },
      };
    });
  };
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Droppable droppableId="boards" direction="horizontal" type="BOARD">
          {(provided) => (
            <Boards ref={provided.innerRef} {...provided.droppableProps}>
              {order.map((boardId, idx) => {
                const meta = toDos[boardId];
                if (!meta) return null;

                return (
                  <Draggable
                    key={boardId}
                    draggableId={`board:${boardId}`}
                    index={idx}
                    disableInteractiveElementBlocking={true}
                  >
                    {(props) => (
                      <div
                        ref={props.innerRef}
                        {...props.draggableProps}
                        style={props.draggableProps.style}
                      >
                        <Board
                          key={boardId}
                          boardId={boardId}
                          accentId={meta.accentId}
                          toDos={meta.items}
                          handleProps={props.dragHandleProps ?? undefined}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Boards>
          )}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;