import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import buffettImage from "@/assets/echoes-symbolic-buffett.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const WarrenBuffettPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ECHOES – Warren Buffett | Teenagers Management Academy</title>
        <meta name="description" content="Biography of Warren Buffett, the Oracle of Omaha, who taught the world about value investing, patience, and ethical wealth creation through decades of discipline and wisdom." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Warren Buffett — The Philosopher of Value and Patience
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={buffettImage} 
                alt="An oak tree rising from a planted coin symbolizing growth of value through time and wisdom"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Price is what you pay. Value is what you get."
              <span className="echoes-quote-attrib">— Warren Edward Buffett (b. 1930)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <p className="echoes-paragraph">
            Known worldwide as the Oracle of Omaha, Warren Buffett is more than an investor — he is a teacher of discipline, simplicity, and ethical wealth.
            Born in 1930 in Nebraska, he bought his first stock at age 11 and filed his first tax return at 13.
            From that curiosity grew one of the most remarkable financial minds in history.
          </p>
          <p className="echoes-paragraph">
            As chairman of Berkshire Hathaway, Buffett transformed a struggling textile firm into a multinational holding company by applying one unshakable rule:
          </p>
          <blockquote className="echoes-inline-quote">
            "Never lose money. Rule No. 1. Never forget Rule No. 1."
          </blockquote>
          <p className="echoes-paragraph">
            His genius lies not in predicting markets but in understanding people, patience, and value.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          <ul className="echoes-list">
            <li><strong>Value Investing:</strong> Influenced by Benjamin Graham, Buffett searches for businesses whose true worth exceeds their market price.</li>
            <li><strong>The Power of Compounding:</strong> Demonstrated how small, consistent returns create exponential growth over decades.</li>
            <li><strong>Long-Term Discipline:</strong> "Our favorite holding period is forever."</li>
            <li><strong>Circle of Competence:</strong> Focus only on what you understand deeply — wisdom through clarity, not complexity.</li>
            <li><strong>Ethical Capitalism:</strong> Advocated honesty, humility, and purpose in wealth creation.</li>
            <li><strong>Philanthropy as Return:</strong> Through The Giving Pledge, he redefined success as the ability to give back.</li>
          </ul>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">A Voice of Reflection</h2>
          <blockquote className="echoes-inline-quote">
            "Someone is sitting in the shade today because someone planted a tree a long time ago."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The stock market is designed to transfer money from the active to the patient."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Risk comes from not knowing what you are doing."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "It's better to hang out with people better than you. Pick associates whose behavior is better than yours and you'll drift in that direction."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The more you learn, the more you earn."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours and Recognition</h2>
          <ul className="echoes-list">
            <li>CEO of Berkshire Hathaway, consistently among the world's most respected companies.</li>
            <li>Named among Time Magazine's 100 Most Influential People multiple times.</li>
            <li>Co-founder of The Giving Pledge, donating over 99% of his wealth to humanity.</li>
            <li>Received Presidential Medal of Freedom (2011) for philanthropic and ethical leadership.</li>
          </ul>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Warren Buffett teaches that financial wisdom is built on patience, honesty, and long-term thinking.
            Through ECHOES, his message to future leaders is clear:
            True return is measured not by the money you earn, but by the trust you build and the legacy you leave.
            For TMA students, he embodies the calm power of delayed gratification — the strength to wait, observe, and grow.
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Warren Buffett — The Philosopher of Value and Patience"
              description="Biography of Warren Buffett, the Oracle of Omaha, who taught the world about value investing, patience, and ethical wealth creation through decades of discipline and wisdom."
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

export default WarrenBuffettPage;
