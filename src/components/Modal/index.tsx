import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./style.scss";

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
            className={`dua-modal__overlay ${overlayClassName}`}
            onClick={onRequestClose}
        >
            <div
                className={`dua-modal__content ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}