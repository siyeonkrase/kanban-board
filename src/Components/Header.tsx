import styled from "styled-components";

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

export default function Header(){
  return (
    <Wrapper>
      <Brand><h1>BentoBoard</h1></Brand>
    </Wrapper>
  );
}