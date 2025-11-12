import { useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { Icon } from "./Icon";

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,.35);
  display: flex; align-items: center; justify-content: center;
  animation: fadeIn .18s ease;
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
`;

const Box = styled.div<{ $accent: string }>`
  width: 400px; max-width: calc(100% - 40px);
  background: #fff; border-radius: 14px; padding: 18px 16px;
  box-shadow: 0 16px 36px rgba(0,0,0,.2);
  animation: popIn .2s ease;
  @keyframes popIn { from{transform: translateY(8px) scale(.98); opacity:.9} to{transform:none; opacity:1} }

  h3 { margin: 0 0 10px; font-size: 18px; font-weight: 800; color: #2e2a24; font-family: 'YoonchoUsanChildrenS', cursive;}
  p  { margin: 0; color: #514b43; line-height: 1.5; font-family: 'YoonchoUsanChildrenS', cursive;}

  .row {
    margin-top: 16px; display: flex; gap: 8px; justify-content: flex-end;
    button {
      height: 36px; padding: 0 12px; border-radius: 10px; border: 0; cursor: pointer; font-weight: 700; font-family: 'YoonchoUsanChildrenS', cursive;
    }
    .cancel {
      background: #f4f1ea; color: #4e4a42;
    }
    .confirm {
      background: ${({ $accent }) => $accent}; color: #fff;
    }
  }
`;

type Props = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  accent?: string;
  onConfirm: () => void;
  onCancel: () => void;
  closeOnOverlay?: boolean;
};

export default function ConfirmModal({
  title = "Confirm",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  accent = "#E06C9F",
  onConfirm,
  onCancel,
  closeOnOverlay = true,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  const el = (
    <Overlay
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && closeOnOverlay) onCancel();
      }}
    >
      <Box $accent={accent} role="dialog" aria-modal="true" aria-label={title}>
        <Icon src={title} size={55}/>
        <br/><br/>
        <p>{message}</p>
        <div className="row">
          <button className="cancel" onClick={onCancel}>{cancelLabel}</button>
          <button className="confirm" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </Box>
    </Overlay>
  );
  
  return ReactDOM.createPortal(el, document.body);
}