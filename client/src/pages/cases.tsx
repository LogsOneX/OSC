import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useRoute } from "wouter";
import {
  Plus,
  FolderKanban,
  Search,
  MoreVertical,
  Calendar,
  Users,
  Tag,
  ChevronRight,
  Archive,
  Eye,
  Trash2,
  Network,
  Clock,
} from "lucide-react";
import type { Case, Entity } from "@shared/schema";

const createCaseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  status: z.enum(["active", "monitoring", "archived"]).default("active"),
  tags: z.string().optional(),
});

type CreateCaseForm = z.infer<typeof createCaseSchema>;

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: Eye,
  },
  monitoring: {
    label: "Monitoring",
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    icon: Clock,
  },
  archived: {
    label: "Archived",
    color: "bg-muted text-muted-foreground border-border",
    icon: Archive,
  },
};

function CreateCaseDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateCaseForm>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "active",
      tags: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateCaseForm) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      return await apiRequest("POST", "/api/cases", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Case Created", description: "New investigation case has been created." });
      form.reset();
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid="button-create-case">
          <Plus className="h-4 w-4" />
          New Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Investigation Case</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter case title..." {...field} data-testid="input-case-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the investigation..."
                      className="resize-none"
                      {...field}
                      data-testid="input-case-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-case-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="fraud, financial, high-priority" {...field} data-testid="input-case-tags" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-case">
                {createMutation.isPending ? "Creating..." : "Create Case"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CaseCard({ caseData }: { caseData: Case }) {
  const status = statusConfig[caseData.status as keyof typeof statusConfig] || statusConfig.active;
  const StatusIcon = status.icon;

  return (
    <Link href={`/cases/${caseData.id}`}>
      <Card className="transition-all hover-elevate cursor-pointer" data-testid={`case-card-${caseData.id}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{caseData.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {caseData.description || "No description provided"}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={status.color}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{caseData.createdAt ? new Date(caseData.createdAt).toLocaleDateString() : "N/A"}</span>
              </div>
              {caseData.tags && caseData.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{caseData.tags.length} tags</span>
                </div>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {caseData.tags && caseData.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {caseData.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {caseData.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{caseData.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: cases, isLoading } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
  });

  const filteredCases = cases?.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const caseCounts = {
    all: cases?.length || 0,
    active: cases?.filter((c) => c.status === "active").length || 0,
    monitoring: cases?.filter((c) => c.status === "monitoring").length || 0,
    archived: cases?.filter((c) => c.status === "archived").length || 0,
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cases</h1>
          <p className="text-muted-foreground">
            Manage your investigation cases
          </p>
        </div>
        <CreateCaseDialog />
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-cases"
          />
        </div>
        <div className="flex gap-2">
          {Object.entries(caseCounts).map(([status, count]) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="gap-1"
              data-testid={`filter-${status}`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              <Badge variant="secondary" className="ml-1 text-xs">
                {count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="mt-2 h-4 w-full" />
                  </div>
                </div>
                <Skeleton className="mt-4 h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCases && filteredCases.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((c) => (
            <CaseCard key={c.id} caseData={c} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FolderKanban className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-semibold">No Cases Found</h3>
            <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters."
                : "Create your first investigation case to get started."}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <CreateCaseDialog />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
