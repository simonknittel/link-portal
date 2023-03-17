"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

interface Props {
  className?: string;
  isOpen?: boolean | null;
  onRequestClose?: () => void;
  children?: ReactNode;
}

export default function Modal({
  className,
  isOpen = false,
  children,
  onRequestClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <form
      className={clsx(
        className,
        "fixed inset-0 flex cursor-pointer items-center justify-center bg-slate-900 bg-opacity-80 p-2 backdrop-blur"
      )}
      onClick={onRequestClose}
    >
      <div
        className={clsx(
          "max-h-full max-w-full cursor-auto overflow-auto rounded bg-slate-800 p-8 text-slate-50",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </form>
  );
}
