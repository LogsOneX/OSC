import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Car,
  Copy,
  Calendar,
  Palette,
  Fuel,
  Gauge,
  MapPin,
  User,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VehicleData {
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  engineNumber: string;
  chassisNumber: string;
  fuelType: string;
  engineCapacity: string;
  registrationDate: string;
  expiryDate: string;
  registrationStatus: "active" | "expired" | "blocked";
  ownerName: string;
  ownerAddress: string;
  ownerNik?: string;
  taxStatus: "paid" | "unpaid" | "overdue";
  lastTaxPayment?: string;
}

interface VehicleCardProps {
  data: VehicleData;
  onViewOwner?: () => void;
}

export function VehicleCard({ data, onViewOwner }: VehicleCardProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  const statusColors = {
    active: "bg-green-500/10 text-green-500 border-green-500/20",
    expired: "bg-red-500/10 text-red-500 border-red-500/20",
    blocked: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };

  const taxColors = {
    paid: "bg-green-500/10 text-green-500 border-green-500/20",
    unpaid: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    overdue: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary/10">
              <Car className="h-7 w-7 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-mono">{data.plateNumber}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(data.plateNumber, "Plate number")}
                  data-testid="button-copy-plate"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {data.brand} {data.model} ({data.year})
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className={statusColors[data.registrationStatus]}>
              {data.registrationStatus.charAt(0).toUpperCase() +
                data.registrationStatus.slice(1)}
            </Badge>
            <Badge variant="outline" className={taxColors[data.taxStatus]}>
              Tax: {data.taxStatus.charAt(0).toUpperCase() + data.taxStatus.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Vehicle Details
            </h3>
            <div className="space-y-3">
              <DataRow icon={Palette} label="Color" value={data.color} />
              <DataRow icon={Fuel} label="Fuel Type" value={data.fuelType} />
              <DataRow icon={Gauge} label="Engine Capacity" value={data.engineCapacity} />
              <DataRow
                icon={FileText}
                label="Engine Number"
                value={data.engineNumber}
                mono
                copyable
                onCopy={() => copyToClipboard(data.engineNumber, "Engine number")}
              />
              <DataRow
                icon={FileText}
                label="Chassis Number"
                value={data.chassisNumber}
                mono
                copyable
                onCopy={() => copyToClipboard(data.chassisNumber, "Chassis number")}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Registration Info
            </h3>
            <div className="space-y-3">
              <DataRow
                icon={Calendar}
                label="Registration Date"
                value={data.registrationDate}
              />
              <DataRow
                icon={Calendar}
                label="Expiry Date"
                value={data.expiryDate}
                highlight={data.registrationStatus === "expired"}
              />
              {data.lastTaxPayment && (
                <DataRow
                  icon={Calendar}
                  label="Last Tax Payment"
                  value={data.lastTaxPayment}
                />
              )}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Owner Information
            </h3>
            <Button variant="outline" size="sm" onClick={onViewOwner} data-testid="button-view-owner">
              <User className="mr-2 h-4 w-4" />
              View Full Profile
            </Button>
          </div>
          <div className="rounded-md bg-muted/50 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="ml-2 text-sm font-medium">{data.ownerName}</span>
              </div>
              {data.ownerNik && (
                <Badge variant="outline" className="font-mono text-xs">
                  NIK: {data.ownerNik}
                </Badge>
              )}
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="text-sm text-muted-foreground">Address:</span>
                <p className="text-sm font-medium mt-0.5">{data.ownerAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {data.registrationStatus !== "active" && (
          <div className="flex items-center gap-3 rounded-md bg-destructive/10 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm font-medium text-destructive">
                Registration {data.registrationStatus === "expired" ? "Expired" : "Blocked"}
              </p>
              <p className="text-xs text-muted-foreground">
                This vehicle registration requires attention.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DataRow({
  icon: Icon,
  label,
  value,
  mono = false,
  copyable = false,
  onCopy,
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
  onCopy?: () => void;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex flex-1 items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1">
          <span
            className={`text-sm font-medium ${mono ? "font-mono" : ""} ${
              highlight ? "text-destructive" : ""
            }`}
          >
            {value}
          </span>
          {copyable && onCopy && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={onCopy}
              data-testid={`button-copy-${label.toLowerCase().replace(/\s/g, "-")}`}
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
