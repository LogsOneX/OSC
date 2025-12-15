import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  Search,
  ArrowRight,
  Fingerprint,
  User,
  Phone,
  Mail,
  AtSign,
  Car,
  Wallet,
  CreditCard,
  Users,
  Trash2,
} from "lucide-react";

interface SearchHistoryItem {
  id: string;
  type: string;
  query: string;
  timestamp: string;
  resultCount: number;
}

interface RecentSearchesProps {
  searches: SearchHistoryItem[];
  onSearchClick?: (search: SearchHistoryItem) => void;
  onClear?: () => void;
}

const typeIcons: Record<string, React.ElementType> = {
  nik: Fingerprint,
  name: User,
  family: Users,
  phone: Phone,
  imei: CreditCard,
  email: Mail,
  username: AtSign,
  crypto: Wallet,
  vehicle: Car,
};

export function RecentSearches({ searches, onSearchClick, onClear }: RecentSearchesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Recent Searches</CardTitle>
          </div>
          {searches.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              data-testid="button-clear-history"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {searches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No recent searches. Start investigating!
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {searches.map((search) => {
                const Icon = typeIcons[search.type] || Search;
                return (
                  <div
                    key={search.id}
                    className="flex items-center justify-between gap-4 rounded-md border p-3 hover-elevate cursor-pointer"
                    onClick={() => onSearchClick?.(search)}
                    data-testid={`recent-search-${search.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium font-mono">{search.query}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="capitalize">
                            {search.type}
                          </Badge>
                          <span>{search.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {search.resultCount} results
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
