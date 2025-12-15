import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Globe,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
} from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiX,
  SiLinkedin,
  SiTiktok,
  SiWhatsapp,
  SiTelegram,
  SiGithub,
  SiSpotify,
  SiNetflix,
  SiDiscord,
} from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

interface AccountInfo {
  platform: string;
  username?: string;
  registered: boolean;
  profileUrl?: string;
  lastActive?: string;
}

interface AccountsCardProps {
  accounts: AccountInfo[];
  searchQuery?: string;
}

const platformIcons: Record<string, React.ElementType> = {
  Facebook: SiFacebook,
  Instagram: SiInstagram,
  Twitter: SiX,
  LinkedIn: SiLinkedin,
  TikTok: SiTiktok,
  WhatsApp: SiWhatsapp,
  Telegram: SiTelegram,
  GitHub: SiGithub,
  Spotify: SiSpotify,
  Netflix: SiNetflix,
  Discord: SiDiscord,
};

export function AccountsCard({ accounts, searchQuery }: AccountsCardProps) {
  const { toast } = useToast();
  const registeredCount = accounts.filter((a) => a.registered).length;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Username copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Registered Accounts</CardTitle>
              {searchQuery && (
                <p className="text-sm text-muted-foreground font-mono">
                  {searchQuery}
                </p>
              )}
            </div>
          </div>
          <Badge variant="secondary">
            {registeredCount} of {accounts.length} Found
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {accounts.map((account, idx) => {
              const Icon = platformIcons[account.platform] || Globe;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between gap-4 rounded-md border p-3 ${
                    account.registered
                      ? "bg-green-500/5 border-green-500/20"
                      : "bg-muted/30 border-border"
                  }`}
                  data-testid={`account-${account.platform.toLowerCase()}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-md ${
                        account.registered ? "bg-green-500/10" : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          account.registered
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{account.platform}</p>
                      {account.username && (
                        <p className="text-xs text-muted-foreground font-mono">
                          @{account.username}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {account.lastActive && (
                      <span className="text-xs text-muted-foreground">
                        Active: {account.lastActive}
                      </span>
                    )}
                    {account.registered ? (
                      <>
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-500 border-green-500/20"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Found
                        </Badge>
                        {account.username && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyToClipboard(account.username!)}
                            data-testid={`button-copy-${account.platform.toLowerCase()}`}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                        {account.profileUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => window.open(account.profileUrl, "_blank")}
                            data-testid={`button-open-${account.platform.toLowerCase()}`}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        <XCircle className="mr-1 h-3 w-3" />
                        Not Found
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
