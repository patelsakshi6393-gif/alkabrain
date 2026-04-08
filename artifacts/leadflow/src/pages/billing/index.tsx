import { useGetBillingPlans, useGetSubscription, useGetCreditsHistory } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Zap, Crown, Star } from "lucide-react";

function PlanCard({ plan, isCurrentPlan }: { plan: any; isCurrentPlan: boolean }) {
  return (
    <Card className={`relative flex flex-col ${isCurrentPlan ? "border-primary ring-1 ring-primary" : ""} ${plan.isPopular ? "border-primary/60" : ""}`} data-testid={`card-plan-${plan.id}`}>
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3">
            <Star className="h-3 w-3 mr-1" /> Most Popular
          </Badge>
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-green-600 text-white px-3">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Current Plan
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
          <span className="text-muted-foreground ml-2">
            / {plan.id === "trial" ? "3 days" : plan.id === "monthly" ? "month" : plan.id === "quarterly" ? "3 months" : "year"}
          </span>
        </div>
        <p className="text-sm text-primary font-medium mt-1">
          <Zap className="h-3.5 w-3.5 inline mr-1" />
          {plan.credits.toLocaleString()} credits included
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
        <Button
          className="w-full"
          variant={isCurrentPlan ? "outline" : plan.isPopular ? "default" : "outline"}
          disabled={isCurrentPlan}
          data-testid={`btn-plan-${plan.id}`}
        >
          {isCurrentPlan ? "Current Plan" : plan.id === "trial" ? "Start Trial" : "Upgrade Now"}
        </Button>
        {!isCurrentPlan && (
          <p className="text-xs text-muted-foreground text-center mt-2">Payment via UPI / Razorpay</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Billing() {
  const { data: plans, isLoading: plansLoading } = useGetBillingPlans();
  const { data: subscription } = useGetSubscription();
  const { data: creditHistory, isLoading: historyLoading } = useGetCreditsHistory();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Plans</h1>
        <p className="text-muted-foreground mt-1">Choose a plan to unlock more credits and features</p>
      </div>

      {subscription?.isActive && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-semibold text-foreground">Active Plan: {subscription.planName}</p>
                <p className="text-sm text-muted-foreground">
                  Expires: {subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString("en-IN") : "—"}
                </p>
              </div>
            </div>
            <Badge className="bg-green-600 text-white">Active</Badge>
          </CardContent>
        </Card>
      )}

      {plansLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-80" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans?.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={subscription?.planId === plan.id && subscription?.isActive}
            />
          ))}
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Payments are 100% secured by Razorpay / UPI. No hidden charges.
      </p>

      {/* Credits History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Credits History</CardTitle>
          <CardDescription>Track your credit usage and purchases</CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-10" />)}</div>
          ) : !creditHistory || creditHistory.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No credit transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Description</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {creditHistory.map(tx => (
                    <tr key={tx.id} className="border-b hover:bg-muted/30" data-testid={`row-credit-${tx.id}`}>
                      <td className="py-2 px-3 text-foreground">{tx.description}</td>
                      <td className="py-2 px-3">
                        <Badge className={tx.type === "credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {tx.type === "credit" ? "+" : "-"}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 font-semibold" data-testid={`text-amount-${tx.id}`}>
                        <span className={tx.type === "credit" ? "text-green-600" : "text-red-600"}>
                          {tx.type === "credit" ? "+" : "-"}{tx.amount}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString("en-IN")}
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
