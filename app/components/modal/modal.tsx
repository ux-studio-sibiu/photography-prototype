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
        <button className="modal-close" onClick={handleClose} aria-label="Close modal">
          <svg aria-hidden="true" viewBox="0 0 32 32" width="24" height="24">
            <path d="M24 10l-2-2-6 6-6-6-2 2 6 6-6 6 2 2 6-6 6 6 2-2-6-6z" fill="currentColor" />
          </svg>
        </button>
        {children}
      </div>
    </dialog>
  );
}
