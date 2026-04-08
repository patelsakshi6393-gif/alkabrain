import { useState } from "react";
import { Link } from "wouter";
import { useGetCampaigns } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { Plus, Mail, MessageSquare, Users, TrendingUp } from "lucide-react";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  running: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

export default function Campaigns() {
  const { data: campaigns, isLoading } = useGetCampaigns();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage your email and WhatsApp campaigns</p>
        </div>
        <Button asChild data-testid="btn-new-campaign">
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : !campaigns || campaigns.length === 0 ? (
        <Empty
          title="No campaigns yet"
          description="Launch your first campaign to start reaching leads."
        />
      ) : (
        <div className="grid gap-4">
          {campaigns.map(c => (
            <Link key={c.id} href={`/campaigns/${c.id}`} data-testid={`card-campaign-${c.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground text-lg">{c.name}</h3>
                        <Badge className={statusColors[c.status]}>{c.status}</Badge>
                        {c.sendEmail && <Badge variant="outline" className="text-xs"><Mail className="h-3 w-3 mr-1" />Email</Badge>}
                        {c.sendWhatsapp && <Badge variant="outline" className="text-xs"><MessageSquare className="h-3 w-3 mr-1" />WhatsApp</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">Niche: {c.niche}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span data-testid={`text-leads-${c.id}`}>{c.totalLeads} leads</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span data-testid={`text-emails-${c.id}`}>{c.emailsSent} emails sent</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          <span data-testid={`text-wa-${c.id}`}>{c.whatsappSent} WA sent</span>
                        </div>
                      </div>
                    </div>
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
