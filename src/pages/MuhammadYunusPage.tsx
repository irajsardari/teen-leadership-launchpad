import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import yunusImage from "@/assets/echoes-symbolic-yunus.jpg";

const MuhammadYunusPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Muhammad Yunus — The Banker of Hope and Human Capital | ECHOES | TMA</title>
        <meta name="description" content="Biography of Muhammad Yunus, founder of Grameen Bank and pioneer of microfinance as a tool for human empowerment and dignity." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Muhammad Yunus — The Banker of Hope and Human Capital
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={yunusImage} 
                alt="A single growing seed emerging from a human palm made of coins — symbolizing finance as a force for human growth and social return"
                loading="eager"
              />
              <figcaption className="text-sm text-muted-foreground mt-3 italic text-center">
                A single growing seed emerging from a human palm made of coins — symbolizing finance as a force for human growth and social return.
              </figcaption>
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Poverty is not created by the poor. It is created by the system we built."
              <span className="echoes-quote-attrib">— Muhammad Yunus (b. 1940)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <p className="echoes-paragraph">
            Muhammad Yunus, a Bangladeshi economist, social entrepreneur, and founder of the Grameen Bank, redefined what finance can mean for humanity.
          </p>
          <p className="echoes-paragraph">
            At a time when banks saw the poor as "unbankable," Yunus saw potential capital in every person. He believed that finance should not only produce profit but also restore dignity, trust, and capability.
          </p>
          <p className="echoes-paragraph">
            Through his vision of microfinance, he proved that even the smallest loan can transform lives when paired with education and accountability. For him, money was never an end — it was a means to build confidence, entrepreneurship, and shared prosperity.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          <ul className="echoes-list">
            <li><strong>Microcredit & Social Business:</strong> Empowering the poor through small loans without collateral — turning credit into a human right.</li>
            <li><strong>Finance as Empowerment:</strong> Promoting the idea that every individual has entrepreneurial potential if given trust and tools.</li>
            <li><strong>Human Capital as the Real Asset:</strong> He redefined "return" not as interest but as impact — how many families rise from poverty.</li>
            <li><strong>Social Business Model:</strong> A new economic philosophy where companies serve people and planet while remaining financially sustainable.</li>
          </ul>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "We can remove poverty from the world only if we free our mind from the mindset that created it."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "When you lend money to the poor, they become entrepreneurs. When you give charity, they remain beggars."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The more you help others, the happier you become — that is the real return on investment."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Human beings are not born to suffer poverty; they are born with unlimited potential."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Nobel Peace Prize (2006) for "efforts to create economic and social development from below."</li>
            <li>Founder of Grameen Bank and the Yunus Centre.</li>
            <li>Recognized by Forbes and TIME as one of the world's most influential thinkers.</li>
            <li>Recipient of over 50 international honorary doctorates for his work in economic justice and human development.</li>
          </ul>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Muhammad Yunus reminds every future leader that finance is not merely about numbers — it is about nurturing trust.
          </p>
          <p className="echoes-paragraph">
            Through ECHOES, his voice continues to teach that the true measure of return is not profit alone, but the people who rise with you.
          </p>
          <p className="echoes-paragraph">
            His life calls TMA students to see economics as a tool for inclusion, compassion, and collective growth.
          </p>
          <p className="echoes-paragraph text-center italic mt-8">
            Curated by Dr. Iraj Sardari Baf
          </p>
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

export default MuhammadYunusPage;
