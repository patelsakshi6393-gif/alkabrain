import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="h-20 border-b border-border bg-background/95 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="ALKABRAIN" className="w-9 h-9 rounded-xl object-cover" />
          <span className="text-2xl font-black tracking-tight text-foreground">ALKA<span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #a855f7)" }}>BRAIN</span></span>
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
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="ALKABRAIN" className="w-7 h-7 rounded-lg object-cover" />
            <span className="text-lg font-black">ALKA<span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #a855f7)" }}>BRAIN</span></span>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-6">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ALKABRAIN. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
