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
      <section className="relative py-20 lg:py-32 bg-gradient-to-r from-tma-teal to-tma-green">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-inter tracking-tight">
              TMA Voices
            </h1>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* TMA Voices Card */}
            <Link to="/insights" className="block group">
              <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 hover:border-tma-teal">
                <CardHeader className="text-center space-y-6 pt-12">
                  <div className="mx-auto w-20 h-20 rounded-full bg-tma-teal/10 flex items-center justify-center group-hover:bg-tma-teal/20 transition-colors duration-300">
                    <Megaphone className="w-10 h-10 text-tma-teal" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-foreground">
                    TMA Voices
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-12">
                  <CardDescription className="text-lg leading-relaxed text-muted-foreground">
                    Current insights, perspectives, and thought leadership on teenage development and management
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            {/* ECHOES Card */}
            <Link to="/voices/echoes" className="block group">
              <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 hover:border-tma-red">
                <CardHeader className="text-center space-y-6 pt-12">
                  <div className="mx-auto w-20 h-20 rounded-full bg-tma-red/10 flex items-center justify-center group-hover:bg-tma-red/20 transition-colors duration-300">
                    <BookOpen className="w-10 h-10 text-tma-red" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-tma-red">
                    ECHOES
                  </CardTitle>
                  <p className="text-lg font-medium text-tma-red italic">
                    The Messengers of Management
                  </p>
                </CardHeader>
                <CardContent className="text-center pb-12">
                  <CardDescription className="text-lg leading-relaxed text-muted-foreground">
                    Biographies and legacies of the great minds who shaped modern management thinking
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
