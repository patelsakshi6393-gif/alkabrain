import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useGetCampaign, getGetCampaignQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, MessageSquare, Users, TrendingUp, ArrowLeft, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusConfig: Record<string, { label: string; color: string; icon: any; description: string }> = {
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: Clock,
    description: "Campaign is saved but not yet launched.",
  },
  running: {
    label: "Running",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Loader2,
    description: "System is scraping leads and sending messages automatically. This may take a few minutes.",
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle2,
    description: "Campaign completed successfully.",
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    description: "Campaign encountered an error. Please check your integrations and try again.",
  },
};

export default function CampaignDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");
  const queryClient = useQueryClient();
  const { data: campaign, isLoading } = useGetCampaign(id, {
    query: { enabled: !!id }
  });

  // Poll every 4s while campaign is running
  useEffect(() => {
    if (!campaign || campaign.status !== "running") return;
    const timer = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: getGetCampaignQueryKey(id) });
    }, 4000);
    return () => clearInterval(timer);
  }, [campaign?.status, id, queryClient]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Campaign not found.</p>
        <Link href="/campaigns">
          <Button variant="outline" className="mt-4">Back to Campaigns</Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[campaign.status] || statusConfig.draft;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/campaigns">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground truncate">{campaign.name}</h1>
            <Badge className={`${status.color} flex items-center gap-1.5`}>
              <StatusIcon className={`h-3.5 w-3.5 ${campaign.status === "running" ? "animate-spin" : ""}`} />
              {status.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Niche: {campaign.niche}</p>
        </div>
      </div>

      {/* Status alert */}
      <Alert className={`${campaign.status === "running" ? "border-blue-200 bg-blue-50 dark:bg-blue-950" : campaign.status === "completed" ? "border-green-200 bg-green-50 dark:bg-green-950" : campaign.status === "failed" ? "border-red-200 bg-red-50 dark:bg-red-950" : ""}`}>
        <StatusIcon className={`h-4 w-4 ${campaign.status === "running" ? "animate-spin text-blue-600" : campaign.status === "completed" ? "text-green-600" : campaign.status === "failed" ? "text-red-600" : ""}`} />
        <AlertDescription>{status.description}</AlertDescription>
      </Alert>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: campaign.totalLeads, icon: Users, color: "text-purple-600" },
          { label: "Emails Sent", value: campaign.emailsSent, icon: Mail, color: "text-blue-600" },
          { label: "WhatsApp Sent", value: campaign.whatsappSent, icon: MessageSquare, color: "text-green-600" },
          {
            label: "Success Rate",
            value: campaign.totalLeads > 0
              ? `${Math.round(((campaign.emailsSent + campaign.whatsappSent) / campaign.totalLeads) * 100)}%`
              : "—",
            icon: TrendingUp,
            color: "text-orange-600"
          },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className={`flex items-center gap-2 mb-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-3xl font-extrabold text-foreground" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
                {campaign.status === "running" && stat.value === 0 ? <Loader2 className="h-5 w-5 animate-spin inline text-muted-foreground" /> : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign content */}
      <Card>
        <CardHeader><CardTitle className="text-base">Campaign Content</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Channels</p>
            <div className="flex gap-2">
              {campaign.sendEmail ? (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  <Mail className="h-3 w-3 mr-1" />Email
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground line-through">
                  <Mail className="h-3 w-3 mr-1" />Email disabled
                </Badge>
              )}
              {campaign.sendWhatsapp ? (
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  <MessageSquare className="h-3 w-3 mr-1" />WhatsApp
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground line-through">
                  <MessageSquare className="h-3 w-3 mr-1" />WhatsApp disabled
                </Badge>
              )}
            </div>
          </div>

          {campaign.sendEmail && campaign.emailBody && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Email Message</p>
              <div className="rounded-lg border bg-muted/30 p-4">
                {campaign.emailSubject && (
                  <p className="font-semibold text-foreground mb-2 pb-2 border-b">Subject: {campaign.emailSubject}</p>
                )}
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{campaign.emailBody}</p>
              </div>
            </div>
          )}

          {campaign.sendWhatsapp && campaign.whatsappMessage && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">WhatsApp Message</p>
              <div className="rounded-lg border bg-green-50 dark:bg-green-950/30 border-green-100 p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{campaign.whatsappMessage}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
