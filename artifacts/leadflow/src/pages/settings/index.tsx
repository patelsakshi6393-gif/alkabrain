import { useUser } from "@clerk/react";
import { useGetMe } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Calendar, Zap } from "lucide-react";

export default function Settings() {
  const { user: clerkUser, isLoaded } = useUser();
  const { data: profile, isLoading } = useGetMe();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Your account information</p>
      </div>

      <Card data-testid="card-profile">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLoaded || isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Name</p>
                  <p className="font-semibold text-foreground" data-testid="text-user-name">
                    {clerkUser?.fullName || profile?.name || "—"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </p>
                  <p className="font-semibold text-foreground text-sm" data-testid="text-user-email">
                    {clerkUser?.primaryEmailAddress?.emailAddress || profile?.email || "—"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Member since
                  </p>
                  <p className="font-semibold text-foreground" data-testid="text-member-since">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Credits
                  </p>
                  <p className="font-semibold text-foreground" data-testid="text-credits">
                    {profile?.creditsRemaining ?? "—"} remaining
                  </p>
                </div>
              </div>
              {profile?.planName && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm text-muted-foreground">Current Plan:</span>
                  <Badge className="bg-primary/10 text-primary">{profile.planName}</Badge>
                  {profile.planExpiresAt && (
                    <span className="text-xs text-muted-foreground">
                      (expires {new Date(profile.planExpiresAt).toLocaleDateString("en-IN")})
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manage Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            To change your password, email, or connected accounts, use the Auth pane in the workspace toolbar or contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
