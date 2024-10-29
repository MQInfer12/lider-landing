import type { CSSProperties } from "react";
import { useModal } from "./useModal";

interface Props {
  content?: JSX.Element;
  modalContent?: JSX.Element;
  style?: CSSProperties;
  title?: string;
  width?: number;
}

const ModalComp = ({
  content,
  modalContent,
  style = {},
  title,
  width,
}: Props) => {
  const { setOpen, modal } = useModal();

  return (
    <>
      {modal(title || "", modalContent, {
        width,
      })}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          onClick={() => setOpen(true)}
          style={{
            ...style,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {content}
        </div>
      </div>
    </>
  );
};

export default ModalComp;
