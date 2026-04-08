import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="h-20 border-b border-border bg-background flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
          <span className="text-2xl font-bold tracking-tight text-foreground">LeadFlow</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/sign-in" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
          <Button asChild className="font-semibold px-6" size="lg">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </nav>
      </header>
      
      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gray-50 dark:bg-gray-900 border-t py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white font-bold text-xs">L</div>
            <span className="text-lg font-bold">LeadFlow</span>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-6">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LeadFlow Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
