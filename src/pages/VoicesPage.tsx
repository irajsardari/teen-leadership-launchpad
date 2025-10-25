import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Megaphone, BookOpen } from "lucide-react";

const VoicesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>Voices | TMA Academy</title>
        <meta name="description" content="Explore TMA Voices insights and ECHOES biographies - leadership wisdom for the modern age." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tma-teal/5 via-background to-tma-red/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-inter tracking-tight bg-gradient-to-r from-tma-teal to-tma-red bg-clip-text text-transparent">
              TMA Voices & Echoes
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights from today, wisdom from yesterday
            </p>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* TMA Voices Card */}
            <Link to="/insights" className="block group">
              <Card className="relative h-full overflow-hidden border-2 border-tma-teal/20 bg-white/50 backdrop-blur-sm hover:border-tma-teal/40 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,150,136,0.3)] hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-tma-teal/10 to-transparent rounded-bl-full" />
                <CardHeader className="text-center space-y-6 pt-12 pb-6 relative z-10">
                  <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-tma-teal to-tma-teal/80 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Megaphone className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-tma-teal mb-2">
                      TMA Voices
                    </CardTitle>
                    <p className="text-sm font-medium text-tma-teal/70 uppercase tracking-wider">
                      Current Perspectives
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="text-center pb-12 px-6 relative z-10">
                  <CardDescription className="text-base leading-relaxed text-foreground/70">
                    Contemporary insights, reflections, and thought leadership on teenage development and management
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            {/* ECHOES Card */}
            <Link to="/voices/echoes" className="block group">
              <Card className="relative h-full overflow-hidden border-2 border-tma-red/20 bg-white/50 backdrop-blur-sm hover:border-tma-red/40 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(220,38,38,0.3)] hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-tma-red/10 to-transparent rounded-bl-full" />
                <CardHeader className="text-center space-y-6 pt-12 pb-6 relative z-10">
                  <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-tma-red to-tma-red/80 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-tma-red mb-2">
                      ECHOES
                    </CardTitle>
                    <p className="text-sm font-medium text-tma-red/70 uppercase tracking-wider">
                      The Messengers of Management
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="text-center pb-12 px-6 relative z-10">
                  <CardDescription className="text-base leading-relaxed text-foreground/70">
                    Timeless biographies and legacies of the great minds who shaped modern management and leadership
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
};

export default VoicesPage;
