import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import mintzbergImage from "@/assets/echoes-symbolic-mintzberg.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const HenryMintzbergPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Henry Mintzberg – The Strategist Who Redefined Management as Practice | ECHOES | TMA</title>
        <meta name="description" content="Biography of Henry Mintzberg, the management scientist who observed real managers and redefined strategy as an emergent, lived process rather than rigid planning." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Henry Mintzberg — The Strategist Who Redefined Management as Practice
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={mintzbergImage} 
                alt="Symbolic representation of exploration and practice - a hand-drawn compass and map representing Henry Mintzberg's view of management as lived practice"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Management is, above all, a practice — where art, science, and craft meet."
              <span className="echoes-quote-attrib">— Henry Mintzberg (b. 1939)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Henry Mintzberg</li>
            <li><strong>Born:</strong> 2 September 1939, Montreal, Canada</li>
            <li><strong>Profession:</strong> Management scientist, author, professor of strategy and organization</li>
            <li><strong>Affiliation:</strong> McGill University (Montreal); MIT Sloan School of Management (PhD, 1973)</li>
            <li><strong>Major Works:</strong> <em>The Nature of Managerial Work</em> (1973), <em>The Rise and Fall of Strategic Planning</em> (1994), <em>Managers Not MBAs</em> (2004), <em>Strategy Safari</em> (1998)</li>
            <li><strong>Known For:</strong> Observing real managers, identifying ten managerial roles, redefining strategy as an emergent, lived process</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: McGill University Archives; MIT Thesis Database; Financial Times Top 50 Scholars.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Mintzberg grew up in Montreal, developing an early interest in how things work — from radios to organizations. After earning a mechanical engineering degree, he worked briefly for Canadian National Railways before pursuing his PhD at MIT's Sloan School of Management.
          </p>
          <p className="echoes-paragraph">
            His doctoral research involved shadowing five managers for several weeks, meticulously recording their activities. This direct observation revealed that managers don't spend their days planning and organizing; they react, negotiate, and adapt in real time.
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            In 1973, Mintzberg published <em>The Nature of Managerial Work</em>, challenging the traditional view of management as a rational, top-down process. He identified ten distinct roles that managers perform:
          </p>
          <ul className="echoes-list">
            <li><strong>Interpersonal:</strong> Figurehead, Leader, Liaison</li>
            <li><strong>Informational:</strong> Monitor, Disseminator, Spokesperson</li>
            <li><strong>Decisional:</strong> Entrepreneur, Disturbance Handler, Resource Allocator, Negotiator</li>
          </ul>
          <p className="echoes-paragraph">
            He argued that effective management is not about following a formula but about mastering these roles through experience and intuition.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Publications:</h3>
          <ul className="echoes-list">
            <li><em>The Nature of Managerial Work</em> (1973)</li>
            <li><em>The Structuring of Organizations</em> (1979)</li>
            <li><em>Mintzberg on Management</em> (1989)</li>
            <li><em>The Rise and Fall of Strategic Planning</em> (1994)</li>
            <li><em>Strategy Safari</em> (1998)</li>
            <li><em>Managers Not MBAs</em> (2004)</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas:</h3>
          <ol className="echoes-list list-decimal">
            <li><strong>Management is a Practice.</strong> It's about doing, not just planning.</li>
            <li><strong>Strategy Emerges.</strong> It's not always deliberate; it evolves from action.</li>
            <li><strong>Managers Wear Many Hats.</strong> They play diverse roles, often simultaneously.</li>
            <li><strong>Organizations are Communities.</strong> They thrive on collaboration, not just control.</li>
            <li><strong>MBAs Aren't Enough.</strong> Experience and reflection are essential for leadership.</li>
          </ol>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "Managing is a juggling act: balancing roles, relationships, and responsibilities."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Strategy is not a result of planning, but of intuition, insight, and serendipity."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The only truly effective organizations are communities of humans, not collections of functions."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "We need managers who can see the forest and the trees, not just the spreadsheets."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Professor of Management Studies, McGill University</li>
            <li>Fellow of the Royal Society of Canada</li>
            <li>Officer of the Order of Canada</li>
            <li>Multiple honorary degrees from universities worldwide</li>
            <li>Thinkers50 Lifetime Achievement Award (2015)</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Henry Mintzberg transformed management from a theoretical exercise into a human practice. He showed that leadership is not about imposing plans but about fostering creativity, collaboration, and continuous learning.
          </p>
          <p className="echoes-paragraph">
            His work inspired a generation of leaders to value experience over abstraction, action over analysis, and people over process.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Henry Mintzberg continues to teach, write, and challenge leaders worldwide from his base in Montreal. He believes that the future of management depends not on better theories, but on wiser practitioners.
          </p>
          <blockquote className="echoes-inline-quote">
            "The best managers are not those who know the answers, but those who ask the right questions."
          </blockquote>
          <p className="echoes-paragraph">
            Through <strong>ECHOES</strong>, his voice reminds young leaders that management is not a profession — it's a calling to serve, to learn, and to build communities of purpose.
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Henry Mintzberg — The Strategist Who Redefined Management as Practice"
              description="Biography of Henry Mintzberg, the management scientist who observed real managers and redefined strategy as an emergent, lived process rather than rigid planning."
            />
          </div>
        </section>

        {/* FOOTER NAVIGATION */}
        <footer className="echoes-footer-nav">
          <div className="echoes-next-link">
            <Link to="/voices/echoes">← Back to ECHOES Collection</Link>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default HenryMintzbergPage;
