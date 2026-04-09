import { useState, useEffect, useCallback } from "react";
import { useGetBillingPlans, useGetSubscription, useGetCreditsHistory } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Zap, Crown, Star, Loader2, Shield, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function PlanCard({
  plan,
  isCurrentPlan,
  onBuy,
  loading,
}: {
  plan: any;
  isCurrentPlan: boolean;
  onBuy: (planId: string) => void;
  loading: boolean;
}) {
  return (
    <Card
      className={`relative flex flex-col ${isCurrentPlan ? "border-primary ring-2 ring-primary" : ""} ${plan.isPopular ? "border-primary/60" : ""}`}
      data-testid={`card-plan-${plan.id}`}
    >
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
            {plan.id === "trial" ? "/ 3 days" : plan.id === "monthly" ? "/ month" : plan.id === "quarterly" ? "/ 3 months" : "/ year"}
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
          className="w-full font-semibold"
          variant={isCurrentPlan ? "outline" : plan.isPopular ? "default" : "outline"}
          disabled={isCurrentPlan || loading}
          onClick={() => !isCurrentPlan && onBuy(plan.id)}
          data-testid={`btn-plan-${plan.id}`}
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
          ) : isCurrentPlan ? (
            "Current Plan"
          ) : plan.id === "trial" ? (
            "Start Trial — ₹5"
          ) : (
            `Upgrade — ₹${plan.price}`
          )}
        </Button>
        {!isCurrentPlan && (
          <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" /> Secured by Razorpay · UPI · Cards · Net Banking
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Billing() {
  const { data: plans, isLoading: plansLoading } = useGetBillingPlans();
  const { data: subscription, refetch: refetchSub } = useGetSubscription();
  const { data: creditHistory, isLoading: historyLoading, refetch: refetchHistory } = useGetCreditsHistory();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [payingPlanId, setPayingPlanId] = useState<string | null>(null);

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleBuy = useCallback(async (planId: string) => {
    setPayingPlanId(planId);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast({ title: "Error", description: "Could not load payment gateway. Check your internet connection.", variant: "destructive" });
        setPayingPlanId(null);
        return;
      }

      // Step 1: Create order on server
      const orderRes = await fetch("/api/billing/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planId }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast({
          title: "Payment setup failed",
          description: orderData.error || "Could not initiate payment. Please try again.",
          variant: "destructive",
        });
        setPayingPlanId(null);
        return;
      }

      // Step 2: Open Razorpay checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ALKABRAIN",
        description: `${orderData.planName} — ₹${orderData.planPrice}`,
        image: "/logo.png",
        order_id: orderData.orderId,
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => {
            setPayingPlanId(null);
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // Step 3: Verify payment signature on backend (automatic/cryptographic)
          try {
            const verifyRes = await fetch("/api/billing/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              toast({
                title: "Payment Successful!",
                description: verifyData.message,
              });
              // Refresh all billing data
              await refetchSub();
              await refetchHistory();
              queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
            } else {
              toast({
                title: "Verification failed",
                description: verifyData.error || "Payment could not be verified. Contact support@alkabrain.in",
                variant: "destructive",
              });
            }
          } catch {
            toast({
              title: "Verification error",
              description: "Payment done but verification failed. Contact support@alkabrain.in with your payment ID.",
              variant: "destructive",
            });
          } finally {
            setPayingPlanId(null);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (err: any) => {
        toast({
          title: "Payment failed",
          description: err?.error?.description || "Transaction failed. Try again or use a different payment method.",
          variant: "destructive",
        });
        setPayingPlanId(null);
      });
      rzp.open();

    } catch (err) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      setPayingPlanId(null);
    }
  }, [toast, refetchSub, refetchHistory, queryClient]);

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
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">{subscription.planName} — Active</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Expires: {subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                </p>
              </div>
            </div>
            <Badge className="bg-green-600 text-white">Active</Badge>
          </CardContent>
        </Card>
      )}

      {plansLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-96" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans?.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={!!(subscription?.planId === plan.id && subscription?.isActive)}
              onBuy={handleBuy}
              loading={payingPlanId === plan.id}
            />
          ))}
        </div>
      )}

      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-800 dark:text-blue-200">100% Secure Payment</p>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              All payments are processed by Razorpay — India's most trusted payment gateway. 
              Supports UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Wallets.
              Payments are verified automatically using cryptographic signatures.
            </p>
          </div>
        </CardContent>
      </Card>

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
                        <Badge className={tx.type === "credit" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}>
                          {tx.type === "credit" ? "Purchase" : "Used"}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 font-semibold" data-testid={`text-amount-${tx.id}`}>
                        <span className={tx.type === "credit" ? "text-green-600" : "text-red-600"}>
                          {tx.type === "credit" ? "+" : "-"}{tx.amount}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
