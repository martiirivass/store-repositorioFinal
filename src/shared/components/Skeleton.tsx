import type { CSSProperties } from "react";

type SkeletonProps = {
  className?: string;
  style?: CSSProperties;
};

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-700/50 rounded-lg ${className}`}
      style={style}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-lg space-y-md">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-lg">
        <Skeleton className="h-80 w-full rounded-xl" />
        <div className="space-y-lg">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  );
}
