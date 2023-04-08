const DashboardEntriesSkeleton = () => {
  return (
    <>
      <div className="mt-8">
        <div className="mb-4 text-xl font-bold h-7 w-48 bg-slate-700 animate-pulse rounded" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
          <div className="bg-slate-700 animate-pulse h-28 rounded" />
          <div className="bg-slate-700 animate-pulse h-28 rounded" />
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 text-xl font-bold h-7 w-48 bg-slate-700 animate-pulse rounded" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
          <div className="bg-slate-700 animate-pulse h-28 rounded" />
          <div className="bg-slate-700 animate-pulse h-28 rounded" />
          <div className="bg-slate-700 animate-pulse h-28 rounded" />
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 text-xl font-bold h-7 w-48 bg-slate-700 animate-pulse rounded" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
          <div className="bg-slate-700 animate-pulse h-28 rounded" />
        </div>
      </div>
    </>
  );
};

export default DashboardEntriesSkeleton;
