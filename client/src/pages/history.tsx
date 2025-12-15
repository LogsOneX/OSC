import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Clock,
  Search,
  User,
  Phone,
  Mail,
  AtSign,
  Smartphone,
  Wallet,
  Car,
  ShieldAlert,
  Calendar,
  ExternalLink,
  Repeat,
} from "lucide-react";
import type { SearchHistory, Case } from "@shared/schema";

const categoryConfig = {
  nik: { icon: User, label: "NIK", color: "text-blue-500" },
  name: { icon: User, label: "Name", color: "text-indigo-500" },
  phone: { icon: Phone, label: "Phone", color: "text-green-500" },
  email: { icon: Mail, label: "Email", color: "text-yellow-500" },
  username: { icon: AtSign, label: "Username", color: "text-purple-500" },
  imei: { icon: Smartphone, label: "IMEI", color: "text-pink-500" },
  crypto: { icon: Wallet, label: "Crypto", color: "text-orange-500" },
  vehicle: { icon: Car, label: "Vehicle", color: "text-cyan-500" },
  breach: { icon: ShieldAlert, label: "Breach", color: "text-red-500" },
};

function HistoryRow({ search, onReplay }: { search: SearchHistory; onReplay: () => void }) {
  const config = categoryConfig[search.searchType as keyof typeof categoryConfig] || categoryConfig.name;
  const Icon = config.icon;

  return (
    <TableRow data-testid={`history-row-${search.id}`}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-md bg-muted ${config.color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="font-mono text-sm">{search.searchQuery}</p>
            <Badge variant="outline" className="mt-1 text-xs">
              {config.label}
            </Badge>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{search.resultCount} results</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {search.createdAt ? new Date(search.createdAt).toLocaleString() : "N/A"}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Link href={`/search?type=${search.searchType}&query=${encodeURIComponent(search.searchQuery)}`}>
            <Button variant="ghost" size="sm" className="gap-1" data-testid={`button-replay-${search.id}`}>
              <Repeat className="h-3 w-3" />
              Replay
            </Button>
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function HistoryPage() {
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const { data: searchHistory, isLoading } = useQuery<SearchHistory[]>({
    queryKey: ["/api/search-history"],
  });

  const filteredHistory = searchHistory?.filter((search) => {
    const matchesSearch = search.searchQuery.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === "all" || search.searchType === categoryFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all" && search.createdAt) {
      const searchDate = new Date(search.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - searchDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === "today") matchesDate = daysDiff === 0;
      else if (dateFilter === "week") matchesDate = daysDiff <= 7;
      else if (dateFilter === "month") matchesDate = daysDiff <= 30;
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const stats = {
    total: searchHistory?.length || 0,
    today: searchHistory?.filter((s) => {
      if (!s.createdAt) return false;
      const d = new Date(s.createdAt);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length || 0,
    categories: new Set(searchHistory?.map((s) => s.searchType) || []).size,
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Search History</h1>
        <p className="text-muted-foreground">
          View and replay your previous searches
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Searches</span>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold" data-testid="stat-total-searches">
              {stats.total}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Today</span>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold" data-testid="stat-today-searches">
              {stats.today}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Categories Used</span>
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold" data-testid="stat-categories">
              {stats.categories}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Search Audit Trail</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter searches..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-10 w-48"
                  data-testid="input-filter-history"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32" data-testid="select-category-filter">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32" data-testid="select-date-filter">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="mt-2 h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : filteredHistory && filteredHistory.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Search Query</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((search) => (
                    <HistoryRow key={search.id} search={search} onReplay={() => {}} />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <Clock className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">No Search History</h3>
              <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
                {searchFilter || categoryFilter !== "all" || dateFilter !== "all"
                  ? "No searches match your filters."
                  : "Your search history will appear here."}
              </p>
              <Link href="/search">
                <Button variant="outline" className="mt-4 gap-2" data-testid="button-start-searching">
                  <Search className="h-4 w-4" />
                  Start Searching
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
