import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Users,
  Shield,
  Clock,
  TrendingUp,
  Database,
} from "lucide-react";

interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ElementType;
}

interface StatsCardsProps {
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  {
    label: "Total Searches",
    value: "12,847",
    change: "+12%",
    changeType: "positive",
    icon: Search,
  },
  {
    label: "Profiles Found",
    value: "8,293",
    change: "+8%",
    changeType: "positive",
    icon: Users,
  },
  {
    label: "Breaches Detected",
    value: "1,429",
    change: "-3%",
    changeType: "negative",
    icon: Shield,
  },
  {
    label: "Avg Response Time",
    value: "1.2s",
    change: "-15%",
    changeType: "positive",
    icon: Clock,
  },
];

export function StatsCards({ stats = defaultStats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <Card key={idx} data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              {stat.change && (
                <span
                  className={`text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-500"
                      : stat.changeType === "negative"
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
