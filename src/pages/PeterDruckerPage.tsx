import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Quote } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PeterDruckerPage = () => {
  const { slug } = useParams();
  
  // In the future, you can load different profiles based on the slug
  // For now, we only have Peter Drucker
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>ECHOES – Peter Drucker | Teenagers Management Academy</title>
        <meta name="description" content="The story and legacy of Peter F. Drucker — the father of modern management — through TMA's ECHOES series, connecting timeless ideas with today's AI generation." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      {/* Header Navigation */}
      <section className="bg-tma-navy text-white py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80 hover:bg-white/10" 
            asChild
          >
            <Link to="/voices/echoes" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to ECHOES
            </Link>
          </Button>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <Badge className="mb-6 bg-tma-red text-white hover:bg-tma-red/90">
              ECHOES – The Messengers of Management
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-inter tracking-tight text-foreground">
              Peter F. Drucker: The Visionary Who Taught Us How to Think
            </h1>
            <p className="text-xl text-muted-foreground italic">
              The father of modern management who believed people, not profit, are the true measure of success
            </p>
          </div>

          {/* Portrait */}
          <div className="mb-12 flex justify-center">
            <div className="relative">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Peter_Drucker_cropped.jpg/400px-Peter_Drucker_cropped.jpg"
                alt="Peter F. Drucker"
                className="rounded-lg shadow-2xl max-w-sm w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-tma-red text-white p-4 rounded-lg shadow-xl">
                <Quote className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Famous Quote */}
          <blockquote className="my-12 p-8 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg">
            <p className="text-xl md:text-2xl font-medium italic text-foreground mb-4">
              "The best way to predict the future is to create it."
            </p>
            <cite className="text-muted-foreground not-italic">— Peter F. Drucker</cite>
          </blockquote>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-foreground leading-relaxed">
              <p className="text-lg">
                <strong>Note:</strong> Please provide the full biography content for Peter Drucker. This is a placeholder structure showing how the page will be formatted. Include sections about:
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>His early life and education</li>
                <li>Career milestones and major contributions</li>
                <li>Key management philosophies and ideas</li>
                <li>Famous works and publications</li>
                <li>Impact on modern business and leadership</li>
                <li>Legacy and relevance to TMA's mission</li>
                <li>Connection to teenage leadership development</li>
              </ul>

              <div className="my-8 p-6 bg-tma-orange/10 border-l-4 border-tma-orange rounded-r-lg">
                <h3 className="text-xl font-bold mb-3 text-foreground">TMA Connection</h3>
                <p className="text-foreground/90">
                  [Add a section explaining how Drucker's philosophy connects to TMA's mission of developing teenage leaders and the importance of teaching management skills early]
                </p>
              </div>

              <p className="text-lg">
                [Continue with full biography content here...]
              </p>
            </div>
          </div>

          {/* Next in Series */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Next in ECHOES</p>
                <p className="text-lg font-medium text-muted-foreground">Coming Soon...</p>
              </div>
              <Button 
                variant="outline"
                asChild
              >
                <Link to="/voices/echoes">
                  View All Profiles
                </Link>
              </Button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="italic">
              <strong>Disclaimer:</strong> This biography is presented for educational purposes, celebrating the contributions 
              of management pioneers to inspire the next generation of leaders at TMA.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PeterDruckerPage;
