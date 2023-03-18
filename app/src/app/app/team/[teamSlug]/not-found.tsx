export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center py-8">
      <div className="flex w-full max-w-md flex-col gap-2 rounded bg-slate-700 p-8">
        <h2 className="text-xl font-bold">404 - Not Found</h2>
        <p>Could not find requested team.</p>
      </div>
    </div>
  );
}
