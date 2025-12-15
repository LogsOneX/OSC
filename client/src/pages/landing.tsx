import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Search,
  Network,
  FolderKanban,
  Lock,
  Zap,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Multi-Category Search",
    description: "Search across NIK, phone, email, username, crypto wallets, and more from a single interface.",
  },
  {
    icon: Network,
    title: "Network Mapping",
    description: "Visualize relationships between entities with interactive graph visualization.",
  },
  {
    icon: FolderKanban,
    title: "Case Management",
    description: "Organize investigations with tagging, notes, and comprehensive audit trails.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description: "Role-based access control with encrypted API key storage.",
  },
  {
    icon: Zap,
    title: "API Integration",
    description: "Connect your own data sources with flexible API configuration.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 osint-grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
        
        <div className="relative mx-auto max-w-6xl px-6 py-12">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight">OSINT Platform</span>
            </div>
            <a href="/api/login">
              <Button data-testid="button-login">
                Sign In
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </a>
          </nav>

          <div className="mt-24 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Shield className="h-3.5 w-3.5" />
              <span>Professional Intelligence Platform</span>
            </div>
            
            <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Open Source Intelligence
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              A professional web-based OSINT platform designed for investigators, analysts, 
              and organizations. Collect, correlate, visualize, and analyze data with ease.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href="/api/login">
                <Button size="lg" className="gap-2" data-testid="button-get-started">
                  Get Started
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-32">
            <h2 className="text-center text-2xl font-semibold tracking-tight">
              Powerful Features for Professional Investigation
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              Everything you need to conduct comprehensive OSINT investigations in one platform.
            </p>
            
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <footer className="mt-32 border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
            <p>OSINT Platform - Professional Intelligence Suite</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
