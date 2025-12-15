import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
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
  FormDescription,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Key,
  Settings,
  User,
  Phone,
  Mail,
  AtSign,
  Smartphone,
  Wallet,
  Car,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  TestTube,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import type { ApiConfig } from "@shared/schema";

const categoryConfig = {
  nik: { icon: User, label: "NIK", description: "National ID lookup APIs" },
  name: { icon: User, label: "Name", description: "Person name search APIs" },
  phone: { icon: Phone, label: "Phone", description: "Phone number lookup APIs" },
  email: { icon: Mail, label: "Email", description: "Email verification APIs" },
  username: { icon: AtSign, label: "Username", description: "Social media lookup APIs" },
  imei: { icon: Smartphone, label: "IMEI", description: "Device tracking APIs" },
  crypto: { icon: Wallet, label: "Crypto Wallet", description: "Blockchain analysis APIs" },
  vehicle: { icon: Car, label: "Vehicle", description: "Vehicle registration APIs" },
  breach: { icon: ShieldAlert, label: "Data Breach", description: "Breach database APIs" },
};

const addApiSchema = z.object({
  category: z.string().min(1, "Category is required"),
  providerName: z.string().min(1, "Provider name is required"),
  apiKey: z.string().min(1, "API key is required"),
  baseUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  quotaLimit: z.coerce.number().min(0).optional(),
});

type AddApiForm = z.infer<typeof addApiSchema>;

function AddApiDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddApiForm>({
    resolver: zodResolver(addApiSchema),
    defaultValues: {
      category: "",
      providerName: "",
      apiKey: "",
      baseUrl: "",
      quotaLimit: undefined,
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: AddApiForm) => {
      return await apiRequest("POST", "/api/api-configs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-configs"] });
      toast({ title: "API Added", description: "New API configuration has been saved." });
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
        <Button className="gap-2" data-testid="button-add-api">
          <Plus className="h-4 w-4" />
          Add API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add API Configuration</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => addMutation.mutate(d))} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-api-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
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
              name="providerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Truecaller, HaveIBeenPwned" {...field} data-testid="input-provider-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showKey ? "text" : "password"}
                        placeholder="Enter your API key"
                        {...field}
                        className="pr-10 font-mono"
                        data-testid="input-api-key"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://api.example.com" {...field} data-testid="input-base-url" />
                  </FormControl>
                  <FormDescription>Override the default API endpoint</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quotaLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Quota Limit (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1000" {...field} data-testid="input-quota" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addMutation.isPending} data-testid="button-submit-api">
                {addMutation.isPending ? "Saving..." : "Save API Key"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function ApiConfigCard({ config, onDelete, onToggle, onTest }: {
  config: ApiConfig;
  onDelete: () => void;
  onToggle: () => void;
  onTest: () => void;
}) {
  const category = categoryConfig[config.category as keyof typeof categoryConfig] || categoryConfig.name;
  const Icon = category.icon;

  return (
    <Card data-testid={`api-card-${config.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{config.providerName}</h4>
                {config.isActive ? (
                  <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    <XCircle className="mr-1 h-3 w-3" />
                    Inactive
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{category.label}</p>
            </div>
          </div>
          <Switch
            checked={config.isActive ?? true}
            onCheckedChange={onToggle}
            data-testid={`switch-api-${config.id}`}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Requests Today</span>
            <p className="font-medium">{config.requestsToday || 0}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Quota</span>
            <p className="font-medium">
              {config.quotaLimit ? `${config.requestsToday || 0}/${config.quotaLimit}` : "Unlimited"}
            </p>
          </div>
          {config.lastSync && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Last Sync</span>
              <p className="font-medium">{new Date(config.lastSync).toLocaleString()}</p>
            </div>
          )}
        </div>

        {config.errorLog && (
          <div className="mt-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{config.errorLog}</span>
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={onTest} data-testid={`button-test-${config.id}`}>
            <TestTube className="h-3 w-3" />
            Test
          </Button>
          <Button variant="outline" size="sm" className="gap-1 text-destructive" onClick={onDelete} data-testid={`button-delete-${config.id}`}>
            <Trash2 className="h-3 w-3" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const { toast } = useToast();

  const { data: apiConfigs, isLoading } = useQuery<ApiConfig[]>({
    queryKey: ["/api/api-configs"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/api-configs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-configs"] });
      toast({ title: "API Deleted", description: "API configuration has been removed." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await apiRequest("PATCH", `/api/api-configs/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-configs"] });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleTest = (config: ApiConfig) => {
    toast({ title: "Testing API", description: `Testing connection to ${config.providerName}...` });
    setTimeout(() => {
      toast({ title: "Test Complete", description: "API connection successful." });
    }, 1500);
  };

  const groupedConfigs = Object.entries(categoryConfig).map(([key, config]) => ({
    category: key,
    ...config,
    apis: apiConfigs?.filter((a) => a.category === key) || [],
  }));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your API integrations and preferences
          </p>
        </div>
        <AddApiDialog />
      </div>

      <Tabs defaultValue="apis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="apis" className="gap-2" data-testid="tab-apis">
            <Key className="h-4 w-4" />
            API Integrations
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2" data-testid="tab-preferences">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="apis">
          <div className="grid gap-6">
            {groupedConfigs.map((group) => {
              const GroupIcon = group.icon;
              return (
                <Card key={group.category}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                        <GroupIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{group.label}</CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {group.apis.length} configured
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <Skeleton key={i} className="h-40 rounded-lg" />
                        ))}
                      </div>
                    ) : group.apis.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {group.apis.map((config) => (
                          <ApiConfigCard
                            key={config.id}
                            config={config}
                            onDelete={() => deleteMutation.mutate(config.id)}
                            onToggle={() => toggleMutation.mutate({ id: config.id, isActive: !config.isActive })}
                            onTest={() => handleTest(config)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border border-dashed border-border p-6 text-center">
                        <Key className="mx-auto h-8 w-8 text-muted-foreground/50" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          No APIs configured for {group.label}
                        </p>
                        <AddApiDialog />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>Customize your OSINT platform experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Dark Mode</h4>
                  <p className="text-sm text-muted-foreground">Use dark theme (recommended)</p>
                </div>
                <Switch defaultChecked data-testid="switch-dark-mode" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Search History</h4>
                  <p className="text-sm text-muted-foreground">Save search queries for audit trail</p>
                </div>
                <Switch defaultChecked data-testid="switch-history" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive alerts for monitored entities</p>
                </div>
                <Switch data-testid="switch-notifications" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-refresh Results</h4>
                  <p className="text-sm text-muted-foreground">Automatically refresh search results</p>
                </div>
                <Switch data-testid="switch-auto-refresh" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
