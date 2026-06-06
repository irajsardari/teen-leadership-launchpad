import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

const MaintenancePage = () => {
  return (
    <>
      <Helmet>
        <title>TMA — Temporarily Offline for Updates</title>
        <meta name="description" content="Teenagers Management Academy is undergoing strategic updates. We look forward to welcoming you back soon." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="min-h-[80vh] flex items-center justify-center px-6 py-20 bg-background">
        <div className="max-w-2xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-xs uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            Private Mode
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
            TMA – Teenagers Management Academy
          </h1>
          <div className="w-16 h-px bg-primary mx-auto" />
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Our website is currently undergoing strategic updates and improvements.
            We look forward to welcoming you back soon.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <a
              href="mailto:info@teenmanagement.com"
              className="inline-flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              info@teenmanagement.com
            </a>
          </div>
          <div className="pt-8">
            <Link
              to="/auth"
              className="text-xs text-muted-foreground/60 hover:text-primary underline underline-offset-4"
            >
              Administrator sign in
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default MaintenancePage;