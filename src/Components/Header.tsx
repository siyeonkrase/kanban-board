import styled from "styled-components";
import { Icon } from "./Icon";
import { useState } from "react";
import InputModal from "./InputModal";
import { addBoardAtom } from "../atoms";
import { useSetAtom } from "jotai";
import { accentOptions } from "../theme";

const Wrapper = styled.header`
  position: sticky; top: 0; z-index: 50;
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 24px;
  background: rgba(255,255,255,0.45);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
`;

const Brand = styled.div`
  display: flex; align-items: center; gap: 10px;
  h1 {
    color: ${({theme})=>theme.text};
    font-weight: 800;
    letter-spacing:.2px;
    font-family: 'Double Trouble Sara', cursive;
    font-size:30px
  }
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 10px;
  padding: 6px 0;
  flex-wrap: wrap;
`;

const Circle = styled.button<{ color: string; selected: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${(p) => p.color};
  border: 2px solid
    ${(p) => (p.selected ? p.color : "rgba(0,0,0,0.08)")};
  box-shadow: ${(p) =>
    p.selected
      ? `0 0 0 4px ${p.color}33`
      : "0 2px 4px rgba(0,0,0,0.06)"};

  cursor: pointer;
  transition: 0.18s ease;

  &:hover {
    transform: scale(1.08);
  }
`;

export default function Header(){
  const [addOpen, setAddOpen] = useState(false);
  const addBoard = useSetAtom(addBoardAtom);
  const [selected, setSelected] = useState("b");
  
  const onAddBoard = () => {
    setAddOpen(true);
  }
  const doAddBoard = (name: string, accentId?: string) => {
    addBoard({name, accentId});
    setAddOpen(false);
  };
  
  const homeBtn = () => {
    const onigiri = document.getElementById('home');
    onigiri?.setAttribute("src", "/images/onigirisan.png")
  }

  const onHey = () => {
    const onigiri = document.getElementById('home');
    onigiri?.setAttribute("src", "/images/onigirisan2.png")
    setTimeout(homeBtn, 100);
    
  }

  return (
    <Wrapper>
      <Brand><Icon id="home" src={"/images/onigirisan.png"} size={45} onClick={onHey}/><h1>BentoBoard</h1></Brand>
      <Icon src={"/images/plus.png"} size={45} onClick={onAddBoard}/>
      {addOpen && (
        <InputModal
          title="/images/yakisanma.png"
          label="Please enter a board name."
          initialValue=""
          confirmLabel="Create"
          onConfirm={doAddBoard}
          onCancel={() => setAddOpen(false)}
          accent="pink"
        />
      )}
    </Wrapper>
  );
}