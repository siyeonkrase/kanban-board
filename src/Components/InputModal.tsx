import { useEffect, useRef, useState } from "react";
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
  width: 340px; max-width: calc(100% - 40px);
  background: #fff; border-radius: 14px; padding: 18px 16px;
  box-shadow: 0 16px 36px rgba(0,0,0,.2);
  animation: popIn .2s ease;
  @keyframes popIn { from{transform: translateY(8px) scale(.98); opacity:.9} to{transform:none; opacity:1} }

  h3 { margin: 0 0 10px; font-size: 16px; font-weight: 800; color: #2e2a24;  font-family: 'YoonchoUsanChildrenS', cursive; }
  p  { margin: 0 0 10px; color: #514b43; line-height: 1.5;  font-family: 'YoonchoUsanChildrenS', cursive; }

  .field {
    display: grid; gap: 8px; margin-top: 6px;
    input {
      border: 1px solid #E5E1D6; border-radius: 10px; padding: 10px 12px;
      font-size: 15px; font-family: 'YoonchoUsanChildrenS', cursive;
      &:focus { outline: none; border-color: ${({$accent})=>$accent}; box-shadow: 0 0 0 3px ${({$accent})=>`${$accent}1f`}; }
    }
    .hint { font-size: 12px; color: #8b857b; font-family: 'YoonchoUsanChildrenS', cursive;}
    .err  { font-size: 12px; color: #B34747; font-family: 'YoonchoUsanChildrenS', cursive;}
  }

  .row {
    margin-top: 14px; display: flex; gap: 8px; justify-content: flex-end;
    button { height: 36px; padding: 0 12px; border-radius: 10px; border: 0; cursor: pointer; font-weight: 700; }
    .cancel { background: #f4f1ea; color: #4e4a42; }
    .confirm { background: ${({$accent})=>$accent}; color: #fff; }
    .confirm[disabled] { opacity: .6; cursor: not-allowed; }
  }
`;

type Props = {
  title?: string;
  label?: string;
  initialValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  accent?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  closeOnOverlay?: boolean;
};

export default function InputModal({
  title = "Edit board name",
  label = "Please enter a new board name.",
  initialValue = "",
  confirmLabel = "Save",
  cancelLabel = "Cancel",
  accent = "#E06C9F",
  onConfirm,
  onCancel,
  closeOnOverlay = true,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [err, setErr] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => ref.current?.focus());
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  const submit = () => {
    const v = value.trim();
    if (!v) { setErr("Name cannot be empty."); return; }
    onConfirm(v);
  };

  const el = (
    <Overlay onClick={(e) => { if (e.target === e.currentTarget && closeOnOverlay) onCancel(); }}>
      <Box $accent={accent} role="dialog" aria-modal="true" aria-label={title}>
        <Icon src={title} size={55}/>
        <div className="field">          
          <input
            ref={ref}
            value={value}
            onChange={(e) => { setValue(e.target.value); if (err) setErr(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="e.g.) Wednesday, To Do....."
          />
          {err ? <span className="err">{err}</span> : <span className="hint">{label}</span>}
        </div>
        <div className="row">
          <button className="cancel" onClick={onCancel}>{cancelLabel}</button>
          <button className="confirm" onClick={submit} disabled={!value.trim()}>{confirmLabel}</button>
        </div>
      </Box>
    </Overlay>
  );

  return ReactDOM.createPortal(el, document.body);
}
