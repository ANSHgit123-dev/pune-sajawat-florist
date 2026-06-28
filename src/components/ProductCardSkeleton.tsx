import React from "react";

export default function ProductCardSkeleton(): React.JSX.Element {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 flex flex-col overflow-hidden h-full animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-[280px] bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100 rounded-t-3xl relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>

      {/* Content placeholder */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Category chip */}
        <div className="h-2.5 w-20 bg-stone-100 rounded-full" />

        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-3/4 bg-stone-200 rounded-md" />
          <div className="h-3 w-full bg-stone-100 rounded-md" />
          <div className="h-3 w-4/5 bg-stone-100 rounded-md" />
        </div>

        {/* Ratings row */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <div className="h-2.5 w-8 bg-amber-100 rounded-full" />
          <div className="h-2.5 w-16 bg-stone-100 rounded-full" />
          <div className="h-2.5 w-14 bg-emerald-100 rounded-full ml-auto" />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 bg-stone-200 rounded-md" />
          <div className="h-3.5 w-10 bg-stone-100 rounded-md" />
        </div>

        {/* Demand ribbon */}
        <div className="h-6 w-full bg-amber-50 rounded-sm" />

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="h-8 bg-stone-100 rounded-sm" />
          <div className="h-8 bg-[#82862F]/20 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
