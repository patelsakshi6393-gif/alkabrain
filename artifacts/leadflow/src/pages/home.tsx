import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layout/public-layout";
import { CheckCircle2, Zap, Users, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Built for Ambitious Indian SMBs
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-balance text-foreground leading-[1.1]">
            Grow Your Business With <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Automated Outreach</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Find local leads, send targeted emails, and run WhatsApp campaigns from a single powerful cockpit. Stop paying agencies and start closing deals yourself.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8" asChild>
              <Link href="/sign-up" data-testid="btn-hero-cta">Start 3-Day Trial for ₹5</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8" asChild>
              <Link href="/pricing" data-testid="btn-hero-pricing">View Pricing</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">No credit card required for sign up. Cancel anytime.</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to scale</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A complete toolkit designed specifically for the modern Indian entrepreneur.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border bg-card text-card-foreground shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Lead Scraper</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find business owners by niche and location. Instantly gather emails, phone numbers, and website data.
              </p>
            </div>
            <div className="p-8 rounded-2xl border bg-card text-card-foreground shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">WhatsApp Campaigns</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect your WhatsApp Web and send personalized bulk messages directly to your prospects.
              </p>
            </div>
            <div className="p-8 rounded-2xl border bg-card text-card-foreground shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Email Sequences</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect your Gmail and send automated outreach emails that land in the primary inbox, not spam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 border-t">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg mb-12">Pay only for what you use. Start small and scale up.</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto text-left">
            {/* Trial */}
            <div className="p-6 rounded-xl border bg-card shadow-sm flex flex-col">
              <h3 className="font-semibold text-lg mb-2">Trial</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">₹5</span>
                <span className="text-muted-foreground text-sm"> / 3 days</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Perfect to test the platform.</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>50 Credits</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Lead Scraper Access</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/sign-up">Start Trial</Link>
              </Button>
            </div>
            
            {/* Monthly */}
            <div className="p-6 rounded-xl border-2 border-primary bg-card shadow-md flex flex-col relative">
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Popular</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-primary">Monthly</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">₹99</span>
                <span className="text-muted-foreground text-sm"> / month</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">For small business owners.</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>1,000 Credits</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Unlimited Campaigns</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Email & WhatsApp</span>
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/sign-up">Get Monthly</Link>
              </Button>
            </div>

            {/* Quarterly */}
            <div className="p-6 rounded-xl border bg-card shadow-sm flex flex-col">
              <h3 className="font-semibold text-lg mb-2">Quarterly</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">₹249</span>
                <span className="text-muted-foreground text-sm"> / 3 months</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Save 15% long-term.</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>3,500 Credits</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Priority Support</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/sign-up">Get Quarterly</Link>
              </Button>
            </div>

            {/* Yearly */}
            <div className="p-6 rounded-xl border bg-card shadow-sm flex flex-col">
              <h3 className="font-semibold text-lg mb-2">Yearly</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">₹799</span>
                <span className="text-muted-foreground text-sm"> / year</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Best value. Save 30%.</p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>15,000 Credits</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Dedicated Manager</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/sign-up">Get Yearly</Link>
              </Button>
            </div>
          </div>
          <div className="mt-12 text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span>Payments secured by</span>
            <span className="font-bold text-foreground">Razorpay / UPI</span>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
