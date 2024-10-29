import { useState } from "react";
import Modal from "./Modal";

interface Options {
  width?: number;
  titleBar?: boolean;
}

export const useModal = <T,>() => {
  const [open, _setOpen] = useState(false);
  const [item, setItem] = useState<T | null>(null);

  const setOpen = (openOption: T | boolean) => {
    if (typeof openOption !== "boolean") {
      setItem(openOption);
    }
    if (openOption === false) {
      setItem(null);
    }
    _setOpen(!!openOption);
  };

  const modal = (
    title: string,
    children: ((item: T | null) => React.ReactNode) | React.ReactNode,
    options?: Options
  ) => (
    <Modal
      title={title}
      open={open}
      close={() => setOpen(false)}
      width={options?.width}
      titleBar={options?.titleBar ?? true}
    >
      {typeof children === "function" ? children(item) : children}
    </Modal>
  );

  return { modal, open, setOpen };
};
