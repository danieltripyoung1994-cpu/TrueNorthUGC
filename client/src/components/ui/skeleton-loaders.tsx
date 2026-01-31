import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

/**
 * CardSkeleton - Loading state for campaign and creator cards
 * Used in: Campaigns page, Directory page
 */
export function CardSkeleton() {
  return (
    <Card className="overflow-hidden" data-testid="skeleton-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" data-testid="skeleton-card-avatar" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <Skeleton className="h-6 w-16 flex-shrink-0" data-testid="skeleton-card-badge" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Skeleton className="h-14 w-full" data-testid="skeleton-card-description" />

        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>

        <div className="space-y-2 text-sm">
          <Skeleton className="h-4 w-32" data-testid="skeleton-card-info" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Skeleton className="h-9 w-full" data-testid="skeleton-card-button" />
      </CardFooter>
    </Card>
  );
}

/**
 * ProfileSkeleton - Loading state for profile pages
 * Used in: Profile page
 */
export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-12" data-testid="skeleton-profile">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-10 items-start relative">
        <div className="shrink-0">
          <Skeleton 
            className="w-48 h-48 rounded-[2.5rem]" 
            data-testid="skeleton-profile-image"
          />
        </div>

        <div className="space-y-6 flex-1">
          {/* Title Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 flex-wrap">
              <Skeleton className="h-14 w-64" data-testid="skeleton-profile-title" />
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            </div>

            {/* Handle and Social Links */}
            <div className="flex items-center gap-6">
              <Skeleton className="h-6 w-32" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            </div>
          </div>

          {/* Bio and Niches */}
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" data-testid="skeleton-profile-bio" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          </div>

          {/* Payment Button */}
          <Skeleton className="h-10 w-48" data-testid="skeleton-profile-button" />
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="space-y-8">
        <Skeleton className="h-8 w-32" data-testid="skeleton-profile-section-title" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, idx) => (
            <Card key={idx} className="overflow-hidden">
              <Skeleton 
                className="aspect-video w-full" 
                data-testid={`skeleton-profile-portfolio-item-${idx}`}
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-8">
        <Skeleton className="h-8 w-32" data-testid="skeleton-profile-reviews-title" />
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <Card key={idx} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * DashboardSkeleton - Loading state for dashboard tabs and content
 * Used in: Dashboard page
 */
export function DashboardSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8" data-testid="skeleton-dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-10 w-48" data-testid="skeleton-dashboard-title" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex gap-4 border-b">
          <Skeleton className="h-10 w-24" data-testid="skeleton-dashboard-tab" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Tab Content - Campaigns List */}
        <div className="space-y-6" data-testid="skeleton-dashboard-content">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-52" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>

          {/* Campaign Cards List */}
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <Card key={idx} className="p-6" data-testid={`skeleton-dashboard-campaign-${idx}`}>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full max-w-2xl" />
                    <div className="flex flex-wrap gap-3 text-sm">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex flex-wrap gap-1 pt-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 sm:justify-start">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * DirectorySkeleton - Loading state for creator directory grid
 * Used in: Directory page
 */
export function DirectorySkeleton() {
  return (
    <div className="space-y-8 sm:space-y-12" data-testid="skeleton-directory">
      {/* Header Section */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" data-testid="skeleton-directory-badge" />
        <Skeleton className="h-12 w-64" data-testid="skeleton-directory-title" />
        <Skeleton className="h-6 w-96" data-testid="skeleton-directory-description" />
      </div>

      {/* Filters Section */}
      <div className="bg-card border rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-3 sm:space-y-4">
        <Skeleton className="h-11 sm:h-12 w-full" data-testid="skeleton-directory-search" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2 sm:gap-3">
          <Skeleton className="h-11 sm:h-12 w-full" />
          <Skeleton className="h-11 sm:h-12 w-full" />
          <Skeleton className="h-11 sm:h-12 w-full" />
        </div>
      </div>

      {/* Creator Grid */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        data-testid="skeleton-directory-grid"
      >
        {[...Array(8)].map((_, idx) => (
          <div key={idx} data-testid={`skeleton-directory-card-${idx}`}>
            <Card className="overflow-hidden">
              {/* Background gradient header */}
              <Skeleton className="h-24 w-full rounded-none" />

              <CardHeader className="pt-0 pb-4">
                <div className="flex justify-between items-start">
                  {/* Avatar overlapping header */}
                  <Skeleton 
                    className="h-20 w-20 rounded-full -mt-10 border-4 border-background flex-shrink-0" 
                    data-testid={`skeleton-directory-avatar-${idx}`}
                  />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-4 rounded" />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-5 w-32" data-testid={`skeleton-directory-name-${idx}`} />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Rating Summary */}
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>

                {/* Bio */}
                <Skeleton className="h-8 w-full" data-testid={`skeleton-directory-bio-${idx}`} />

                {/* Niches */}
                <div className="flex flex-wrap gap-1.5">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>
              </CardContent>

              <CardFooter className="pt-2 pb-6">
                <Skeleton className="h-9 w-full" data-testid={`skeleton-directory-button-${idx}`} />
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
