import { useState } from "react";
import { useScrapeLeads, useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Search, Copy, Mail, Phone, Globe, Loader2, Zap } from "lucide-react";

type Lead = {
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  name?: string | null;
  source?: string | null;
};

export default function Leads() {
  const [niche, setNiche] = useState("");
  const [maxResults, setMaxResults] = useState([10]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const { toast } = useToast();
  const scrapeLeads = useScrapeLeads();
  const { data: user } = useGetMe();

  const handleScrape = () => {
    if (!niche.trim()) {
      toast({ title: "Please enter a target niche", variant: "destructive" });
      return;
    }
    scrapeLeads.mutate({ data: { niche, maxResults: maxResults[0] } }, {
      onSuccess: (result) => {
        setLeads(result.leads as Lead[]);
        setCreditsUsed(result.creditsUsed);
        toast({ title: `Found ${result.total} leads! Used ${result.creditsUsed} credits.` });
      },
      onError: (err: any) => {
        toast({ title: "Scraping failed", description: err?.response?.data?.error || "Please try again.", variant: "destructive" });
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lead Scraper</h1>
        <p className="text-muted-foreground mt-1">Find public emails, phones, and websites using DuckDuckGo</p>
      </div>

      {user && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4 text-primary" />
          <span data-testid="text-credits-remaining">Credits remaining: <strong className="text-foreground">{user.creditsRemaining}</strong></span>
          <span className="text-muted-foreground/50">|</span>
          <span>Scraping costs 2 credits</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search Parameters</CardTitle>
          <CardDescription>Enter the niche and number of results to scrape</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="niche-input">Target Niche</Label>
            <Input
              id="niche-input"
              value={niche}
              onChange={e => setNiche(e.target.value)}
              placeholder="e.g., 'restaurant owners in Delhi', 'dental clinics Bangalore'"
              data-testid="input-lead-niche"
              className="mt-1"
              onKeyDown={e => e.key === "Enter" && handleScrape()}
            />
          </div>
          <div>
            <Label className="mb-3 block">Max Results: <strong>{maxResults[0]}</strong></Label>
            <Slider
              value={maxResults}
              onValueChange={setMaxResults}
              min={5}
              max={50}
              step={5}
              data-testid="slider-max-results"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5</span><span>50</span>
            </div>
          </div>
          <Button
            onClick={handleScrape}
            disabled={scrapeLeads.isPending}
            className="w-full h-11"
            data-testid="btn-scrape-leads"
          >
            {scrapeLeads.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Scraping leads...</>
            ) : (
              <><Search className="h-4 w-4 mr-2" />Scrape Leads</>
            )}
          </Button>
        </CardContent>
      </Card>

      {leads.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Results</CardTitle>
              <div className="flex items-center gap-2">
                <Badge data-testid="badge-lead-count">{leads.length} leads found</Badge>
                <Badge variant="outline" className="text-xs">Used {creditsUsed} credits</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Email</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Phone</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Website</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr key={i} className="border-b hover:bg-muted/30 transition-colors" data-testid={`row-lead-${i}`}>
                      <td className="py-2 px-3 text-foreground">{lead.name || <span className="text-muted-foreground">—</span>}</td>
                      <td className="py-2 px-3">
                        {lead.email ? (
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-foreground">{lead.email}</span>
                            <button onClick={() => copyToClipboard(lead.email!)} className="p-0.5 hover:text-primary" data-testid={`btn-copy-email-${i}`}>
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="py-2 px-3">
                        {lead.phone ? (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-foreground">{lead.phone}</span>
                            <button onClick={() => copyToClipboard(lead.phone!)} className="p-0.5 hover:text-primary" data-testid={`btn-copy-phone-${i}`}>
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="py-2 px-3">
                        {lead.website ? (
                          <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                            <Globe className="h-3.5 w-3.5" />
                            <span className="max-w-[150px] truncate">{lead.website}</span>
                          </a>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant="outline" className="text-xs">{lead.source || "—"}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
