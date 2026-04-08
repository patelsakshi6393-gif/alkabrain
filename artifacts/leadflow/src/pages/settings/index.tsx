import { useState } from "react";
import { useUser } from "@clerk/react";
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
  Crown, ExternalLink, CheckCircle2, AlertTriangle, Globe, Moon, Info,
  Download, RefreshCw, ChevronRight
} from "lucide-react";

export default function Settings() {
  const { user: clerkUser, isLoaded } = useUser();
  const { data: profile, isLoading } = useGetMe();
  const { data: gmail } = useGetGmailIntegration();
  const { data: waStatus } = useGetWhatsappStatus();
  const { data: subscription } = useGetSubscription();
  const { toast } = useToast();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [campaignAlerts, setCampaignAlerts] = useState(true);
  const [creditAlerts, setCreditAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleExportData = () => {
    const data = {
      profile: { name: profile?.name, email: profile?.email, memberSince: profile?.createdAt },
      credits: { remaining: profile?.creditsRemaining },
      plan: { name: profile?.planName, expiresAt: profile?.planExpiresAt },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leadflow-data-export.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Data exported successfully!" });
  };

  const handleCopyUserId = () => {
    if (clerkUser?.id) {
      navigator.clipboard.writeText(clerkUser.id);
      toast({ title: "User ID copied to clipboard" });
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
            <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {clerkUser?.imageUrl && (
                  <img src={clerkUser.imageUrl} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-primary/20" />
                )}
                <div>
                  <p className="font-semibold text-foreground text-lg" data-testid="text-user-name">
                    {clerkUser?.fullName || profile?.name || "—"}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid="text-user-email">
                    {clerkUser?.primaryEmailAddress?.emailAddress || profile?.email || "—"}
                  </p>
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
                  <p className="font-semibold text-foreground text-sm" data-testid="text-credits">
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
                    <Info className="h-3 w-3" /> User ID
                  </p>
                  <button onClick={handleCopyUserId} className="text-xs text-primary hover:underline font-mono truncate max-w-full">
                    {clerkUser?.id ? clerkUser.id.slice(0, 16) + "..." : "—"}
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
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded bg-red-50 dark:bg-red-950">
                <Mail className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Gmail</p>
                <p className="text-xs text-muted-foreground">{gmail?.isConnected ? gmail.senderEmail || "Connected" : "Not connected"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {gmail?.isConnected ? (
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground text-xs">Disconnected</Badge>
              )}
              <Link href="/integrations">
                <Button variant="ghost" size="sm" className="text-xs h-7">Setup <ExternalLink className="h-3 w-3 ml-1" /></Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded bg-green-50 dark:bg-green-950">
                <MessageSquare className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">WhatsApp</p>
                <p className="text-xs text-muted-foreground">{waStatus?.isConnected ? waStatus.phone || "Connected" : "Not connected"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {waStatus?.isConnected ? (
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground text-xs">Disconnected</Badge>
              )}
              <Link href="/integrations">
                <Button variant="ghost" size="sm" className="text-xs h-7">Setup <ExternalLink className="h-3 w-3 ml-1" /></Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose what updates you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Email Notifications", description: "Receive updates about your campaigns via email", state: emailNotifs, set: setEmailNotifs, id: "notif-email" },
            { label: "Campaign Status Alerts", description: "Get notified when a campaign completes or fails", state: campaignAlerts, set: setCampaignAlerts, id: "notif-campaign" },
            { label: "Low Credits Alert", description: "Warn me when credits are running low (below 10)", state: creditAlerts, set: setCreditAlerts, id: "notif-credits" },
            { label: "Product Updates", description: "News about new features and improvements", state: marketingEmails, set: setMarketingEmails, id: "notif-marketing" },
          ].map(({ label, description, state, set, id }) => (
            <div key={id} className="flex items-center justify-between py-1">
              <div>
                <Label htmlFor={id} className="font-medium cursor-pointer">{label}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
              <Switch
                id={id}
                checked={state}
                onCheckedChange={(v) => { set(v); toast({ title: `${label} ${v ? "enabled" : "disabled"}` }); }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Moon className="h-4 w-4 text-primary" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground mt-0.5">System theme is used by default. You can override it.</p>
            </div>
            <div className="flex gap-2">
              {["Light", "Dark", "System"].map(t => (
                <Button key={t} variant={t === "System" ? "default" : "outline"} size="sm" className="text-xs h-7">{t}</Button>
              ))}
            </div>
          </div>
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
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Language</p>
              <p className="text-xs text-muted-foreground">Currently: English</p>
            </div>
            <Badge variant="outline">English (India)</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Currency</p>
              <p className="text-xs text-muted-foreground">Used for billing display</p>
            </div>
            <Badge variant="outline">INR (₹)</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Timezone</p>
              <p className="text-xs text-muted-foreground">Campaign schedule timezone</p>
            </div>
            <Badge variant="outline">IST (UTC+5:30)</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm text-foreground">Password & Authentication</p>
              <p className="text-xs text-muted-foreground">Manage your login credentials and 2FA settings</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => clerkUser?.openUserProfile()} className="text-xs h-7">
              Manage <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm text-foreground">Connected Accounts</p>
              <p className="text-xs text-muted-foreground">Google, Email — managed via your auth provider</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => clerkUser?.openUserProfile()} className="text-xs h-7">
              View <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm text-foreground">Active Sessions</p>
              <p className="text-xs text-muted-foreground">See all devices currently logged into your account</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => clerkUser?.openUserProfile()} className="text-xs h-7">
              View <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" />
            Data & Privacy
          </CardTitle>
          <CardDescription>Control your data and account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm text-foreground">Export Your Data</p>
              <p className="text-xs text-muted-foreground">Download all your account data as JSON</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData} className="text-xs h-7">
              <Download className="h-3 w-3 mr-1" />Export
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm text-foreground">Privacy Policy</p>
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
              <p className="font-medium text-sm text-foreground">Terms of Service</p>
              <p className="text-xs text-muted-foreground">Rules and guidelines for using LeadFlow</p>
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
          <CardDescription>Irreversible actions — please be careful</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm text-foreground">Reset All Integrations</p>
              <p className="text-xs text-muted-foreground">Disconnect Gmail and WhatsApp from your account</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs h-7 border-red-200 text-red-600 hover:bg-red-50">
              <RefreshCw className="h-3 w-3 mr-1" />Reset
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account and all data. This cannot be undone.</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="text-xs h-7"
              onClick={() => toast({ title: "Please contact support@leadflow.in to delete your account.", variant: "destructive" })}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
