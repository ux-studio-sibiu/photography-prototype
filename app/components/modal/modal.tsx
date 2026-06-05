'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import './modal.scss';

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.show();
  }, []);

  const handleClose = () => {
    router.back();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="nsc-modal"
      onClose={handleClose}
      onClick={handleBackdropClick}
    >
      <div className="modal-content">
        {/* <button className="modal-close" onClick={handleClose} aria-label="Close modal">✕</button> */}
        {children}
      </div>
    </dialog>
  );
}
