import { useGetDashboard, useGetMe } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Megaphone, Users, Zap, Mail, MessageSquare, Plus, Activity } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useGetMe();
  const { data: stats, isLoading: statsLoading } = useGetDashboard();

  if (userLoading || statsLoading || !user || !stats) {
    return <LoadingScreen />;
  }

  const creditsTotal = user.creditsRemaining + user.creditsUsed;
  const creditsPercentage = creditsTotal > 0 ? (user.creditsUsed / creditsTotal) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name || 'Entrepreneur'}</h1>
          <p className="text-muted-foreground mt-1">Here is what is happening with your campaigns today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/leads" data-testid="btn-dash-scrape">Scrape Leads</Link>
          </Button>
          <Button asChild>
            <Link href="/campaigns/new" data-testid="btn-dash-new-campaign">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Link>
          </Button>
        </div>
      </div>

      {/* Top Cards row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Credits Card */}
        <Card className="col-span-full md:col-span-2 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-primary flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Credits Overview
              </CardTitle>
              <CardDescription>Available balance for scraping & sending</CardDescription>
            </div>
            <Badge variant="outline" className="bg-white/50 border-primary/20 text-primary">
              {stats.planName || 'Free Trial'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="mt-4 mb-2 flex justify-between items-end">
              <div>
                <span className="text-4xl font-extrabold text-foreground">{user.creditsRemaining.toLocaleString()}</span>
                <span className="text-muted-foreground ml-2">remaining</span>
              </div>
              <div className="text-sm text-muted-foreground text-right">
                {user.creditsUsed.toLocaleString()} used
              </div>
            </div>
            <Progress value={creditsPercentage} className="h-3 bg-primary/20" />
            {stats.planExpiresAt && (
              <p className="text-xs text-muted-foreground mt-4">
                Plan renews on {format(new Date(stats.planExpiresAt), 'MMM dd, yyyy')}
              </p>
            )}
            <div className="mt-6 flex gap-3">
              <Button variant="default" size="sm" asChild className="w-full">
                <Link href="/billing">Upgrade Plan</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of {stats.totalCampaigns} total</p>
            <div className="mt-4 pt-4 border-t border-border/50">
              <Link href="/campaigns" className="text-sm text-primary hover:underline font-medium">View all campaigns →</Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Leads Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalLeads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all scrapes</p>
            <div className="mt-4 pt-4 border-t border-border/50">
              <Link href="/leads" className="text-sm text-primary hover:underline font-medium">Manage leads →</Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sending Stats */}
      <h2 className="text-xl font-bold tracking-tight mt-10 mb-4">Outreach Performance</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.emailsSent.toLocaleString()}</div>
            <div className="h-[80px] mt-4 flex items-end gap-2 overflow-hidden opacity-50 pointer-events-none">
              {/* Fake chart bars just for aesthetics since we don't have time series data from API */}
              {[40, 25, 60, 30, 80, 45, 90].map((h, i) => (
                <div key={i} className="flex-1 bg-primary/20 rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">WhatsApp Messages</CardTitle>
            <MessageSquare className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.whatsappSent.toLocaleString()}</div>
            <div className="h-[80px] mt-4 flex items-end gap-2 overflow-hidden opacity-50 pointer-events-none">
              {[20, 50, 30, 70, 40, 85, 60].map((h, i) => (
                <div key={i} className="flex-1 bg-green-500/20 rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Get Started Helper if empty */}
      {stats.totalCampaigns === 0 && (
        <Card className="mt-8 border-dashed border-2 bg-transparent">
          <CardContent className="flex flex-col items-center text-center p-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ready to launch your first campaign?</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Start by scraping some leads in your niche, then create a campaign to reach out to them automatically.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/leads">1. Scrape Leads</Link>
              </Button>
              <Button asChild>
                <Link href="/campaigns/new">2. Create Campaign</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
