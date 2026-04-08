import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCampaign, useGetTemplates, getGetCampaignsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Rocket, Mail, MessageSquare } from "lucide-react";
import { Link } from "wouter";

const schema = z.object({
  name: z.string().min(1, "Campaign name required"),
  niche: z.string().min(1, "Target niche required"),
  emailSubject: z.string().optional(),
  emailBody: z.string().optional(),
  whatsappMessage: z.string().optional(),
  sendEmail: z.boolean(),
  sendWhatsapp: z.boolean(),
  templateId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewCampaign() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createCampaign = useCreateCampaign();
  const { data: templates } = useGetTemplates();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      niche: "",
      emailSubject: "",
      emailBody: "",
      whatsappMessage: "",
      sendEmail: true,
      sendWhatsapp: false,
    },
  });

  const sendEmail = form.watch("sendEmail");
  const sendWhatsapp = form.watch("sendWhatsapp");

  const onTemplateSelect = (templateId: string) => {
    const template = templates?.find(t => t.id === parseInt(templateId));
    if (!template) return;
    if (template.type === "email") {
      if (template.subject) form.setValue("emailSubject", template.subject);
      form.setValue("emailBody", template.body);
    } else {
      form.setValue("whatsappMessage", template.body);
    }
  };

  const onSubmit = (data: FormData) => {
    createCampaign.mutate({
      data: {
        name: data.name,
        niche: data.niche,
        emailSubject: data.emailSubject || undefined,
        emailBody: data.emailBody || undefined,
        whatsappMessage: data.whatsappMessage || undefined,
        sendEmail: data.sendEmail,
        sendWhatsapp: data.sendWhatsapp,
        templateId: data.templateId ? parseInt(data.templateId) : undefined,
      }
    }, {
      onSuccess: (campaign) => {
        queryClient.invalidateQueries({ queryKey: getGetCampaignsQueryKey() });
        toast({ title: "Campaign created successfully!" });
        setLocation(`/campaigns/${campaign.id}`);
      },
      onError: (err: any) => {
        toast({ title: "Error creating campaign", description: err?.response?.data?.error || "Please try again.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/campaigns" data-testid="link-back-campaigns">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Campaign</h1>
          <p className="text-muted-foreground text-sm">Launch a targeted outreach campaign</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Campaign Details</CardTitle>
              <CardDescription>Define your campaign name and target audience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mumbai Restaurant Outreach Q1" data-testid="input-campaign-name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="niche" render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Niche</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your target audience e.g., 'Restaurant owners in Mumbai who need delivery services', 'Dental clinics in Bangalore looking for patients'"
                      rows={3}
                      data-testid="input-niche"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Load from Template</CardTitle>
              <CardDescription>Auto-fill message content from a saved template</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField control={form.control} name="templateId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Template (optional)</FormLabel>
                  <Select onValueChange={(val) => { field.onChange(val); onTemplateSelect(val); }}>
                    <FormControl>
                      <SelectTrigger data-testid="select-template">
                        <SelectValue placeholder="Select a saved template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templates?.map(t => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.name} ({t.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Channels</CardTitle>
              <CardDescription>Choose how you want to reach your leads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Campaign</p>
                    <p className="text-sm text-muted-foreground">Send emails to leads</p>
                  </div>
                </div>
                <FormField control={form.control} name="sendEmail" render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="switch-send-email"
                  />
                )} />
              </div>

              {sendEmail && (
                <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                  <FormField control={form.control} name="emailSubject" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Special offer for your business" data-testid="input-email-subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="emailBody" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Body</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your email message here..."
                          rows={6}
                          data-testid="input-email-body"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">WhatsApp Campaign</p>
                    <p className="text-sm text-muted-foreground">Send WA messages to leads</p>
                  </div>
                </div>
                <FormField control={form.control} name="sendWhatsapp" render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="switch-send-whatsapp"
                  />
                )} />
              </div>

              {sendWhatsapp && (
                <div className="space-y-4 pl-4 border-l-2 border-green-500/20">
                  <FormField control={form.control} name="whatsappMessage" render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your WhatsApp message here..."
                          rows={5}
                          data-testid="input-whatsapp-message"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={createCampaign.isPending}
            data-testid="btn-create-campaign"
          >
            <Rocket className="h-4 w-4 mr-2" />
            {createCampaign.isPending ? "Creating..." : "Launch Campaign"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
