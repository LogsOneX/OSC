import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Search,
  User,
  Phone,
  Mail,
  AtSign,
  Smartphone,
  Wallet,
  Car,
  ShieldAlert,
  Download,
  Plus,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  FileJson,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import type { Case, SearchHistory } from "@shared/schema";

const searchCategories = [
  { id: "nik", label: "NIK", icon: User, placeholder: "Enter NIK number..." },
  { id: "name", label: "Name", icon: User, placeholder: "Enter full name..." },
  { id: "phone", label: "Phone", icon: Phone, placeholder: "Enter phone number..." },
  { id: "email", label: "Email", icon: Mail, placeholder: "Enter email address..." },
  { id: "username", label: "Username", icon: AtSign, placeholder: "Enter username..." },
  { id: "imei", label: "IMEI", icon: Smartphone, placeholder: "Enter IMEI number..." },
  { id: "crypto", label: "Crypto Wallet", icon: Wallet, placeholder: "Enter wallet address..." },
  { id: "vehicle", label: "Vehicle", icon: Car, placeholder: "Enter plate number..." },
  { id: "breach", label: "Data Breach", icon: ShieldAlert, placeholder: "Enter email or domain..." },
];

interface SearchResult {
  id: string;
  type: string;
  title: string;
  data: Record<string, unknown>;
  source: string;
  confidence: number;
  timestamp: string;
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 80 ? "bg-green-500" : value >= 50 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="confidence-bar w-24">
      <div className={`confidence-fill ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function ResultCard({ result, onAddToCase }: { result: SearchResult; onAddToCase: () => void }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{result.title}</h4>
              <Badge variant="outline" className="text-xs">
                {result.type}
              </Badge>
            </div>
            
            <div className="mt-3 space-y-1.5">
              {Object.entries(result.data).slice(0, 5).map(([key, value]) => (
                <div key={key} className="flex items-baseline gap-2 text-sm">
                  <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}:</span>
                  <span className="font-mono text-xs">{String(value)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ExternalLink className="h-3 w-3" />
                <span>{result.source}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                <span>{new Date(result.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Confidence</span>
              <ConfidenceBar value={result.confidence} />
              <span className="text-xs font-medium">{result.confidence}%</span>
            </div>
            <Button variant="outline" size="sm" onClick={onAddToCase} data-testid={`button-add-to-case-${result.id}`}>
              <Plus className="mr-1 h-3 w-3" />
              Add to Case
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ExportDialog({ results }: { results: SearchResult[] }) {
  const [format, setFormat] = useState<"json" | "csv" | "pdf">("json");

  const handleExport = () => {
    if (format === "json") {
      const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `osint-search-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "csv") {
      const headers = ["id", "type", "title", "source", "confidence", "timestamp"];
      const csvContent = [
        headers.join(","),
        ...results.map((r) => headers.map((h) => `"${r[h as keyof SearchResult] || ""}"`).join(",")),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `osint-search-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" data-testid="button-export">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Results</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={format === "json" ? "default" : "outline"}
              className="flex-col gap-2 h-auto py-4"
              onClick={() => setFormat("json")}
              data-testid="button-export-json"
            >
              <FileJson className="h-6 w-6" />
              <span>JSON</span>
            </Button>
            <Button
              variant={format === "csv" ? "default" : "outline"}
              className="flex-col gap-2 h-auto py-4"
              onClick={() => setFormat("csv")}
              data-testid="button-export-csv"
            >
              <FileSpreadsheet className="h-6 w-6" />
              <span>CSV</span>
            </Button>
            <Button
              variant={format === "pdf" ? "default" : "outline"}
              className="flex-col gap-2 h-auto py-4"
              onClick={() => setFormat("pdf")}
              disabled
              data-testid="button-export-pdf"
            >
              <FileText className="h-6 w-6" />
              <span>PDF</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {results.length} results will be exported in {format.toUpperCase()} format.
          </p>
          <Button onClick={handleExport} className="w-full" data-testid="button-confirm-export">
            Download {format.toUpperCase()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SearchPage() {
  const [activeCategory, setActiveCategory] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { toast } = useToast();

  const { data: cases } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
  });

  const { data: recentSearches } = useQuery<SearchHistory[]>({
    queryKey: ["/api/search-history"],
  });

  const searchMutation = useMutation({
    mutationFn: async (data: { type: string; query: string }) => {
      const response = await apiRequest("POST", "/api/search", data);
      return response;
    },
    onSuccess: (data: { results: SearchResult[] }) => {
      setSearchResults(data.results || []);
      queryClient.invalidateQueries({ queryKey: ["/api/search-history"] });
      toast({
        title: "Search Complete",
        description: `Found ${data.results?.length || 0} results`,
      });
    },
    onError: (error) => {
      toast({
        title: "Search Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }
    searchMutation.mutate({ type: activeCategory, query: searchQuery });
  };

  const addToCaseMutation = useMutation({
    mutationFn: async (data: { caseId: string; result: SearchResult }) => {
      return await apiRequest("POST", "/api/entities", {
        caseId: data.caseId,
        type: data.result.type,
        label: data.result.title,
        data: data.result.data,
        sourceAttribution: data.result.source,
        confidenceScore: data.result.confidence,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases", variables.caseId, "entities"] });
      toast({
        title: "Added to Case",
        description: "Entity has been added to the case.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Add",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddToCase = (result: SearchResult) => {
    if (!selectedCase) {
      toast({
        title: "No Case Selected",
        description: "Please select a case first",
        variant: "destructive",
      });
      return;
    }
    addToCaseMutation.mutate({ caseId: selectedCase, result });
  };

  const activeCategoryData = searchCategories.find((c) => c.id === activeCategory);

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">OSINT Search</h1>
          <p className="text-muted-foreground">
            Search across multiple data sources with a single query.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <ScrollArea className="w-full pb-2">
                <TabsList className="inline-flex h-auto gap-1 bg-transparent p-0">
                  {searchCategories.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="gap-2 rounded-md border border-transparent px-3 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10"
                      data-testid={`tab-${cat.id}`}
                    >
                      <cat.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{cat.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>

              <div className="mt-4 flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={activeCategoryData?.placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 font-mono"
                    data-testid="input-search"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={searchMutation.isPending}
                  className="gap-2"
                  data-testid="button-search"
                >
                  {searchMutation.isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Select value={selectedCase} onValueChange={setSelectedCase}>
              <SelectTrigger className="w-48" data-testid="select-case">
                <SelectValue placeholder="Select case..." />
              </SelectTrigger>
              <SelectContent>
                {cases?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {searchResults.length > 0 && (
              <Badge variant="secondary">
                {searchResults.length} results
              </Badge>
            )}
          </div>
          {searchResults.length > 0 && <ExportDialog results={searchResults} />}
        </div>

        <div className="space-y-4">
          {searchMutation.isPending ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <Skeleton className="h-20 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : searchResults.length > 0 ? (
            searchResults.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                onAddToCase={() => handleAddToCase(result)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-semibold">Start Searching</h3>
                <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
                  Select a category above and enter your query to search across connected data sources.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="hidden w-80 border-l border-border bg-card/50 lg:block">
        <div className="p-4">
          <h3 className="font-semibold">Recent Searches</h3>
          <p className="text-xs text-muted-foreground">Your search history</p>
        </div>
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-1 px-4">
            {recentSearches?.slice(0, 20).map((search) => (
              <button
                key={search.id}
                onClick={() => {
                  setActiveCategory(search.searchType);
                  setSearchQuery(search.searchQuery);
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover-elevate"
                data-testid={`history-item-${search.id}`}
              >
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-mono text-xs">{search.searchQuery}</p>
                  <p className="text-xs text-muted-foreground">
                    {search.searchType} · {search.resultCount} results
                  </p>
                </div>
              </button>
            ))}
            {(!recentSearches || recentSearches.length === 0) && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No recent searches
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
