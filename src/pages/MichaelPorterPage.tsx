import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import porterImage from "@/assets/echoes-symbolic-porter.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const MichaelPorterPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Michael E. Porter – The Strategist Who Taught the World How Competition Creates Value | ECHOES | TMA</title>
        <meta name="description" content="The biography and legacy of Michael E. Porter, Harvard economist and strategist who introduced the Five Forces Model and taught the world about competitive strategy and shared value." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Michael E. Porter — The Strategist Who Taught the World How Competition Creates Value
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={porterImage} 
                alt="Symbolic representation of Five Forces Model with pentagon and arrows representing competitive dynamics"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "The essence of strategy is choosing what not to do."
              <span className="echoes-quote-attrib">— Michael E. Porter (b. 1947)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Michael Eugene Porter</li>
            <li><strong>Born:</strong> 23 May 1947, Ann Arbor, Michigan, USA</li>
            <li><strong>Profession:</strong> Economist, strategist, professor of business administration</li>
            <li><strong>Affiliation:</strong> Harvard Business School (Professor since 1973)</li>
            <li><strong>Major Works:</strong> <em>Competitive Strategy</em> (1980), <em>Competitive Advantage</em> (1985), <em>The Competitive Advantage of Nations</em> (1990)</li>
            <li><strong>Known For:</strong> Five Forces Model, Value Chain Analysis, Cluster Theory, Shared Value Concept</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: Harvard Business School Archives; Harvard Institute for Strategy and Competitiveness; Fortune Magazine Thinkers list.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Porter studied aerospace engineering at Princeton University, then earned an MBA and PhD in business economics at Harvard. His analytical mind led him to ask a deceptively simple question:
          </p>
          <blockquote className="echoes-inline-quote">
            "Why do some industries and nations succeed while others struggle?"
          </blockquote>
          <p className="echoes-paragraph">
            In the 1970s, when management theory focused mostly on internal efficiency, Porter brought the rigor of economics into strategy — a discipline that had been largely intuitive until then.
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            In 1980, his book <em>Competitive Strategy</em> introduced the <strong>Five Forces Model</strong>, a framework that examined industry structure through:
          </p>
          <ol className="echoes-list list-decimal">
            <li>Threat of new entrants</li>
            <li>Bargaining power of suppliers</li>
            <li>Bargaining power of buyers</li>
            <li>Threat of substitute products or services</li>
            <li>Rivalry among existing competitors</li>
          </ol>
          <p className="echoes-paragraph">
            He proved that profitability depends less on luck and more on understanding these forces and positioning wisely within them.
          </p>
          <p className="echoes-paragraph">
            Five years later, in <em>Competitive Advantage</em> (1985), he introduced the <strong>Value Chain</strong> — a way to see every company as a system of interconnected activities that create and deliver value.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Publications:</h3>
          <ul className="echoes-list">
            <li><em>Competitive Strategy</em> (1980)</li>
            <li><em>Competitive Advantage</em> (1985)</li>
            <li><em>The Competitive Advantage of Nations</em> (1990)</li>
            <li><em>On Competition</em> (2008)</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas:</h3>
          <ol className="echoes-list list-decimal">
            <li><strong>Five Forces Analysis</strong> — understand industry structure to shape strategy.</li>
            <li><strong>Generic Strategies</strong> — choose one: cost leadership, differentiation, or focus.</li>
            <li><strong>Value Chain</strong> — analyze activities to find where value is created or lost.</li>
            <li><strong>Clusters & National Competitiveness</strong> — regions thrive when businesses and institutions co-evolve.</li>
            <li><strong>Shared Value</strong> — economic success and social progress can reinforce each other.</li>
          </ol>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "Sound strategy starts with having the right goal."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Strategy is about making choices, trade-offs; it's about deliberately choosing to be different."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The purpose of business is to create value — for customers, for employees, and for society."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Bishop William Lawrence University Professor, Harvard Business School</li>
            <li>Founder, Institute for Strategy and Competitiveness, Harvard (2001)</li>
            <li>Advisor to World Economic Forum, U.S. Council on Competitiveness, and numerous governments</li>
            <li>Thinkers50 Lifetime Achievement Award (2019)</li>
            <li>Honorary degrees from over 20 universities worldwide</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Michael Porter turned strategy into an analytic discipline — linking economics, policy, and management into a single language of value creation. His frameworks are taught in every business school and used by executives across industries.
          </p>
          <p className="echoes-paragraph">
            Beyond corporate boardrooms, his concept of shared value inspired a generation of leaders to build companies that compete by solving social problems — not causing them.
          </p>
          <p className="echoes-paragraph">
            Every time a leader asks, "Where do we create value, and why does it matter?" — Porter's thinking is alive.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Michael Porter continues to teach at Harvard, advising businesses and governments on competitiveness and social impact. He believes that strategy is not a battle plan but a moral choice about how we serve society.
          </p>
          <blockquote className="echoes-inline-quote">
            "The real purpose of business is to solve problems profitably — not to profit from problems."
          </blockquote>
          <p className="echoes-paragraph">
            Through ECHOES, his voice reminds young leaders that competition is not about defeating others but about designing better ways to create value for all.
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Michael E. Porter — The Strategist Who Taught the World How Competition Creates Value"
              description="The biography and legacy of Michael E. Porter, Harvard economist and strategist who introduced the Five Forces Model and taught the world about competitive strategy and shared value."
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

export default MichaelPorterPage;
