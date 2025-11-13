import styled from "styled-components";

interface IconProps {
  src: string;
  size?: number;
  alt?: string;
  rounded?: boolean;
  onClick?: () => void;
  className?: string;
  focus?: string;
}

export const Icon = styled.img<Pick<IconProps, "size" | "rounded">>`
  display: inline-block;
  width: ${({ size }) => size || 24}px;
  height: ${({ size }) => size || 24}px;
  object-fit: contain;
  border-radius: ${({ rounded }) => (rounded ? "50%" : "0")};
  user-select: none;
  pointer-events: auto;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default function IconWrapper(props: IconProps) {
  return <Icon {...props} />;
}
