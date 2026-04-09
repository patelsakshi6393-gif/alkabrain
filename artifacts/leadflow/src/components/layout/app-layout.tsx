import React from "react";
import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { 
  LayoutDashboard, 
  Megaphone, 
  FileText, 
  Users, 
  Plug, 
  CreditCard, 
  Settings,
  LogOut,
  Menu
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Campaigns", href: "/campaigns", icon: Megaphone },
    { label: "Templates", href: "/templates", icon: FileText },
    { label: "Lead Scraper", href: "/leads", icon: Users },
    { label: "Integrations", href: "/integrations", icon: Plug },
    { label: "Billing", href: "/billing", icon: CreditCard },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full bg-gray-50 dark:bg-gray-900">
        <Sidebar>
          <SidebarHeader className="p-4 flex items-center h-16 border-b border-sidebar-border">
            <Link href="/dashboard" className="flex items-center gap-2.5" data-testid="link-logo">
              <img src="/logo.png" alt="ALKABRAIN" className="w-8 h-8 rounded-xl object-cover" />
              <span className="text-lg font-black text-sidebar-foreground">ALKA<span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #a855f7)" }}>BRAIN</span></span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2 gap-1">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href} className="flex items-center gap-3 px-3 py-2 w-full" data-testid={`nav-item-${item.label.toLowerCase().replace(' ', '-')}`}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                  {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{user?.firstName || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => signOut()}
                title="Sign Out"
                data-testid="btn-sign-out"
                className="flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 flex items-center gap-4 px-6 bg-background border-b border-border flex-shrink-0 lg:hidden">
            <SidebarTrigger />
            <h1 className="font-semibold text-lg font-black">ALKABRAIN</h1>
          </header>
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
