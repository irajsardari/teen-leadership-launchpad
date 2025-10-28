import { Helmet } from "react-helmet-async";
import buffettImage from "@/assets/echoes-symbolic-buffett.jpg";

const WarrenBuffettPage = () => {
  return (
    <div className="echoes-page">
      <Helmet>
        <title>Warren Buffett — The Philosopher of Value and Patience | ECHOES | TMA</title>
        <meta name="description" content="Biography of Warren Buffett, the Oracle of Omaha, who taught the world about value investing, patience, and ethical wealth creation through decades of discipline and wisdom." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      {/* Hero Section */}
      <section className="echoes-hero">
        <div className="echoes-hero-content">
          <p className="echoes-label">ECHOES — The Messengers of Management</p>
          <p className="echoes-subtitle">Warren Buffett — The Philosopher of Value and Patience</p>
          <h1>"Price is what you pay. Value is what you get."</h1>
          <p className="echoes-attribution">— Warren Edward Buffett (b. 1930)</p>
        </div>
      </section>

      {/* Visual Section */}
      <section className="echoes-visual">
        <img 
          src={buffettImage} 
          alt="An oak tree rising from a planted coin symbolizing growth of value through time and wisdom"
          className="echoes-image"
          loading="eager"
        />
        <p className="echoes-caption">
          An oak tree rising from a single planted coin, sunlight passing through its branches — symbolizing the growth of value through time and wisdom.
        </p>
      </section>

      {/* Main Content */}
      <main className="echoes-main">
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

        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-quote">
            "Someone is sitting in the shade today because someone planted a tree a long time ago."
          </blockquote>
          <blockquote className="echoes-quote">
            "The stock market is designed to transfer money from the active to the patient."
          </blockquote>
          <blockquote className="echoes-quote">
            "Risk comes from not knowing what you are doing."
          </blockquote>
          <blockquote className="echoes-quote">
            "It's better to hang out with people better than you. Pick associates whose behavior is better than yours and you'll drift in that direction."
          </blockquote>
          <blockquote className="echoes-quote">
            "The more you learn, the more you earn."
          </blockquote>
        </section>

        <section className="echoes-section">
          <h2 className="echoes-heading">Honors & Recognition</h2>
          <ul className="echoes-list">
            <li>CEO of Berkshire Hathaway, consistently among the world's most respected companies.</li>
            <li>Named among Time Magazine's 100 Most Influential People multiple times.</li>
            <li>Co-founder of The Giving Pledge, donating over 99% of his wealth to humanity.</li>
            <li>Received Presidential Medal of Freedom (2011) for philanthropic and ethical leadership.</li>
          </ul>
        </section>

        <section className="echoes-section">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Warren Buffett teaches that financial wisdom is built on patience, honesty, and long-term thinking.
            Through ECHOES, his message to future leaders is clear:
            True return is measured not by the money you earn, but by the trust you build and the legacy you leave.
            For TMA students, he embodies the calm power of delayed gratification — the strength to wait, observe, and grow.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="echoes-footer">
        <p className="echoes-curator">Curated by Dr. Iraj Sardari Baf</p>
      </footer>
    </div>
  );
};

export default WarrenBuffettPage;
