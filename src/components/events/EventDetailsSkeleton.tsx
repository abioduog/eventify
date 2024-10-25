export function EventDetailsSkeleton() {
    return (
      <div className="animate-pulse">
        {/* Hero Section Skeleton */}
        <div className="relative h-[400px] mb-8">
          <div className="w-full h-full bg-muted rounded-lg" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="w-24 h-6 bg-muted rounded mb-4" />
            <div className="w-3/4 h-10 bg-muted rounded mb-4" />
            <div className="flex gap-4">
              <div className="w-32 h-5 bg-muted rounded" />
              <div className="w-32 h-5 bg-muted rounded" />
            </div>
          </div>
        </div>
  
        {/* Main Content Skeleton */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="w-48 h-8 bg-muted rounded mb-4" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-muted rounded" />
                  <div className="w-3/4 h-4 bg-muted rounded" />
                </div>
              </section>
  
              {/* Venue Section */}
              <section>
                <div className="w-32 h-8 bg-muted rounded mb-4" />
                <div className="bg-card rounded-lg p-4">
                  <div className="w-48 h-6 bg-muted rounded mb-2" />
                  <div className="w-64 h-4 bg-muted rounded" />
                </div>
              </section>
  
              {/* Organizer Section */}
              <section>
                <div className="w-40 h-8 bg-muted rounded mb-4" />
                <div className="bg-card rounded-lg p-4">
                  <div className="w-48 h-6 bg-muted rounded mb-2" />
                  <div className="w-full h-4 bg-muted rounded" />
                </div>
              </section>
            </div>
  
            {/* Right Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 bg-card rounded-lg p-6 shadow-lg">
                <div className="w-32 h-8 bg-muted rounded mb-4" />
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-32 h-6 bg-muted rounded" />
                        <div className="w-24 h-6 bg-muted rounded" />
                      </div>
                      <div className="w-full h-4 bg-muted rounded mb-4" />
                      <div className="w-full h-10 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }