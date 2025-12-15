import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Link, useParams } from "wouter";
import {
  Plus,
  ArrowLeft,
  User,
  Phone,
  Mail,
  AtSign,
  Wallet,
  Car,
  Smartphone,
  Network,
  Clock,
  Tag,
  FileText,
  Trash2,
  Edit,
  ExternalLink,
  Link2,
} from "lucide-react";
import type { Case, Entity, EntityRelationship } from "@shared/schema";

const entityTypeConfig = {
  person: { icon: User, color: "text-blue-500" },
  phone: { icon: Phone, color: "text-green-500" },
  email: { icon: Mail, color: "text-yellow-500" },
  username: { icon: AtSign, color: "text-purple-500" },
  wallet: { icon: Wallet, color: "text-orange-500" },
  vehicle: { icon: Car, color: "text-cyan-500" },
  imei: { icon: Smartphone, color: "text-pink-500" },
  domain: { icon: ExternalLink, color: "text-indigo-500" },
  ip: { icon: Network, color: "text-red-500" },
  organization: { icon: User, color: "text-teal-500" },
};

const riskColors = {
  unknown: "text-muted-foreground",
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-orange-500",
  critical: "text-red-500",
};

const addEntitySchema = z.object({
  type: z.string().min(1, "Type is required"),
  label: z.string().min(1, "Label is required"),
  notes: z.string().optional(),
  riskLevel: z.enum(["unknown", "low", "medium", "high", "critical"]).default("unknown"),
});

type AddEntityForm = z.infer<typeof addEntitySchema>;

const addRelationshipSchema = z.object({
  sourceEntityId: z.string().min(1, "Source entity is required"),
  targetEntityId: z.string().min(1, "Target entity is required"),
  relationshipType: z.string().min(1, "Relationship type is required"),
  strength: z.coerce.number().min(0).max(100).default(50),
  notes: z.string().optional(),
});

type AddRelationshipForm = z.infer<typeof addRelationshipSchema>;

const relationshipTypes = [
  "owns",
  "associated",
  "contacted",
  "linked",
  "works_with",
  "related_to",
  "controls",
  "finances",
];

function AddEntityDialog({ caseId, onSuccess }: { caseId: string; onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddEntityForm>({
    resolver: zodResolver(addEntitySchema),
    defaultValues: {
      type: "person",
      label: "",
      notes: "",
      riskLevel: "unknown",
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: AddEntityForm) => {
      return await apiRequest("POST", "/api/entities", { ...data, caseId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases", caseId, "entities"] });
      toast({ title: "Entity Added", description: "New entity has been added to the case." });
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
        <Button size="sm" className="gap-2" data-testid="button-add-entity">
          <Plus className="h-4 w-4" />
          Add Entity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Entity to Case</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => addMutation.mutate(d))} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-entity-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(entityTypeConfig).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label / Identifier</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe, +62xxx, wallet address" {...field} data-testid="input-entity-label" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="riskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-entity-risk">
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unknown">Unknown</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes..."
                      className="resize-none"
                      {...field}
                      data-testid="input-entity-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addMutation.isPending} data-testid="button-submit-entity">
                {addMutation.isPending ? "Adding..." : "Add Entity"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function EntityCard({ entity }: { entity: Entity }) {
  const config = entityTypeConfig[entity.type as keyof typeof entityTypeConfig] || entityTypeConfig.person;
  const Icon = config.icon;
  const riskColor = riskColors[entity.riskLevel as keyof typeof riskColors] || riskColors.unknown;

  return (
    <Card className="overflow-hidden" data-testid={`entity-card-${entity.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted ${config.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium truncate">{entity.label}</h4>
              <Badge variant="outline" className="shrink-0 text-xs">
                {entity.type}
              </Badge>
            </div>
            {entity.notes && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{entity.notes}</p>
            )}
            <div className="mt-2 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-medium">{entity.confidenceScore || 0}%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Risk:</span>
                <span className={`font-medium capitalize ${riskColor}`}>{entity.riskLevel}</span>
              </div>
            </div>
          </div>
        </div>
        {entity.tags && entity.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {entity.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddRelationshipDialog({ entities, onSuccess }: { entities: Entity[]; onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddRelationshipForm>({
    resolver: zodResolver(addRelationshipSchema),
    defaultValues: {
      sourceEntityId: "",
      targetEntityId: "",
      relationshipType: "associated",
      strength: 50,
      notes: "",
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: AddRelationshipForm) => {
      return await apiRequest("POST", "/api/relationships", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/relationships"] });
      toast({ title: "Relationship Created", description: "Entity relationship has been created." });
      form.reset();
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  if (entities.length < 2) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" data-testid="button-add-relationship">
          <Link2 className="h-4 w-4" />
          Add Relationship
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Entity Relationship</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => addMutation.mutate(d))} className="space-y-4">
            <FormField
              control={form.control}
              name="sourceEntityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source Entity</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-source-entity">
                        <SelectValue placeholder="Select source entity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entities.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.label} ({entity.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetEntityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Entity</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-target-entity">
                        <SelectValue placeholder="Select target entity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entities.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.label} ({entity.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="relationshipType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-relationship-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {relationshipTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, " ").charAt(0).toUpperCase() + type.replace(/_/g, " ").slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="strength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strength ({field.value}%)</FormLabel>
                  <FormControl>
                    <Input
                      type="range"
                      min={0}
                      max={100}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      data-testid="input-relationship-strength"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes..."
                      className="resize-none"
                      {...field}
                      data-testid="input-relationship-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addMutation.isPending} data-testid="button-submit-relationship">
                {addMutation.isPending ? "Creating..." : "Create Relationship"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function CaseDetailPage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [caseNotes, setCaseNotes] = useState("");
  const { toast } = useToast();

  const { data: caseData, isLoading: caseLoading } = useQuery<Case>({
    queryKey: ["/api/cases", caseId],
    enabled: !!caseId,
  });

  const { data: entities, isLoading: entitiesLoading } = useQuery<Entity[]>({
    queryKey: ["/api/cases", caseId, "entities"],
    enabled: !!caseId,
  });

  const saveNotesMutation = useMutation({
    mutationFn: async (notes: string) => {
      return await apiRequest("PATCH", `/api/cases/${caseId}`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases", caseId] });
      toast({ title: "Notes Saved", description: "Case notes have been updated." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  useEffect(() => {
    if (caseData?.notes) {
      setCaseNotes(caseData.notes);
    }
  }, [caseData?.notes]);

  if (caseLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-6 lg:p-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="font-semibold">Case Not Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">The requested case does not exist.</p>
            <Link href="/cases">
              <Button variant="outline" className="mt-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Cases
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <Link href="/cases">
          <Button variant="ghost" size="sm" className="gap-2 mb-4" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
            Back to Cases
          </Button>
        </Link>
        
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{caseData.title}</h1>
            <p className="mt-1 text-muted-foreground">{caseData.description || "No description"}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className={
                  caseData.status === "active"
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : caseData.status === "monitoring"
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    : "bg-muted text-muted-foreground border-border"
                }
              >
                {caseData.status}
              </Badge>
              {caseData.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <AddRelationshipDialog entities={entities || []} />
            <AddEntityDialog caseId={caseId!} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="entities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entities" className="gap-2" data-testid="tab-entities">
            <User className="h-4 w-4" />
            Entities ({entities?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="network" className="gap-2" data-testid="tab-network">
            <Network className="h-4 w-4" />
            Network
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2" data-testid="tab-timeline">
            <Clock className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2" data-testid="tab-notes">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entities">
          {entitiesLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          ) : entities && entities.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entities.map((entity) => (
                <EntityCard key={entity.id} entity={entity} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <User className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">No Entities</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add entities to start building your investigation.
                </p>
                <AddEntityDialog caseId={caseId!} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Network className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">Network Visualization</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add at least 2 entities to visualize relationships.
              </p>
              <Link href="/network">
                <Button variant="outline" className="mt-4 gap-2">
                  <Network className="h-4 w-4" />
                  Open Full Network Map
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Clock className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">Case Timeline</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Activity timeline will appear here as you work on the case.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardContent className="p-6">
              <Textarea
                placeholder="Add case notes here..."
                className="min-h-[200px] resize-none"
                value={caseNotes}
                onChange={(e) => setCaseNotes(e.target.value)}
                data-testid="textarea-case-notes"
              />
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={() => saveNotesMutation.mutate(caseNotes)}
                  disabled={saveNotesMutation.isPending}
                  data-testid="button-save-notes"
                >
                  {saveNotesMutation.isPending ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
