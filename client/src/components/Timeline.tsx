import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Filter,
  User,
  Phone,
  Mail,
  Car,
  Shield,
  Globe,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface TimelineEvent {
  id: string;
  type: "account" | "breach" | "phone" | "vehicle" | "personal" | "activity";
  title: string;
  description: string;
  date: string;
  platform?: string;
  icon?: React.ElementType;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const eventIcons: Record<string, React.ElementType> = {
  account: Globe,
  breach: Shield,
  phone: Phone,
  vehicle: Car,
  personal: User,
  activity: Mail,
};

const eventColors: Record<string, string> = {
  account: "bg-blue-500",
  breach: "bg-red-500",
  phone: "bg-green-500",
  vehicle: "bg-orange-500",
  personal: "bg-purple-500",
  activity: "bg-cyan-500",
};

export function Timeline({ events }: TimelineProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredEvents =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const groupedByYear = sortedEvents.reduce((acc, event) => {
    const year = new Date(event.date).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const years = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
              <p className="text-sm text-muted-foreground">
                {sortedEvents.length} events recorded
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40" data-testid="select-filter">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="account">Accounts</SelectItem>
                <SelectItem value="breach">Breaches</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="w-full">
          <div className="flex gap-8 pb-4">
            {years.map((year) => (
              <div key={year} className="min-w-[300px]">
                <div className="sticky top-0 mb-4 flex items-center gap-2 bg-card pb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-bold">{year}</span>
                  <Badge variant="secondary">
                    {groupedByYear[year].length}
                  </Badge>
                </div>

                <div className="relative space-y-4 pl-6">
                  <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />

                  {groupedByYear[year].map((event) => {
                    const Icon = eventIcons[event.type] || Globe;
                    return (
                      <div
                        key={event.id}
                        className="relative"
                        data-testid={`timeline-event-${event.id}`}
                      >
                        <div
                          className={`absolute -left-4 top-1 h-4 w-4 rounded-full ${
                            eventColors[event.type]
                          } flex items-center justify-center`}
                        >
                          <Icon className="h-2.5 w-2.5 text-white" />
                        </div>

                        <div className="rounded-md border bg-card p-3 hover-elevate">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">{event.title}</p>
                                {event.platform && (
                                  <Badge variant="outline">
                                    {event.platform}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {event.description}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(event.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {sortedEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold">No Events Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              No timeline events match the current filter.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
