"use client";

import { useEffect, type ReactNode, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

export default function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  const closeBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };
  return createPortal(
    <div
      aria-modal="true"
      className={css.backdrop}
      onClick={closeBackdrop}
      role="dialog"
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.body,
  );
}
