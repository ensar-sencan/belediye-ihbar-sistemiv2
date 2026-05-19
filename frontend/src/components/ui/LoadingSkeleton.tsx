export default function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-2/3"></div>
              <div className="flex gap-2 mt-3">
                <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
                <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
              <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}