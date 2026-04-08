import { useState } from "react";
import {
  useGetGmailIntegration, useSaveGmailIntegration,
  useGetWhatsappStatus, useConnectWhatsapp, useDisconnectWhatsapp,
  getGetGmailIntegrationQueryKey, getGetWhatsappStatusQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, CheckCircle2, AlertCircle, Loader2, ExternalLink, Shield } from "lucide-react";

export default function Integrations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Gmail
  const { data: gmail, isLoading: gmailLoading } = useGetGmailIntegration();
  const saveGmail = useSaveGmailIntegration();
  const [senderEmail, setSenderEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");

  // WhatsApp
  const { data: waStatus, isLoading: waLoading } = useGetWhatsappStatus();
  const connectWa = useConnectWhatsapp();
  const disconnectWa = useDisconnectWhatsapp();

  const handleSaveGmail = () => {
    if (!senderEmail || !appPassword) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    saveGmail.mutate({ data: { senderEmail, appPassword } }, {
      onSuccess: () => {
        toast({ title: "Gmail connected successfully!" });
        setSenderEmail("");
        setAppPassword("");
        queryClient.invalidateQueries({ queryKey: getGetGmailIntegrationQueryKey() });
      },
      onError: () => toast({ title: "Error connecting Gmail", variant: "destructive" }),
    });
  };

  const handleConnectWa = () => {
    connectWa.mutate(undefined, {
      onSuccess: () => {
        toast({ title: "WhatsApp connection initiated. Please scan QR on web.whatsapp.com" });
        queryClient.invalidateQueries({ queryKey: getGetWhatsappStatusQueryKey() });
      },
      onError: () => toast({ title: "Error initiating WhatsApp", variant: "destructive" }),
    });
  };

  const handleDisconnectWa = () => {
    disconnectWa.mutate(undefined, {
      onSuccess: () => {
        toast({ title: "WhatsApp disconnected" });
        queryClient.invalidateQueries({ queryKey: getGetWhatsappStatusQueryKey() });
      },
      onError: () => toast({ title: "Error disconnecting", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground mt-1">Connect your email and WhatsApp to send campaigns</p>
      </div>

      {/* Gmail Integration */}
      <Card data-testid="card-gmail-integration">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
                <Mail className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-base">Gmail Integration</CardTitle>
                <CardDescription>Send emails using your Gmail account</CardDescription>
              </div>
            </div>
            {gmailLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : gmail?.isConnected ? (
              <Badge className="bg-green-100 text-green-700" data-testid="badge-gmail-status">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground" data-testid="badge-gmail-status">
                Not connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {gmail?.isConnected && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Connected with <strong>{gmail.senderEmail}</strong>. Update credentials below to change.
              </AlertDescription>
            </Alert>
          )}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Use a <strong>Gmail App Password</strong> (not your regular password).{" "}
              <a
                href="https://support.google.com/accounts/answer/185833"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Learn how to create one <ExternalLink className="h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="sender-email">Gmail Address</Label>
              <Input
                id="sender-email"
                type="email"
                value={senderEmail}
                onChange={e => setSenderEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                data-testid="input-sender-email"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="app-password">App Password</Label>
              <Input
                id="app-password"
                type="password"
                value={appPassword}
                onChange={e => setAppPassword(e.target.value)}
                placeholder="xxxx xxxx xxxx xxxx"
                data-testid="input-app-password"
                className="mt-1"
              />
            </div>
          </div>
          <Button
            onClick={handleSaveGmail}
            disabled={saveGmail.isPending}
            data-testid="btn-connect-gmail"
          >
            {saveGmail.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Connecting...</> : gmail?.isConnected ? "Update Gmail" : "Connect Gmail"}
          </Button>
        </CardContent>
      </Card>

      {/* WhatsApp Integration */}
      <Card data-testid="card-whatsapp-integration">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">WhatsApp Integration</CardTitle>
                <CardDescription>Send WhatsApp messages using Web WhatsApp</CardDescription>
              </div>
            </div>
            {waLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : waStatus?.isConnected ? (
              <Badge className="bg-green-100 text-green-700" data-testid="badge-wa-status">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground" data-testid="badge-wa-status">
                Not connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>How to connect WhatsApp:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                <li>Click "Connect WhatsApp" button below</li>
                <li>Open <a href="https://web.whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">web.whatsapp.com</a> in your browser</li>
                <li>Scan the QR code with your WhatsApp app</li>
                <li>Your session is saved — no need to scan again next time</li>
              </ol>
            </AlertDescription>
          </Alert>
          {waStatus?.phone && (
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm">Connected phone: <strong>{waStatus.phone}</strong></p>
            </div>
          )}
          <div className="flex gap-3">
            {!waStatus?.isConnected ? (
              <Button
                onClick={handleConnectWa}
                disabled={connectWa.isPending}
                className="bg-green-600 hover:bg-green-700"
                data-testid="btn-connect-whatsapp"
              >
                {connectWa.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Connecting...</> : "Connect WhatsApp"}
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={handleDisconnectWa}
                disabled={disconnectWa.isPending}
                data-testid="btn-disconnect-whatsapp"
              >
                {disconnectWa.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Disconnecting...</> : "Disconnect"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
