import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import clsx from "clsx";

interface Props {
  open: boolean;
  title: string;
  children: React.ReactNode;
  close: () => void;
  width?: number;
  titleBar?: boolean;
}

const getFocusableElements = (
  element: HTMLDivElement | null,
  withPriority = false
) => {
  let elements: HTMLElement[] = [];
  if (withPriority) {
    const priority = Array.from(
      element?.querySelectorAll<HTMLElement>(
        "input:not([disabled]):not([tabindex='-1']), " +
          "select:not([disabled]):not([tabindex='-1']), " +
          "textarea:not([disabled]):not([tabindex='-1'])"
      ) || []
    );
    const secondary = Array.from(
      element?.querySelectorAll<HTMLElement>(
        "button:not([disabled]):not([tabindex='-1']), " +
          "[href]:not([tabindex='-1']), " +
          "[tabindex]:not([tabindex='-1']):not([disabled])"
      ) || []
    );
    elements = [...priority, ...secondary];
  } else {
    elements = Array.from(
      element?.querySelectorAll<HTMLElement>(
        "button:not([disabled]):not([tabindex='-1']), " +
          "[href]:not([tabindex='-1']), " +
          "input:not([disabled]):not([tabindex='-1']), " +
          "select:not([disabled]):not([tabindex='-1']), " +
          "textarea:not([disabled]):not([tabindex='-1']), " +
          "[tabindex]:not([tabindex='-1']):not([disabled])"
      ) || []
    );
  }
  return elements;
};

const Modal = ({
  open,
  title,
  children,
  close,
  width,
  titleBar,
}: Props) => {
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      lastFocusedElement.current = document.activeElement as HTMLElement;

      const firstElementFocus = getFocusableElements(modalRef.current, true);
      firstElementFocus?.[0]?.focus();

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          close();
        }

        const focusableElements = getFocusableElements(modalRef.current);

        if (!modalRef.current || !focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener("keydown", handleTabKey);

      return () => {
        document.removeEventListener("keydown", handleTabKey);
      };
    } else {
      lastFocusedElement.current?.focus();
    }
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && 
        <motion.div 
          initial={{
            backgroundColor: `var(--primary-950-0)`
          }}
          animate={{
            backgroundColor: `var(--primary-950-20)`
          }}
          exit={{
            backgroundColor: `var(--primary-950-0)`
          }}
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }} 
          onClick={close}
        >
          <motion.section
            ref={modalRef}
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            exit={{ scale: 0 }}
            transition={{
              duration: .3
            }}
            style={{
              width: width ?? 384,
              maxWidth: "100%",
              maxHeight: "100%",
              backgroundColor: "rgba(255,255,255)",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingInline: 16,
                paddingBlock: 8,
                gap: 16,
                borderBottom: titleBar ? "1px solid rgba(0, 0, 0, .2)" : undefined
              }}
            >
              <strong 
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {title}
              </strong>
              <button style={{
                padding: 8,
                paddingInline: 16,
                backgroundColor: "var(--primary-600)",
                color: "rgb(255,255,255)",
                border: 0,
                cursor: "pointer",
                fontWeight: 700,
                borderRadius: 10
              }} onClick={close}>X</button>
            </header>
            <main
              style={{
                padding: 0
              }}
            >
              {children}
            </main>
          </motion.section>
        </motion.div>
      }
    </AnimatePresence>,
    document.getElementById("modal") || document.body
  );
};

export default Modal;
