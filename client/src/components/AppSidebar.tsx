import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Search,
  Network,
  Clock,
  Shield,
  Car,
  User,
  FileText,
  Settings,
  Database,
  Fingerprint,
  Mail,
  Phone,
  Wallet,
  AtSign,
  CreditCard,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const searchTypes = [
  { title: "NIK", url: "/search/nik", icon: Fingerprint },
  { title: "Nama", url: "/search/name", icon: User },
  { title: "Keluarga", url: "/search/family", icon: Users },
  { title: "Telepon", url: "/search/phone", icon: Phone },
  { title: "IMEI", url: "/search/imei", icon: CreditCard },
  { title: "Email", url: "/search/email", icon: Mail },
  { title: "Username", url: "/search/username", icon: AtSign },
  { title: "Crypto Wallet", url: "/search/crypto", icon: Wallet },
  { title: "Plat Kendaraan", url: "/search/vehicle", icon: Car },
];

const tools = [
  { title: "Dashboard", url: "/", icon: Search },
  { title: "Network Map", url: "/network", icon: Network },
  { title: "Timeline", url: "/timeline", icon: Clock },
  { title: "Data Breach", url: "/breach", icon: Shield },
  { title: "Reports", url: "/reports", icon: FileText },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Database className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">OSINT</span>
            <span className="text-xs text-muted-foreground">Intelligence Platform</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wide text-muted-foreground">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={location === item.url}
                    className="data-[active=true]:bg-sidebar-accent"
                  >
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s/g, "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wide text-muted-foreground">
            Search By
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {searchTypes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={location === item.url}
                    className="data-[active=true]:bg-sidebar-accent"
                  >
                    <Link href={item.url} data-testid={`nav-search-${item.title.toLowerCase()}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings" data-testid="nav-settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-4 rounded-md bg-sidebar-accent p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Status</span>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Online
            </Badge>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
