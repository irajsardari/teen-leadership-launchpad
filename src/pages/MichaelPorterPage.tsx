import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import porterImage from "@/assets/echoes-symbolic-porter.jpg";

const MichaelPorterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>Michael E. Porter – The Strategist Who Taught the World How Competition Creates Value | ECHOES | TMA</title>
        <meta name="description" content="The biography and legacy of Michael E. Porter, Harvard economist and strategist who introduced the Five Forces Model and taught the world about competitive strategy and shared value." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 bg-gradient-to-r from-tma-navy to-tma-blue">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/voices/echoes">
            <Button variant="ghost" className="mb-6 text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to ECHOES
            </Button>
          </Link>
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-4 bg-tma-red text-white hover:bg-tma-red/90">
              ECHOES
            </Badge>
            <p className="text-lg md:text-xl mb-2 text-white/90">
              The Messengers of Management
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          
          {/* Title */}
          <header className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Michael E. Porter
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground italic">
              The Strategist Who Taught the World How Competition Creates Value
            </p>
          </header>

          {/* Opening Quote */}
          <blockquote className="border-l-4 border-tma-blue pl-6 mb-12 italic text-lg text-muted-foreground">
            "The essence of strategy is choosing what not to do."
            <footer className="mt-2 text-sm not-italic">
              — Michael E. Porter (b. 1947)
            </footer>
          </blockquote>

          {/* Symbolic Image */}
          <figure className="mb-12 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={porterImage} 
              alt="Symbolic representation of Five Forces Model with pentagon and arrows representing competitive dynamics"
              loading="eager"
              className="w-full h-auto"
            />
          </figure>

          {/* Snapshot */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Snapshot</h2>
            <ul className="space-y-2 text-base leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">Full Name:</strong> Michael Eugene Porter</li>
              <li><strong className="text-foreground">Born:</strong> 23 May 1947, Ann Arbor, Michigan, USA</li>
              <li><strong className="text-foreground">Profession:</strong> Economist, strategist, professor of business administration</li>
              <li><strong className="text-foreground">Affiliation:</strong> Harvard Business School (Professor since 1973)</li>
              <li><strong className="text-foreground">Major Works:</strong> <em>Competitive Strategy</em> (1980), <em>Competitive Advantage</em> (1985), <em>The Competitive Advantage of Nations</em> (1990)</li>
              <li><strong className="text-foreground">Known For:</strong> Five Forces Model, Value Chain Analysis, Cluster Theory, Shared Value Concept</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4 italic">
              (Sources: Harvard Business School Archives; Harvard Institute for Strategy and Competitiveness; Fortune Magazine Thinkers list.)
            </p>
          </section>

          {/* Early Life & Influences */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Early Life & Influences</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Porter studied aerospace engineering at Princeton University, then earned an MBA and PhD in business economics at Harvard.
                His analytical mind led him to ask a deceptively simple question:
              </p>
              <p className="italic pl-6 border-l-2 border-tma-blue">
                "Why do some industries and nations succeed while others struggle?"
              </p>
              <p>
                In the 1970s, when management theory focused mostly on internal efficiency, Porter brought the rigor of economics into strategy — a discipline that had been largely intuitive until then.
              </p>
            </div>
          </section>

          {/* Turning Point */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Turning Point</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                In 1980, his book <em>Competitive Strategy</em> introduced the <strong>Five Forces Model</strong>, a framework that examined industry structure through:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-4">
                <li>Threat of new entrants</li>
                <li>Bargaining power of suppliers</li>
                <li>Bargaining power of buyers</li>
                <li>Threat of substitute products or services</li>
                <li>Rivalry among existing competitors</li>
              </ol>
              <p>
                He proved that profitability depends less on luck and more on understanding these forces and positioning wisely within them.
              </p>
              <p>
                Five years later, in <em>Competitive Advantage</em> (1985), he introduced the <strong>Value Chain</strong> — a way to see every company as a system of interconnected activities that create and deliver value.
              </p>
            </div>
          </section>

          {/* Major Works & Signature Ideas */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Major Works & Signature Ideas</h2>
            
            <h3 className="text-xl font-semibold mb-4 text-foreground">Key Publications:</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
              <li><em>Competitive Strategy</em> (1980)</li>
              <li><em>Competitive Advantage</em> (1985)</li>
              <li><em>The Competitive Advantage of Nations</em> (1990)</li>
              <li><em>On Competition</em> (2008)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-foreground">Core Ideas:</h3>
            <ol className="list-decimal list-inside space-y-3 text-base leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">Five Forces Analysis</strong> — understand industry structure to shape strategy.</li>
              <li><strong className="text-foreground">Generic Strategies</strong> — choose one: cost leadership, differentiation, or focus.</li>
              <li><strong className="text-foreground">Value Chain</strong> — analyze activities to find where value is created or lost.</li>
              <li><strong className="text-foreground">Clusters & National Competitiveness</strong> — regions thrive when businesses and institutions co-evolve.</li>
              <li><strong className="text-foreground">Shared Value</strong> — economic success and social progress can reinforce each other.</li>
            </ol>
          </section>

          {/* Selected Quotes */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Selected Quotes</h2>
            <div className="space-y-6">
              <blockquote className="border-l-4 border-tma-blue pl-6 italic text-lg text-muted-foreground">
                "Sound strategy starts with having the right goal."
              </blockquote>
              <blockquote className="border-l-4 border-tma-blue pl-6 italic text-lg text-muted-foreground">
                "Strategy is about making choices, trade-offs; it's about deliberately choosing to be different."
              </blockquote>
              <blockquote className="border-l-4 border-tma-blue pl-6 italic text-lg text-muted-foreground">
                "The purpose of business is to create value — for customers, for employees, and for society."
              </blockquote>
            </div>
          </section>

          {/* Honours & Recognition */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Honours & Recognition</h2>
            <ul className="list-disc list-inside space-y-2 text-base leading-relaxed text-muted-foreground">
              <li>Bishop William Lawrence University Professor, Harvard Business School</li>
              <li>Founder, Institute for Strategy and Competitiveness, Harvard (2001)</li>
              <li>Advisor to World Economic Forum, U.S. Council on Competitiveness, and numerous governments</li>
              <li>Thinkers50 Lifetime Achievement Award (2019)</li>
              <li>Honorary degrees from over 20 universities worldwide</li>
            </ul>
          </section>

          {/* Legacy */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Legacy</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Michael Porter turned strategy into an analytic discipline — linking economics, policy, and management into a single language of value creation.
                His frameworks are taught in every business school and used by executives across industries.
              </p>
              <p>
                Beyond corporate boardrooms, his concept of shared value inspired a generation of leaders to build companies that compete by solving social problems — not causing them.
              </p>
              <p>
                Every time a leader asks, "Where do we create value, and why does it matter?" — Porter's thinking is alive.
              </p>
            </div>
          </section>

          {/* Closing Reflection */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Closing Reflection</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Michael Porter continues to teach at Harvard, advising businesses and governments on competitiveness and social impact.
                He believes that strategy is not a battle plan but a moral choice about how we serve society.
              </p>
              <blockquote className="border-l-4 border-tma-blue pl-6 my-6 italic text-lg">
                "The real purpose of business is to solve problems profitably — not to profit from problems."
              </blockquote>
              <p>
                Through <strong>ECHOES</strong>, his voice reminds young leaders that competition is not about defeating others but about designing better ways to create value for all.
              </p>
            </div>
          </section>

          {/* Back Button */}
          <div className="mt-16 text-center">
            <Link to="/voices/echoes">
              <Button variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to ECHOES Collection
              </Button>
            </Link>
          </div>

        </div>
      </article>
    </div>
  );
};

export default MichaelPorterPage;
