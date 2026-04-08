import { useParams } from "wouter";
import { useGetCampaign } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, MessageSquare, Users, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  running: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

export default function CampaignDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");
  const { data: campaign, isLoading } = useGetCampaign(id, {
    query: { enabled: !!id }
  });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-32 w-full" /></div>;
  if (!campaign) return <div className="text-muted-foreground">Campaign not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/campaigns">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        </Link>
        <div className="flex-1 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">{campaign.name}</h1>
          <Badge className={statusColors[campaign.status]}>{campaign.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: campaign.totalLeads, icon: Users },
          { label: "Emails Sent", value: campaign.emailsSent, icon: Mail },
          { label: "WhatsApp Sent", value: campaign.whatsappSent, icon: MessageSquare },
          { label: "Success Rate", value: campaign.totalLeads > 0 ? `${Math.round(((campaign.emailsSent + campaign.whatsappSent) / campaign.totalLeads) * 100)}%` : "N/A", icon: TrendingUp },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <stat.icon className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Campaign Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Target Niche</p>
            <p className="text-foreground">{campaign.niche}</p>
          </div>
          {campaign.sendEmail && campaign.emailBody && (
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Email Message</p>
              <div className="bg-muted rounded-md p-3">
                {campaign.emailSubject && <p className="font-semibold mb-2">{campaign.emailSubject}</p>}
                <p className="text-sm whitespace-pre-wrap">{campaign.emailBody}</p>
              </div>
            </div>
          )}
          {campaign.sendWhatsapp && campaign.whatsappMessage && (
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">WhatsApp Message</p>
              <div className="bg-green-50 dark:bg-green-950 rounded-md p-3">
                <p className="text-sm whitespace-pre-wrap">{campaign.whatsappMessage}</p>
              </div>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Channels</p>
            <div className="flex gap-2">
              {campaign.sendEmail && <Badge variant="outline"><Mail className="h-3 w-3 mr-1" />Email</Badge>}
              {campaign.sendWhatsapp && <Badge variant="outline"><MessageSquare className="h-3 w-3 mr-1" />WhatsApp</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
