export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper" role="status" aria-label="Loading">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-black/15 border-t-accent" />
    </div>
  );
}
