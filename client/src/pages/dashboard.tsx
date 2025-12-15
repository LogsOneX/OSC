import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Search,
  FolderKanban,
  Network,
  Clock,
  TrendingUp,
  Users,
  AlertTriangle,
  ChevronRight,
  Plus,
} from "lucide-react";
import type { Case, SearchHistory } from "@shared/schema";

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  loading,
}: {
  title: string;
  value: string | number;
  icon: typeof Search;
  trend?: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-3 h-8 w-16" />
          <Skeleton className="mt-2 h-3 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="mt-3 text-3xl font-bold" data-testid={`stat-${title.toLowerCase().replace(" ", "-")}`}>
          {value}
        </div>
        {trend && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span>{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentCaseCard({ caseData }: { caseData: Case }) {
  const statusColors = {
    active: "bg-green-500/10 text-green-500 border-green-500/20",
    monitoring: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    archived: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Link href={`/cases/${caseData.id}`}>
      <div 
        className="flex items-center justify-between rounded-md border border-border/50 bg-card/50 p-4 transition-colors hover-elevate"
        data-testid={`case-card-${caseData.id}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <FolderKanban className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">{caseData.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {caseData.description || "No description"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={statusColors[caseData.status as keyof typeof statusColors]}>
            {caseData.status}
          </Badge>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}

function RecentSearchItem({ search }: { search: SearchHistory }) {
  const categoryIcons: Record<string, string> = {
    nik: "ID",
    name: "Na",
    phone: "Ph",
    email: "Em",
    username: "Us",
    imei: "IM",
    crypto: "Cr",
    vehicle: "Ve",
    breach: "Br",
  };

  return (
    <div 
      className="flex items-center justify-between py-3"
      data-testid={`search-history-${search.id}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium">
          {categoryIcons[search.searchType] || "??"}
        </div>
        <div>
          <p className="text-sm font-medium font-mono">{search.searchQuery}</p>
          <p className="text-xs text-muted-foreground">
            {search.resultCount} results
          </p>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">
        {search.createdAt ? new Date(search.createdAt).toLocaleDateString() : ""}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { data: cases, isLoading: casesLoading } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
  });

  const { data: searchHistory, isLoading: historyLoading } = useQuery<SearchHistory[]>({
    queryKey: ["/api/search-history"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalCases: number;
    totalEntities: number;
    totalSearches: number;
    activeAlerts: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const recentCases = cases?.slice(0, 5) || [];
  const recentSearches = searchHistory?.slice(0, 5) || [];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here's an overview of your investigations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Cases"
          value={stats?.totalCases ?? 0}
          icon={FolderKanban}
          loading={statsLoading}
        />
        <StatCard
          title="Total Entities"
          value={stats?.totalEntities ?? 0}
          icon={Users}
          loading={statsLoading}
        />
        <StatCard
          title="Searches Today"
          value={stats?.totalSearches ?? 0}
          icon={Search}
          loading={statsLoading}
        />
        <StatCard
          title="Active Alerts"
          value={stats?.activeAlerts ?? 0}
          icon={AlertTriangle}
          loading={statsLoading}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <CardTitle className="text-base font-semibold">Recent Cases</CardTitle>
            <Link href="/cases">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-all-cases">
                View All
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {casesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-2 h-3 w-48" />
                  </div>
                </div>
              ))
            ) : recentCases.length > 0 ? (
              recentCases.map((c) => <RecentCaseCard key={c.id} caseData={c} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderKanban className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">No cases yet</p>
                <Link href="/cases">
                  <Button variant="outline" size="sm" className="mt-3 gap-2" data-testid="button-create-first-case">
                    <Plus className="h-3 w-3" />
                    Create First Case
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <CardTitle className="text-base font-semibold">Recent Searches</CardTitle>
            <Link href="/history">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-all-history">
                View All
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="mt-1 h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentSearches.length > 0 ? (
              <div className="divide-y divide-border/50">
                {recentSearches.map((s) => (
                  <RecentSearchItem key={s.id} search={s} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">No search history</p>
                <Link href="/search">
                  <Button variant="outline" size="sm" className="mt-3 gap-2" data-testid="button-start-searching">
                    <Search className="h-3 w-3" />
                    Start Searching
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/search">
              <Button variant="outline" className="w-full justify-start gap-3" data-testid="button-quick-search">
                <Search className="h-4 w-4" />
                New Search
              </Button>
            </Link>
            <Link href="/cases">
              <Button variant="outline" className="w-full justify-start gap-3" data-testid="button-quick-case">
                <FolderKanban className="h-4 w-4" />
                Create Case
              </Button>
            </Link>
            <Link href="/network">
              <Button variant="outline" className="w-full justify-start gap-3" data-testid="button-quick-network">
                <Network className="h-4 w-4" />
                Network Map
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="w-full justify-start gap-3" data-testid="button-quick-settings">
                <AlertTriangle className="h-4 w-4" />
                Configure APIs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
