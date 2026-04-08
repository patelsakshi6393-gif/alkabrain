import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/public-layout";
import { CheckCircle2 } from "lucide-react";
import { useGetBillingPlans } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function Pricing() {
  const { data: plans, isLoading } = useGetBillingPlans();

  return (
    <PublicLayout>
      <div className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Simple, transparent pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16 leading-relaxed">
            Choose the plan that fits your business needs. Upgrade or downgrade at any time.
          </p>

          {isLoading ? (
            <LoadingScreen />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto text-left">
              {plans?.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`p-8 rounded-2xl bg-card flex flex-col relative ${
                    plan.isPopular 
                      ? 'border-2 border-primary shadow-xl shadow-primary/10' 
                      : 'border border-border shadow-sm'
                  }`}
                  data-testid={`card-pricing-${plan.name.toLowerCase()}`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <h3 className={`font-bold text-xl mb-2 ${plan.isPopular ? 'text-primary' : 'text-foreground'}`}>
                    {plan.name}
                  </h3>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">₹{plan.price}</span>
                    <span className="text-muted-foreground">
                      {plan.durationDays === 3 ? " / 3 days" : 
                       plan.durationDays === 30 ? " / month" :
                       plan.durationDays === 90 ? " / 3 months" :
                       plan.durationDays === 365 ? " / year" : ` / ${plan.durationDays} days`}
                    </span>
                  </div>
                  
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-sm font-medium">
                      <ZapIcon className="w-4 h-4" />
                      {plan.credits.toLocaleString()} Credits
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full h-12 text-base font-medium" 
                    variant={plan.isPopular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/sign-up" data-testid={`btn-select-${plan.name.toLowerCase()}`}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-black border shadow-sm">
              <span className="text-sm text-muted-foreground">Payments secured by</span>
              <span className="font-bold text-foreground">Razorpay / UPI</span>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

function ZapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}