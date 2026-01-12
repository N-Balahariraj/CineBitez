import { useEffect, useRef } from "react";

export default function Modal({ children, ...props }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.showModal?.();
  }, []);

  function close() {
    dialogRef.current?.close?.();
  }

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) close();
  }

  return (
    <dialog ref={dialogRef} {...props} onClick={handleBackdropClick}>
      <button
        type="button"
        onClick={close}
        className="fixed top-4 right-4 z-50 text-white"
        aria-label="Close"
      >
        X
      </button>
      {children}
    </dialog>
  );
}
