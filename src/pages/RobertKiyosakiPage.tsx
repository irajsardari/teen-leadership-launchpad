import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import kiyosakiImage from "@/assets/echoes-symbolic-kiyosaki.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const RobertKiyosakiPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ECHOES – Robert Kiyosaki | Teenagers Management Academy</title>
        <meta name="description" content="Biography of Robert Kiyosaki, entrepreneur and author of Rich Dad Poor Dad, who transformed financial education and taught millions how to build wealth through financial literacy." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Robert Kiyosaki — The Teacher Who Made Money a Language for Everyone
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={kiyosakiImage} 
                alt="Two open notebooks titled Assets and Liabilities symbolizing financial clarity and understanding"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "It's not how much money you make. It's how much money you keep, how hard it works for you, and how many generations you keep it for."
              <span className="echoes-quote-attrib">— Robert Kiyosaki (b. 1947)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <p className="echoes-paragraph">
            Robert Kiyosaki is an American entrepreneur, investor, and educator whose landmark book <em>Rich Dad Poor Dad</em> transformed the way millions think about money.
            At a time when schools rarely taught financial literacy, Kiyosaki challenged the system by asking a simple question:
          </p>
          <blockquote className="echoes-inline-quote">
            "Why do we teach people to work for money, but not how money works?"
          </blockquote>
          <p className="echoes-paragraph">
            Through stories from his "Rich Dad," he simplified complex financial ideas—assets, liabilities, cashflow, and passive income—turning them into life lessons.
            His message to the world: financial freedom begins in the mind long before it appears in the bank account.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          <ul className="echoes-list">
            <li><strong>Financial Education for All:</strong> Advocating that money management is a life skill, not a luxury.</li>
            <li><strong>Assets vs. Liabilities:</strong> Teaching that true wealth is built by acquiring income-producing assets.</li>
            <li><strong>Cashflow Quadrant:</strong> Explaining the four ways people earn—Employee, Self-Employed, Business Owner, Investor—and how freedom grows across them.</li>
            <li><strong>Money Mindset:</strong> Reframing fear of failure as the tuition of experience; learning through doing.</li>
            <li><strong>Financial Independence as Leadership:</strong> Linking money mastery to self-reliance and responsible decision-making.</li>
          </ul>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">A Voice of Reflection</h2>
          <blockquote className="echoes-inline-quote">
            "The most successful people are the ones who ask questions. They're always learning."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Don't let the fear of losing be greater than the excitement of winning."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "It's not the money you earn that makes you rich—it's the knowledge you gain."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Your mind is your greatest asset. Invest in it before anything else."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours and Recognition</h2>
          <ul className="echoes-list">
            <li>Author of <em>Rich Dad Poor Dad</em>, translated into more than 50 languages, with 40 million + copies sold worldwide.</li>
            <li>Creator of the CASHFLOW Board Game used in schools and training programs to teach financial literacy.</li>
            <li>Recognized globally for promoting entrepreneurship, investment education, and financial independence.</li>
          </ul>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Robert Kiyosaki reminds every young learner that understanding money is not greed—it's responsibility.
            Through ECHOES, his voice encourages TMA students to manage their finances with awareness, courage, and creativity.
            He teaches that leadership starts when you take ownership of your own financial future—and then help others do the same.
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Robert Kiyosaki — The Teacher Who Made Money a Language for Everyone"
              description="Biography of Robert Kiyosaki, entrepreneur and author of Rich Dad Poor Dad, who transformed financial education and taught millions how to build wealth through financial literacy."
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

export default RobertKiyosakiPage;
