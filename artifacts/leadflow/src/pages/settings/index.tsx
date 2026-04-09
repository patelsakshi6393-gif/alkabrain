import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/react";
import { useGetMe, useGetGmailIntegration, useGetWhatsappStatus, useGetSubscription } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  User, Mail, Calendar, Zap, Bell, Shield, Settings2, MessageSquare,
  Crown, ExternalLink, CheckCircle2, AlertTriangle, Globe, Moon, Sun,
  Download, RefreshCw, ChevronRight, Monitor, Copy
} from "lucide-react";

type Theme = "light" | "dark" | "system";

function getTheme(): Theme {
  return (localStorage.getItem("lf-theme") as Theme) || "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    // system
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }
  localStorage.setItem("lf-theme", theme);
}

function getNotifPref(key: string, def: boolean): boolean {
  const val = localStorage.getItem(`lf-notif-${key}`);
  if (val === null) return def;
  return val === "true";
}

function setNotifPref(key: string, val: boolean) {
  localStorage.setItem(`lf-notif-${key}`, String(val));
}

export default function Settings() {
  const { user: clerkUser, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const { data: profile, isLoading } = useGetMe();
  const { data: gmail } = useGetGmailIntegration();
  const { data: waStatus } = useGetWhatsappStatus();
  const { data: subscription } = useGetSubscription();
  const { toast } = useToast();

  const [theme, setTheme] = useState<Theme>(getTheme);
  const [emailNotifs, setEmailNotifs] = useState(() => getNotifPref("email", true));
  const [campaignAlerts, setCampaignAlerts] = useState(() => getNotifPref("campaign", true));
  const [creditAlerts, setCreditAlerts] = useState(() => getNotifPref("credits", true));
  const [marketingEmails, setMarketingEmails] = useState(() => getNotifPref("marketing", false));

  // Apply theme on mount
  useEffect(() => { applyTheme(theme); }, []);

  const handleThemeChange = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
    toast({ title: `Theme changed to ${t}` });
  };

  const handleNotifChange = (key: string, setter: (v: boolean) => void, label: string) => (v: boolean) => {
    setter(v);
    setNotifPref(key, v);
    toast({ title: `${label} ${v ? "enabled" : "disabled"}` });
  };

  const handleExportData = () => {
    const data = {
      profile: {
        name: profile?.name,
        email: profile?.email,
        memberSince: profile?.createdAt,
        creditsRemaining: profile?.creditsRemaining,
        plan: profile?.planName,
        planExpiresAt: profile?.planExpiresAt,
      },
      integrations: {
        gmail: gmail?.isConnected ? { email: gmail.senderEmail, connected: true } : { connected: false },
        whatsapp: waStatus?.isConnected ? { phone: waStatus.phone, connected: true } : { connected: false },
      },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alkabrain-account-export.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Data exported! Check your downloads." });
  };

  const handleCopyUserId = () => {
    if (clerkUser?.id) {
      navigator.clipboard.writeText(clerkUser.id);
      toast({ title: "User ID copied!" });
    }
  };

  const handleOpenAuth = () => {
    try {
      openUserProfile();
    } catch {
      toast({ title: "Please use the profile button in the header to manage auth settings.", variant: "destructive" });
    }
  };

  const infoLoading = !isLoaded || isLoading;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account, preferences, and integrations</p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {infoLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {clerkUser?.imageUrl ? (
                  <img src={clerkUser.imageUrl} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-primary/20 object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/20">
                    {(clerkUser?.firstName || profile?.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground text-lg" data-testid="text-user-name">
                    {clerkUser?.fullName || profile?.name || "—"}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid="text-user-email">
                    {clerkUser?.primaryEmailAddress?.emailAddress || profile?.email || "—"}
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary mt-0.5"
                    onClick={handleOpenAuth}
                  >
                    Edit profile →
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Member Since
                  </p>
                  <p className="font-semibold text-foreground text-sm" data-testid="text-member-since">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Credits Remaining
                  </p>
                  <p className="font-bold text-foreground text-lg" data-testid="text-credits">
                    {profile?.creditsRemaining ?? "—"}
                  </p>
                </div>
                {profile?.planName && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Crown className="h-3 w-3" /> Current Plan
                    </p>
                    <Badge className="bg-primary/10 text-primary border-primary/20">{profile.planName}</Badge>
                    {profile.planExpiresAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Expires {new Date(profile.planExpiresAt).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>
                )}
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                    <User className="h-3 w-3" /> User ID
                  </p>
                  <button
                    onClick={handleCopyUserId}
                    className="text-xs text-primary hover:underline font-mono flex items-center gap-1 truncate"
                    title="Click to copy"
                  >
                    <span className="truncate">{clerkUser?.id ? clerkUser.id.slice(0, 18) + "…" : "—"}</span>
                    <Copy className="h-3 w-3 flex-shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan & Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Crown className="h-4 w-4 text-yellow-500" />
            Plan & Billing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                {subscription?.isActive ? `${subscription.planName} Plan` : "No Active Plan"}
              </p>
              <p className="text-sm text-muted-foreground">
                {subscription?.isActive
                  ? `Expires ${subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString("en-IN") : "—"}`
                  : "Upgrade to unlock more credits and features"
                }
              </p>
            </div>
            <Link href="/billing">
              <Button variant="outline" size="sm">
                {subscription?.isActive ? "Manage" : "Upgrade"} <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Connected Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />
            Connected Integrations
          </CardTitle>
          <CardDescription>Manage your email and WhatsApp connections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              icon: Mail,
              iconBg: "bg-red-50 dark:bg-red-950",
              iconColor: "text-red-600",
              label: "Gmail",
              subtitle: gmail?.isConnected ? (gmail.senderEmail || "Connected") : "Not connected",
              connected: gmail?.isConnected,
            },
            {
              icon: MessageSquare,
              iconBg: "bg-green-50 dark:bg-green-950",
              iconColor: "text-green-600",
              label: "WhatsApp",
              subtitle: waStatus?.isConnected ? (waStatus.phone || "Connected") : "Not connected",
              connected: waStatus?.isConnected,
            },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded ${item.iconBg}`}>
                  <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.connected ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground text-xs">Disconnected</Badge>
                )}
                <Link href="/integrations">
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    {item.connected ? "Manage" : "Connect"} <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance (Theme) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            {theme === "dark" ? <Moon className="h-4 w-4 text-primary" /> : theme === "light" ? <Sun className="h-4 w-4 text-primary" /> : <Monitor className="h-4 w-4 text-primary" />}
            Appearance
          </CardTitle>
          <CardDescription>Choose your preferred theme for the app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {([
              { id: "light" as Theme, label: "Light", icon: Sun, desc: "Always light" },
              { id: "dark" as Theme, label: "Dark", icon: Moon, desc: "Always dark" },
              { id: "system" as Theme, label: "System", icon: Monitor, desc: "Match OS" },
            ]).map(t => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 bg-background"}`}
                data-testid={`btn-theme-${t.id}`}
              >
                <t.icon className={`h-5 w-5 ${theme === t.id ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${theme === t.id ? "text-primary" : "text-foreground"}`}>{t.label}</span>
                <span className="text-xs text-muted-foreground">{t.desc}</span>
                {theme === t.id && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>These preferences are saved locally on your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {([
            { key: "email", label: "Email Notifications", description: "Receive updates about your account via email", state: emailNotifs, setter: setEmailNotifs },
            { key: "campaign", label: "Campaign Status Alerts", description: "Get notified when a campaign completes or fails", state: campaignAlerts, setter: setCampaignAlerts },
            { key: "credits", label: "Low Credits Alert", description: "Warn me when credits drop below 10", state: creditAlerts, setter: setCreditAlerts },
            { key: "marketing", label: "Product Updates", description: "News about new features and improvements", state: marketingEmails, setter: setMarketingEmails },
          ]).map(({ key, label, description, state, setter }) => (
            <div key={key} className="flex items-center justify-between py-1">
              <div>
                <Label htmlFor={`notif-${key}`} className="font-medium cursor-pointer">{label}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
              <Switch
                id={`notif-${key}`}
                checked={state}
                onCheckedChange={handleNotifChange(key, setter, label)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Language", value: "English (India)", desc: "App display language" },
            { label: "Currency", value: "INR (₹)", desc: "Used for billing display" },
            { label: "Timezone", value: "IST (UTC+5:30)", desc: "Campaign schedule timezone" },
            { label: "Date Format", value: "DD/MM/YYYY", desc: "Date display format" },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{row.label}</p>
                <p className="text-xs text-muted-foreground">{row.desc}</p>
              </div>
              <Badge variant="outline">{row.value}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Security & Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {[
            { label: "Password & 2FA", desc: "Manage your login credentials and two-factor authentication" },
            { label: "Connected Accounts", desc: "Google, Email and other login methods" },
            { label: "Active Sessions", desc: "See all devices currently logged into your account" },
          ].map((item, i) => (
            <div key={item.label}>
              {i > 0 && <Separator className="my-2" />}
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="font-medium text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={handleOpenAuth}
                  data-testid={`btn-security-${i}`}
                >
                  Manage <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm text-foreground">Export Your Data</p>
              <p className="text-xs text-muted-foreground">Download your account data as a JSON file</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData} className="text-xs h-7" data-testid="btn-export-data">
              <Download className="h-3 w-3 mr-1" />Export
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm">Privacy Policy</p>
              <p className="text-xs text-muted-foreground">How we handle your data</p>
            </div>
            <Link href="/privacy">
              <Button variant="ghost" size="sm" className="text-xs h-7 text-primary">
                Read <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm">Terms of Service</p>
              <p className="text-xs text-muted-foreground">Rules for using ALKABRAIN</p>
            </div>
            <Link href="/terms">
              <Button variant="ghost" size="sm" className="text-xs h-7 text-primary">
                Read <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>These actions cannot be undone — proceed carefully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm text-foreground">Reset All Integrations</p>
              <p className="text-xs text-muted-foreground">Disconnect Gmail and WhatsApp from your account</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => {
                toast({ title: "To reset integrations, please go to the Integrations page and disconnect each service.", variant: "destructive" });
              }}
            >
              <RefreshCw className="h-3 w-3 mr-1" />Reset
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently deletes all your data. Cannot be undone.</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="text-xs h-7"
              data-testid="btn-delete-account"
              onClick={() => toast({
                title: "Contact support to delete your account",
                description: "Email us at support@alkabrain.in with subject 'Delete Account'",
                variant: "destructive"
              })}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
