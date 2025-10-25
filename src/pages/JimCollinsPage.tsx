import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import collinsImage from "@/assets/echoes-symbolic-collins.jpg";

const JimCollinsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>Jim Collins – The Researcher Who Turned Data into the DNA of Greatness | ECHOES | TMA</title>
        <meta name="description" content="The biography and legacy of Jim Collins, researcher and author of Good to Great, who revealed the disciplines and principles that separate enduring excellence from mediocrity." />
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
              Jim Collins
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground italic">
              The Researcher Who Turned Data into the DNA of Greatness
            </p>
          </header>

          {/* Opening Quote */}
          <blockquote className="border-l-4 border-tma-blue pl-6 mb-12 italic text-lg text-muted-foreground">
            "Greatness is not a function of circumstance. Greatness, it turns out, is largely a matter of conscious choice and discipline."
            <footer className="mt-2 text-sm not-italic">
              — Jim Collins (b. 1958)
            </footer>
          </blockquote>

          {/* Symbolic Image */}
          <figure className="mb-12 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={collinsImage} 
              alt="Symbolic representation of sustained greatness with mountain summit representing disciplined ascent"
              loading="eager"
              className="w-full h-auto"
            />
            <figcaption className="text-sm text-center text-muted-foreground mt-4 italic">
              A mountain summit under a clear sky — the ascent of discipline and purpose.
            </figcaption>
          </figure>

          {/* Snapshot */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Snapshot</h2>
            <ul className="space-y-2 text-base leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">Full Name:</strong> James C. Collins III</li>
              <li><strong className="text-foreground">Born:</strong> 25 January 1958, Boulder, Colorado, USA</li>
              <li><strong className="text-foreground">Profession:</strong> Researcher, author, teacher, business consultant</li>
              <li><strong className="text-foreground">Affiliation:</strong> Stanford Graduate School of Business (former faculty); now operates from Boulder Research Lab</li>
              <li><strong className="text-foreground">Major Works:</strong> <em>Built to Last</em> (1994), <em>Good to Great</em> (2001), <em>How the Mighty Fall</em> (2009), <em>Great by Choice</em> (2011)</li>
              <li><strong className="text-foreground">Known For:</strong> Evidence-based research on enduring organizations and leadership disciplines</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4 italic">
              (Sources: Stanford University archives; Harvard Business Review interviews; Jim Collins Research Lab.)
            </p>
          </section>

          {/* Early Life & Influences */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Early Life & Influences</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Collins earned degrees in mathematical sciences and business administration from Stanford University, where he later taught as a lecturer.
                Before turning to research, he worked at McKinsey & Co. and Hewlett-Packard — experiences that taught him how companies succeed or stall.
              </p>
              <p>
                In his thirties he left the academic path to create his own independent research laboratory in Boulder, Colorado, to study organizational endurance over decades.
                Outside the office he is an avid rock climber, seeing in each ascent the discipline, focus, and humility required to reach greatness.
              </p>
            </div>
          </section>

          {/* Turning Point */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Turning Point</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                In 1994, with Jerry Porras, he published <em>Built to Last</em>, a six-year study of companies that remained successful for decades.
                The book showed that lasting firms were guided by core values and purpose beyond profit.
              </p>
              <p>
                His follow-up, <em>Good to Great</em> (2001), became a global phenomenon.
                Collins and his team analyzed 1,435 companies to find 11 that leaped from mediocrity to sustained excellence — then asked why.
                Their answers gave the world a new language of leadership: Level 5 Leaders, the Hedgehog Concept, and the Flywheel Effect.
              </p>
            </div>
          </section>

          {/* Major Works & Signature Ideas */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Major Works & Signature Ideas</h2>
            
            <h3 className="text-xl font-semibold mb-4 text-foreground">Key Publications:</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
              <li><em>Built to Last</em> (1994, with Jerry Porras)</li>
              <li><em>Good to Great</em> (2001)</li>
              <li><em>How the Mighty Fall</em> (2009)</li>
              <li><em>Great by Choice</em> (2011, with Morten Hansen)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-foreground">Core Ideas:</h3>
            <ol className="list-decimal list-inside space-y-3 text-base leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">Level 5 Leadership</strong> – True leaders blend personal humility with professional will.</li>
              <li><strong className="text-foreground">The Hedgehog Concept</strong> – Greatness comes from focusing on what you can be best at, what you love, and what drives your economic engine.</li>
              <li><strong className="text-foreground">The Flywheel</strong> – Big results come from small, consistent efforts over time.</li>
              <li><strong className="text-foreground">Preserve the Core / Stimulate Progress</strong> – Enduring companies stay true to values while constantly adapting.</li>
              <li><strong className="text-foreground">Return on Luck</strong> – Success depends less on luck than on how you use it.</li>
            </ol>
          </section>

          {/* Selected Quotes */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Selected Quotes</h2>
            <div className="space-y-6">
              <blockquote className="border-l-4 border-tma-blue pl-6 italic text-lg text-muted-foreground">
                "Good is the enemy of great."
              </blockquote>
              <blockquote className="border-l-4 border-tma-blue pl-6 italic text-lg text-muted-foreground">
                "Great vision without great people is irrelevant."
              </blockquote>
              <blockquote className="border-l-4 border-tma-blue pl-6 italic text-lg text-muted-foreground">
                "By facing the brutal facts, we can build faith in our ability to prevail."
              </blockquote>
              <blockquote className="border-l-4 border-tma-blue pl-6 italic text-lg text-muted-foreground">
                "The signature of mediocrity is chronic inconsistency."
              </blockquote>
            </div>
          </section>

          {/* Honours & Recognition */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Honours & Recognition</h2>
            <ul className="list-disc list-inside space-y-2 text-base leading-relaxed text-muted-foreground">
              <li>Distinguished Teaching Award, Stanford Graduate School of Business</li>
              <li>Named among Top 25 Most Influential Business Thinkers by Thinkers50</li>
              <li>Advisor to Fortune 500 CEOs, nonprofits, and the U.S. military academy at West Point</li>
              <li>Honorary doctorates from multiple universities</li>
              <li>Over 10 million books sold worldwide</li>
            </ul>
          </section>

          {/* Legacy */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Legacy</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Jim Collins transformed leadership research into a discipline of clarity and evidence.
                He proved that greatness is not charisma or luck — it's character and consistency.
                His frameworks have guided leaders from start-ups to governments and social enterprises.
              </p>
              <p>
                Even today, his team in Boulder continues to study organizations that endure beyond their founders, asking new questions about resilience and purpose.
              </p>
              <p>
                Every time a leader pauses to ask, "What's our flywheel?" or "Are we disciplined enough to be great?" — his influence lives on.
              </p>
            </div>
          </section>

          {/* Closing Reflection */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Closing Reflection</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Jim Collins still teaches, writes, and climbs the mountains around Boulder, seeing in each ascent the symbol of steady discipline and quiet excellence.
                He reminds leaders that greatness is not a moment of luck, but a lifetime of choices.
              </p>
              <blockquote className="border-l-4 border-tma-blue pl-6 my-6 italic text-lg">
                "The great companies of this world were not built in a single stroke of genius — they were built turn by turn, push by push, on the flywheel of discipline."
              </blockquote>
              <p>
                Through <strong>ECHOES</strong>, his voice inspires future leaders to climb with focus, endurance, and faith in the power of steady progress.
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

export default JimCollinsPage;
