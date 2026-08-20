import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Header Profile Banner Skeleton */}
      <div className="bg-white p-5 rounded-3xl border border-[#BFE5D3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 rounded-xl skeleton-box" />
          <div className="h-6 w-24 rounded-full skeleton-box" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="h-12 rounded-xl skeleton-box" />
          <div className="h-12 rounded-xl skeleton-box" />
          <div className="h-12 rounded-xl skeleton-box" />
          <div className="h-12 rounded-xl skeleton-box" />
        </div>
      </div>

      {/* Top 4 KPI Metric Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-[#BFE5D3] h-32 flex flex-col justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl skeleton-box shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-20 skeleton-box rounded" />
                <div className="h-6 w-28 skeleton-box rounded" />
              </div>
            </div>
            <div className="h-3 w-36 skeleton-box rounded" />
          </div>
        ))}
      </div>

      {/* Main Grid Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-[#BFE5D3] h-80 flex flex-col justify-between shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-40 skeleton-box rounded" />
              <div className="h-4 w-4 skeleton-box rounded-full" />
            </div>
            <div className="h-36 rounded-2xl skeleton-box" />
            <div className="h-10 rounded-xl skeleton-box" />
          </div>
        ))}
      </div>
    </div>
  );
};
