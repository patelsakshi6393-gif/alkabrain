import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useCreateCampaign, useGetTemplates, getGetCampaignsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Rocket, Mail, MessageSquare, Zap, Search, CheckCircle2, Loader2 } from "lucide-react";

export default function NewCampaign() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createCampaign = useCreateCampaign();
  const { data: templates } = useGetTemplates();

  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsapp, setSendWhatsapp] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [emailTemplateId, setEmailTemplateId] = useState("");
  const [waTemplateId, setWaTemplateId] = useState("");

  const emailTemplates = templates?.filter(t => t.type === "email") || [];
  const waTemplates = templates?.filter(t => t.type === "whatsapp") || [];

  const onEmailTemplateSelect = (id: string) => {
    setEmailTemplateId(id);
    const tpl = emailTemplates.find(t => String(t.id) === id);
    if (tpl) {
      if (tpl.subject) setEmailSubject(tpl.subject);
      setEmailBody(tpl.body);
    }
  };

  const onWaTemplateSelect = (id: string) => {
    setWaTemplateId(id);
    const tpl = waTemplates.find(t => String(t.id) === id);
    if (tpl) setWhatsappMessage(tpl.body);
  };

  const handleLaunch = () => {
    if (!name.trim()) { toast({ title: "Campaign name required", variant: "destructive" }); return; }
    if (!niche.trim()) { toast({ title: "Target niche required", variant: "destructive" }); return; }
    if (sendEmail && !emailBody.trim()) { toast({ title: "Email message required when email is enabled", variant: "destructive" }); return; }
    if (sendWhatsapp && !whatsappMessage.trim()) { toast({ title: "WhatsApp message required when WhatsApp is enabled", variant: "destructive" }); return; }

    createCampaign.mutate({
      data: {
        name,
        niche,
        sendEmail,
        sendWhatsapp,
        emailSubject: sendEmail ? emailSubject : undefined,
        emailBody: sendEmail ? emailBody : undefined,
        whatsappMessage: sendWhatsapp ? whatsappMessage : undefined,
      }
    }, {
      onSuccess: (campaign) => {
        queryClient.invalidateQueries({ queryKey: getGetCampaignsQueryKey() });
        toast({ title: "Campaign launched! System is now scraping leads and sending messages automatically." });
        setLocation(`/campaigns/${campaign.id}`);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.error || "Please try again.";
        toast({ title: "Failed to launch", description: msg, variant: "destructive" });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/campaigns">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Launch Campaign</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Fill in details — system will automatically find leads and send messages</p>
        </div>
      </div>

      <Alert className="border-primary/30 bg-primary/5">
        <Zap className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <strong>100% Automatic:</strong> After you click Launch, ALKABRAIN will automatically scrape leads for your niche, send emails via your Gmail, and send WhatsApp messages — no manual steps needed.
        </AlertDescription>
      </Alert>

      {/* Step 1 — Campaign Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs p-0">1</Badge>
            <CardTitle className="text-base">Campaign Details</CardTitle>
          </div>
          <CardDescription>Name your campaign and describe who you want to reach</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="camp-name">Campaign Name</Label>
            <Input
              id="camp-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Mumbai Restaurant Outreach"
              data-testid="input-campaign-name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="camp-niche">Target Niche</Label>
            <Textarea
              id="camp-niche"
              value={niche}
              onChange={e => setNiche(e.target.value)}
              placeholder="Describe who you want to reach. e.g., 'Restaurant owners in Mumbai who need marketing services', 'Dental clinics in Bengaluru looking for more patients', 'Gym owners in Delhi interested in management software'"
              rows={3}
              data-testid="input-niche"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Search className="h-3 w-3" />
              System will use this to search and find real leads automatically
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step 2 — Email Template */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs p-0">2</Badge>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email Campaign
              </CardTitle>
            </div>
            <Switch
              checked={sendEmail}
              onCheckedChange={setSendEmail}
              data-testid="switch-send-email"
            />
          </div>
          <CardDescription>Send automated emails to scraped leads</CardDescription>
        </CardHeader>
        {sendEmail && (
          <CardContent className="space-y-4">
            {emailTemplates.length > 0 && (
              <div>
                <Label>Load from Saved Template</Label>
                <Select value={emailTemplateId} onValueChange={onEmailTemplateSelect}>
                  <SelectTrigger data-testid="select-email-template" className="mt-1">
                    <SelectValue placeholder="Choose a saved email template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map(t => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="email-subject">Subject Line</Label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                placeholder="e.g., Special offer for your business"
                data-testid="input-email-subject"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email-body">Email Message</Label>
              <Textarea
                id="email-body"
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                placeholder={`Hi,\n\nI noticed your business and wanted to reach out about...\n\nBest regards`}
                rows={7}
                data-testid="input-email-body"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Tip: Go to Integrations page and connect Gmail first so emails are sent from your address.</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Step 3 — WhatsApp Template */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs p-0">3</Badge>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
                WhatsApp Campaign
              </CardTitle>
            </div>
            <Switch
              checked={sendWhatsapp}
              onCheckedChange={setSendWhatsapp}
              data-testid="switch-send-whatsapp"
            />
          </div>
          <CardDescription>Send WhatsApp messages to leads with phone numbers</CardDescription>
        </CardHeader>
        {sendWhatsapp && (
          <CardContent className="space-y-4">
            {waTemplates.length > 0 && (
              <div>
                <Label>Load from Saved Template</Label>
                <Select value={waTemplateId} onValueChange={onWaTemplateSelect}>
                  <SelectTrigger data-testid="select-wa-template" className="mt-1">
                    <SelectValue placeholder="Choose a saved WhatsApp template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {waTemplates.map(t => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="wa-message">WhatsApp Message</Label>
              <Textarea
                id="wa-message"
                value={whatsappMessage}
                onChange={e => setWhatsappMessage(e.target.value)}
                placeholder={`Hi! I saw your business and wanted to share something that could help you grow...\n\nWould you be interested in a quick chat? 😊`}
                rows={5}
                data-testid="input-whatsapp-message"
                className="mt-1"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Summary */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="pt-4 pb-4">
          <p className="text-sm font-medium text-foreground mb-3">What will happen after you click Launch:</p>
          <ol className="space-y-2">
            {[
              { icon: Search, text: "System searches DuckDuckGo for leads in your niche", done: false },
              { icon: Mail, text: sendEmail ? "Sends emails to all leads with email addresses via Gmail" : "Email sending disabled", done: !sendEmail },
              { icon: MessageSquare, text: sendWhatsapp ? "Sends WhatsApp messages to leads with phone numbers" : "WhatsApp sending disabled", done: !sendWhatsapp },
              { icon: CheckCircle2, text: "Campaign stats updated automatically with results", done: false },
            ].map((step, i) => (
              <li key={i} className={`flex items-start gap-2 text-sm ${step.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                <step.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${step.done ? "text-muted-foreground" : "text-primary"}`} />
                {step.text}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Button
        onClick={handleLaunch}
        disabled={createCampaign.isPending}
        className="w-full h-12 text-base font-semibold"
        data-testid="btn-create-campaign"
      >
        {createCampaign.isPending ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Launching Campaign...</>
        ) : (
          <><Rocket className="h-4 w-4 mr-2" />Launch Campaign Automatically</>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">2 credits will be used for lead scraping</p>
    </div>
  );
}
