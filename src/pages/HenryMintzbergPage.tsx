import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import mintzbergImage from "@/assets/echoes-symbolic-mintzberg.jpg";

const HenryMintzbergPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>Henry Mintzberg – The Strategist Who Redefined Management as Practice | ECHOES | TMA</title>
        <meta name="description" content="Biography of Henry Mintzberg, the management scientist who observed real managers and redefined strategy as an emergent, lived process rather than rigid planning." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 max-w-4xl">
        {/* Back Button */}
        <Link to="/voices/echoes" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to ECHOES
          </Button>
        </Link>

        {/* Header Section */}
        <header className="mb-12">
          <div className="inline-block px-4 py-1.5 bg-tma-red/10 text-tma-red rounded-full text-sm font-semibold mb-6">
            ECHOES
          </div>
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
            The Messengers of Management
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
            Henry Mintzberg — The Strategist Who Redefined Management as Practice
          </h1>
        </header>

        {/* Quote Section */}
        <div className="mb-12 p-8 bg-gradient-to-br from-tma-navy/5 to-tma-blue/5 rounded-2xl border border-tma-navy/10">
          <blockquote className="text-xl md:text-2xl italic text-foreground leading-relaxed">
            "Management is, above all, a practice — where art, science, and craft meet."
          </blockquote>
          <p className="mt-4 text-muted-foreground font-medium">
            — Henry Mintzberg (b. 1939)
          </p>
        </div>

        {/* Symbolic Image */}
        <figure className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src={mintzbergImage} 
            alt="Symbolic representation of exploration and practice - a hand-drawn compass and map representing Henry Mintzberg's view of management as lived practice"
            className="w-full h-auto"
            loading="eager"
          />
          <figcaption className="text-sm text-muted-foreground text-center mt-4 italic">
            Symbolic visual: a compass or map drawn by hand — representing exploration, reflection, and real-world navigation.
          </figcaption>
        </figure>

        {/* Snapshot Section */}
        <section className="mb-12 p-8 bg-card rounded-2xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Snapshot</h2>
          <ul className="space-y-3 text-foreground/90">
            <li><strong>Full Name:</strong> Henry Mintzberg</li>
            <li><strong>Born:</strong> 2 September 1939, Montreal, Canada</li>
            <li><strong>Profession:</strong> Management scientist, author, professor of strategy and organization</li>
            <li><strong>Affiliation:</strong> McGill University (Montreal); MIT Sloan School of Management (PhD, 1973)</li>
            <li><strong>Major Works:</strong> <em>The Nature of Managerial Work</em> (1973), <em>The Rise and Fall of Strategic Planning</em> (1994), <em>Managers Not MBAs</em> (2004), <em>Strategy Safari</em> (1998, with Ahlstrand & Lampel)</li>
            <li><strong>Known For:</strong> Observing real managers, identifying ten managerial roles, redefining strategy as an emergent, lived process</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground italic">
            (Sources: McGill University Archives; MIT Thesis Database; Financial Times Top 50 Scholars.)
          </p>
        </section>

        {/* Early Life Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Early Life & Influences</h2>
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
            <p>
              Born in Montreal, Mintzberg studied mechanical engineering at McGill University before earning his doctorate at MIT.
              While most researchers built theories from surveys, he carried a notebook into offices and factories, sitting quietly behind managers to see what they actually did.
              He noticed chaos — constant interruptions, rapid decisions, and conversations that built meaning in real time.
              From these observations emerged his lifelong mission: to close the gap between the fantasy of management education and the reality of managerial life.
            </p>
          </div>
        </section>

        {/* Turning Point Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Turning Point</h2>
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
            <p>
              His PhD thesis became <em>The Nature of Managerial Work</em> (1973), a classic that overturned decades of assumptions.
              He identified ten managerial roles — from figurehead and liaison to negotiator and disturbance handler — showing that managers juggle dozens of tasks in bursts of minutes, not in neat sequences.
              Later, in <em>The Rise and Fall of Strategic Planning</em> (1994), he challenged the corporate obsession with rigid plans, arguing that strategy emerges from patterns of action, not only from deliberate design.
            </p>
          </div>
        </section>

        {/* Major Works Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Major Works & Signature Ideas</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-foreground">Key Publications:</h3>
            <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
              <li><em>The Nature of Managerial Work</em> (1973)</li>
              <li><em>The Rise and Fall of Strategic Planning</em> (1994)</li>
              <li><em>Strategy Safari</em> (1998, with Ahlstrand & Lampel)</li>
              <li><em>Managers Not MBAs</em> (2004)</li>
              <li><em>Rebalancing Society</em> (2015)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Core Ideas:</h3>
            <ol className="list-decimal list-inside space-y-2 text-foreground/90 ml-4">
              <li><strong>Management Is Practice.</strong> It blends art (imagination), science (analysis), and craft (experience).</li>
              <li><strong>Managerial Roles.</strong> Leaders perform interpersonal, informational, and decisional functions — continuously and intuitively.</li>
              <li><strong>Emergent Strategy.</strong> Real strategy grows from small decisions that form consistent patterns over time.</li>
              <li><strong>Community Before Corporation.</strong> Healthy societies balance the private, public, and plural sectors.</li>
              <li><strong>Education Through Reflection.</strong> Managers learn best from experience, not lectures.</li>
            </ol>
          </div>
        </section>

        {/* Selected Quotes Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Selected Quotes</h2>
          <div className="space-y-6">
            <blockquote className="pl-6 border-l-4 border-tma-blue text-lg italic text-foreground/90">
              "You cannot create a community with case studies."
            </blockquote>
            <blockquote className="pl-6 border-l-4 border-tma-blue text-lg italic text-foreground/90">
              "The best managers are not superheroes; they are curious people who care."
            </blockquote>
            <blockquote className="pl-6 border-l-4 border-tma-blue text-lg italic text-foreground/90">
              "We must stop separating leadership and management — they are parts of the same process."
            </blockquote>
            <blockquote className="pl-6 border-l-4 border-tma-blue text-lg italic text-foreground/90">
              "Strategy is not a plan; it's a pattern."
            </blockquote>
          </div>
        </section>

        {/* Honours Section */}
        <section className="mb-12 p-8 bg-gradient-to-br from-tma-teal/5 to-tma-blue/5 rounded-2xl border border-tma-teal/10">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Honours & Recognition</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
            <li>Cleghorn Professor of Management Studies, McGill University</li>
            <li>Officer of the Order of Canada and Légion d'honneur (France)</li>
            <li>Member of the Royal Society of Canada</li>
            <li>Ranked among the Top 10 most influential management thinkers by Thinkers50</li>
            <li>Co-founder of the International Master's Program for Managers (IMPM) promoting reflective learning across cultures</li>
          </ul>
        </section>

        {/* Legacy Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Legacy</h2>
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
            <p>
              Henry Mintzberg reminded the world that managers are not analysts or bureaucrats — they are practitioners of balance.
              He rebuilt respect for management as a humane craft requiring judgment, empathy, and improvisation.
              His call for "managing quietly, leading thoughtfully" has reshaped management education globally.
              Today, business schools, NGOs, and governments continue to use his frameworks to bridge analysis with reflection.
            </p>
            <p>
              He continues to write and teach from Montreal, challenging a new generation to slow down, listen, and think.
            </p>
          </div>
        </section>

        {/* Closing Reflection */}
        <section className="mb-12 p-8 bg-gradient-to-r from-tma-navy/10 to-tma-blue/10 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Closing Reflection</h2>
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
            <p>
              Henry Mintzberg once said that the best way to understand leadership is to watch people at work.
              He turned observation into insight, proving that management is not an abstract science but a living art.
            </p>
            <blockquote className="text-xl font-semibold italic text-center my-6">
              "True managers build connections; they don't just make decisions."
            </blockquote>
            <p>
              Through ECHOES, his wisdom reminds young leaders that the map of management is not drawn in theory — it is drawn every day, in practice.
            </p>
          </div>
        </section>

        {/* Navigation Footer */}
        <footer className="pt-8 border-t">
          <Link to="/voices/echoes">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to ECHOES Collection
            </Button>
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default HenryMintzbergPage;
