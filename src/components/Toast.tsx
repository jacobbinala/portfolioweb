export function Toast({ message }: { message: string | null }) {
  return (
    <div className="toast-slot" role="status" aria-live="polite">
      {message ? <div className="toast">{message}</div> : null}
    </div>
  );
}
