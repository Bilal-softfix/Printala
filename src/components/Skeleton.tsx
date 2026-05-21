export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="comic-card overflow-hidden">
        <div className="aspect-[3/4] bg-bg-tertiary rounded-t-[calc(1.25rem-3px)]" />
        <div className="p-3 border-t-3 border-charcoal/10 space-y-2">
          <div className="h-4 bg-bg-tertiary rounded w-3/4" />
          <div className="h-3 bg-bg-tertiary rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
