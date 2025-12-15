import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  ExternalLink,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Briefcase,
  Building,
  Shield,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PersonData {
  nik: string;
  name: string;
  birthDate: string;
  birthPlace: string;
  gender: string;
  address: string;
  province: string;
  city: string;
  district: string;
  village: string;
  religion: string;
  maritalStatus: string;
  occupation: string;
  nationality: string;
  phones?: string[];
  emails?: string[];
  verified?: boolean;
}

interface PersonCardProps {
  data: PersonData;
  onViewNetwork?: () => void;
}

export function PersonCard({ data, onViewNetwork }: PersonCardProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{data.name}</CardTitle>
                {data.verified && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  NIK: {data.nik}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(data.nik, "NIK")}
                  data-testid="button-copy-nik"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onViewNetwork} data-testid="button-view-network">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Network
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Personal Information
            </h3>
            <div className="space-y-3">
              <DataRow icon={Calendar} label="Tanggal Lahir" value={data.birthDate} />
              <DataRow icon={MapPin} label="Tempat Lahir" value={data.birthPlace} />
              <DataRow icon={Shield} label="Jenis Kelamin" value={data.gender} />
              <DataRow icon={Building} label="Agama" value={data.religion} />
              <DataRow icon={Briefcase} label="Pekerjaan" value={data.occupation} />
              <DataRow icon={Shield} label="Status Pernikahan" value={data.maritalStatus} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Address
            </h3>
            <div className="rounded-md bg-muted/50 p-4">
              <p className="text-sm leading-relaxed">{data.address}</p>
              <Separator className="my-3" />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Provinsi:</span>
                  <span className="ml-1 font-medium">{data.province}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Kota:</span>
                  <span className="ml-1 font-medium">{data.city}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Kecamatan:</span>
                  <span className="ml-1 font-medium">{data.district}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Kelurahan:</span>
                  <span className="ml-1 font-medium">{data.village}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {(data.phones?.length || data.emails?.length) && (
          <>
            <Separator />
            <div className="grid gap-6 md:grid-cols-2">
              {data.phones && data.phones.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Phone Numbers
                  </h3>
                  <div className="space-y-2">
                    {data.phones.map((phone, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{phone}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(phone, "Phone")}
                          data-testid={`button-copy-phone-${idx}`}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.emails && data.emails.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Email Addresses
                  </h3>
                  <div className="space-y-2">
                    {data.emails.map((email, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{email}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(email, "Email")}
                          data-testid={`button-copy-email-${idx}`}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function DataRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex flex-1 items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}
