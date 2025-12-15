import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertTriangle, Calendar, Database, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface BreachData {
  id: string;
  name: string;
  domain: string;
  breachDate: string;
  addedDate: string;
  pwnCount: number;
  description: string;
  dataClasses: string[];
  isVerified: boolean;
  isSensitive: boolean;
  logoPath?: string;
}

interface BreachCardProps {
  breaches: BreachData[];
  email?: string;
}

export function BreachCard({ breaches, email }: BreachCardProps) {
  const [showSensitive, setShowSensitive] = useState(false);

  const severityColor = (count: number) => {
    if (count > 100000000) return "text-red-500 bg-red-500/10 border-red-500/20";
    if (count > 10000000) return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    if (count > 1000000) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-blue-500 bg-blue-500/10 border-blue-500/20";
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-lg">Data Breach Check</CardTitle>
              {email && (
                <p className="text-sm text-muted-foreground font-mono">{email}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                breaches.length > 0
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-green-500/10 text-green-500 border-green-500/20"
              }
            >
              {breaches.length > 0
                ? `${breaches.length} Breaches Found`
                : "No Breaches Found"}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSensitive(!showSensitive)}
              data-testid="button-toggle-sensitive"
            >
              {showSensitive ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {breaches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Lock className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="font-semibold text-lg">No Breaches Detected</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This email has not been found in any known data breaches.
            </p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-2">
            {breaches.map((breach) => (
              <AccordionItem
                key={breach.id}
                value={breach.id}
                className="rounded-md border px-4"
              >
                <AccordionTrigger className="hover:no-underline py-3" data-testid={`breach-${breach.id}`}>
                  <div className="flex flex-1 items-center justify-between gap-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <Database className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{breach.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {breach.domain}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={severityColor(breach.pwnCount)}
                      >
                        {formatNumber(breach.pwnCount)} records
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {breach.breachDate}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {breach.description}
                    </p>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Compromised Data
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {breach.dataClasses.map((dataClass, idx) => (
                          <Badge key={idx} variant="secondary">
                            {showSensitive || !breach.isSensitive
                              ? dataClass
                              : "••••••••"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {breach.isVerified && (
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          Verified Breach
                        </span>
                      )}
                      {breach.isSensitive && (
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          Sensitive Data
                        </span>
                      )}
                      <span>Added: {breach.addedDate}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
