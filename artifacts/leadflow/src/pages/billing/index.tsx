import { useGetBillingPlans, useGetSubscription, useGetCreditsHistory } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Zap, Crown, Star, Shield, AlertCircle, ExternalLink, Clock } from "lucide-react";
import { useUser } from "@clerk/react";

const PLAN_LABELS: Record<string, string> = {
  trial: "/ 3 days",
  monthly: "/ month",
  quarterly: "/ 3 months",
  yearly: "/ year",
};

function PlanCard({
  plan,
  isCurrentPlan,
  userEmail,
  userName,
}: {
  plan: any;
  isCurrentPlan: boolean;
  userEmail: string;
  userName: string;
}) {
  const paymentUrl = plan.paymentUrl
    ? `${plan.paymentUrl}?prefill[email]=${encodeURIComponent(userEmail)}&prefill[name]=${encodeURIComponent(userName)}`
    : null;

  return (
    <Card
      className={`relative flex flex-col ${isCurrentPlan ? "border-primary ring-2 ring-primary" : ""} ${plan.isPopular ? "border-primary/50 shadow-md" : ""}`}
      data-testid={`card-plan-${plan.id}`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-0.5 shadow">
            <Star className="h-3 w-3 mr-1" /> Most Popular
          </Badge>
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-green-600 text-white px-3 py-0.5">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Active
          </Badge>
        </div>
      )}
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          {plan.id === "yearly" && <Crown className="h-4 w-4 text-yellow-500" />}
          {plan.name}
        </CardTitle>
        <div className="mt-3">
          <span className="text-4xl font-extrabold text-foreground">₹{plan.price}</span>
          <span className="text-muted-foreground ml-2 text-sm">{PLAN_LABELS[plan.id]}</span>
        </div>
        <p className="text-sm text-primary font-semibold mt-1 flex items-center gap-1">
          <Zap className="h-3.5 w-3.5" />
          {plan.credits.toLocaleString("en-IN")} credits included
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-2 flex-1 mb-6">
          {plan.features.map((feature: string) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {isCurrentPlan ? (
          <Button className="w-full" variant="outline" disabled>
            <CheckCircle2 className="h-4 w-4 mr-2" /> Current Plan
          </Button>
        ) : paymentUrl ? (
          <Button
            className="w-full font-semibold"
            variant={plan.isPopular ? "default" : "outline"}
            asChild
            data-testid={`btn-plan-${plan.id}`}
          >
            <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
              {plan.id === "trial" ? "Start Trial — ₹5" : `Buy Now — ₹${plan.price}`}
              <ExternalLink className="h-3.5 w-3.5 ml-2 opacity-70" />
            </a>
          </Button>
        ) : (
          <Button className="w-full" variant="outline" disabled>
            Pay Now — ₹{plan.price}
          </Button>
        )}

        {!isCurrentPlan && (
          <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" /> UPI · Cards · Net Banking · Wallets
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Billing() {
  const { data: plans, isLoading: plansLoading } = useGetBillingPlans();
  const { data: subscription } = useGetSubscription();
  const { data: creditHistory, isLoading: historyLoading } = useGetCreditsHistory();
  const { user } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
  const userName = user?.fullName || user?.firstName || "ALKABRAIN User";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Plans</h1>
        <p className="text-muted-foreground mt-1">Choose a plan to unlock more credits and features</p>
      </div>

      {/* Active plan banner */}
      {subscription?.isActive && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950">
          <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">{subscription.planName} — Active</p>
                <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-1 mt-0.5">
                  <Clock className="h-3.5 w-3.5" />
                  Expires: {subscription.expiresAt
                    ? new Date(subscription.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                    : "—"}
                </p>
              </div>
            </div>
            <Badge className="bg-green-600 text-white px-3">Active</Badge>
          </CardContent>
        </Card>
      )}

      {/* How it works */}
      <Card className="bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-indigo-800 dark:text-indigo-200">How Payment Works</p>
            <p className="text-indigo-700 dark:text-indigo-300 mt-1">
              Click "Buy Now" → Razorpay payment page opens → Pay via UPI / Card / Net Banking →
              Credits are automatically added to your account within seconds.
              Your email is pre-filled automatically.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plan cards */}
      {plansLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-96" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans?.map((plan: any) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={!!(subscription?.planId === plan.id && subscription?.isActive)}
              userEmail={userEmail}
              userName={userName}
            />
          ))}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Payments secured by Razorpay — India's most trusted payment gateway. No hidden charges.
      </p>

      {/* Credits History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Credits History</CardTitle>
          <CardDescription>Track your credit usage and purchases</CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-10" />)}</div>
          ) : !creditHistory || creditHistory.length === 0 ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-6 justify-center">
              <AlertCircle className="h-4 w-4" />
              No credit transactions yet. Purchase a plan to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Description</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Credits</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {creditHistory.map((tx: any) => (
                    <tr key={tx.id} className="border-b hover:bg-muted/30" data-testid={`row-credit-${tx.id}`}>
                      <td className="py-2 px-3 text-foreground">{tx.description}</td>
                      <td className="py-2 px-3">
                        <Badge className={tx.type === "credit"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}>
                          {tx.type === "credit" ? "Purchase" : "Used"}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 font-semibold" data-testid={`text-amount-${tx.id}`}>
                        <span className={tx.type === "credit" ? "text-green-600" : "text-red-600"}>
                          {tx.type === "credit" ? "+" : "-"}{tx.amount}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
