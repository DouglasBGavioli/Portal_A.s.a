import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onRequestClose?: () => void;
  className?: string;
  overlayClassName?: string;
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  onRequestClose,
  className = "",
  overlayClassName = "",
  children,
}: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-black/65 px-4 py-16 ${overlayClassName}`}
      onClick={onRequestClose}
    >
      <div
        className={`relative w-full max-w-[900px] animate-[fadeIn_.2s_ease] rounded-lg bg-white p-6 md:p-10 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

