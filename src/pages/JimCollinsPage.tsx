import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import collinsImage from "@/assets/echoes-symbolic-collins.jpg";

const JimCollinsPage = () => {
  return (
    <article className="echoes-article">
      <Helmet>
        <title>Jim Collins – The Researcher Who Turned Data into the DNA of Greatness | ECHOES | TMA</title>
        <meta name="description" content="The biography and legacy of Jim Collins, researcher and author of Good to Great, who revealed the disciplines that separate enduring excellence from mediocrity." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      {/* Hero Section */}
      <section className="echoes-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="echoes-badge">
              The Messengers of Management
            </Badge>
            <h1 className="echoes-title">
              ECHOES
            </h1>
            <div className="echoes-subtitle">
              Jim Collins — The Researcher Who Turned Data into the DNA of Greatness
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Opening Quote */}
          <div className="echoes-quote-block">
            <blockquote className="echoes-quote">
              "Greatness is not a function of circumstance. Greatness, it turns out, is largely a matter of conscious choice."
            </blockquote>
            <p className="echoes-quote-attribution">
              — Jim Collins
            </p>
          </div>

          {/* Symbolic Image */}
          <div className="echoes-image-container">
            <img 
              src={collinsImage} 
              alt="Symbolic representation of Jim Collins' research methodology"
              className="echoes-image"
              loading="lazy"
              decoding="async"
            />
            <p className="text-center text-sm text-muted-foreground mt-4 italic">
              A symbolic representation of rigorous research turning data into timeless principles of greatness.
            </p>
          </div>

          {/* Snapshot Section */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Snapshot</h2>
            <p className="echoes-paragraph">
              <strong>Jim Collins</strong> is an American researcher and author whose rigorous studies revealed what separates good companies from truly great ones. Through decades of data-driven research, he identified the disciplines, leadership qualities, and cultural patterns that enable organizations to achieve sustained excellence.
            </p>
            <p className="echoes-paragraph">
              His work transformed management thinking by proving that greatness is not about luck, charisma, or circumstance — it's about disciplined people, disciplined thought, and disciplined action.
            </p>
          </section>

          {/* Early Life & Influences */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Early Life & Influences</h2>
            <p className="echoes-paragraph">
              Born in Boulder, Colorado, Collins studied mathematical sciences at Stanford University before earning his MBA from Stanford Graduate School of Business. He began his career teaching at Stanford's business school, where he developed his passion for understanding what makes organizations endure and excel.
            </p>
            <p className="echoes-paragraph">
              Early in his academic career, Collins became fascinated by a simple question: <em>Why do some companies make the leap from good to great while others don't?</em> This question would drive his research for decades.
            </p>
          </section>

          {/* Turning Point */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Turning Point</h2>
            <p className="echoes-paragraph">
              In the mid-1990s, Collins assembled a research team to conduct a five-year study examining companies that had made the transition from good performance to great performance — and sustained it for at least fifteen years.
            </p>
            <p className="echoes-paragraph">
              The team analyzed 1,435 companies, identifying just 11 that met their strict criteria. What they discovered challenged conventional wisdom about leadership, strategy, and organizational success.
            </p>
            <p className="echoes-paragraph">
              This research became <strong>Good to Great</strong> (2001), one of the most influential business books ever written, selling over 4 million copies and fundamentally changing how leaders think about building enduring organizations.
            </p>
          </section>

          {/* Major Works & Signature Ideas */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
            
            <h3 className="echoes-subheading">Key Publications:</h3>
            <ul className="echoes-list">
              <li><strong>Built to Last</strong> (1994, with Jerry Porras) — Examined visionary companies that thrived for generations.</li>
              <li><strong>Good to Great</strong> (2001) — Revealed the disciplines that transform good companies into great ones.</li>
              <li><strong>How the Mighty Fall</strong> (2009) — Analyzed the stages of organizational decline.</li>
              <li><strong>Great by Choice</strong> (2011, with Morten Hansen) — Studied how companies thrive in chaos and uncertainty.</li>
              <li><strong>Beyond Entrepreneurship 2.0</strong> (2020) — A practical guide for building an enduring great company.</li>
            </ul>

            <h3 className="echoes-subheading">Core Concepts:</h3>
            <ul className="echoes-list">
              <li><strong>Level 5 Leadership</strong> — Great leaders combine personal humility with professional will.</li>
              <li><strong>First Who, Then What</strong> — Get the right people on the bus before deciding where to drive it.</li>
              <li><strong>The Hedgehog Concept</strong> — Focus on what you can be best at, what drives your economic engine, and what you're deeply passionate about.</li>
              <li><strong>Culture of Discipline</strong> — Freedom and responsibility within a framework of disciplined action.</li>
              <li><strong>The Flywheel Effect</strong> — Sustained success comes from consistent effort in a coherent direction, not dramatic breakthroughs.</li>
              <li><strong>Confronting the Brutal Facts</strong> — Face reality while maintaining unwavering faith that you will prevail.</li>
            </ul>
          </section>

          {/* Selected Quotes */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Selected Quotes</h2>
            <div className="echoes-quote-list">
              <blockquote className="echoes-inline-quote">
                "Good is the enemy of great. And that is one of the key reasons why we have so little that becomes great."
              </blockquote>
              <blockquote className="echoes-inline-quote">
                "Level 5 leaders channel their ego needs away from themselves and into the larger goal of building a great company."
              </blockquote>
              <blockquote className="echoes-inline-quote">
                "The signature of mediocrity is not an unwillingness to change. The signature of mediocrity is chronic inconsistency."
              </blockquote>
              <blockquote className="echoes-inline-quote">
                "Greatness is not primarily a matter of circumstance; greatness is first and foremost a matter of conscious choice and discipline."
              </blockquote>
            </div>
          </section>

          {/* Honours & Recognition */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Honours & Recognition</h2>
            <ul className="echoes-list">
              <li>Author of six books that have sold over 10 million copies worldwide.</li>
              <li><em>Good to Great</em> named one of the best business books of all time by multiple publications.</li>
              <li>Distinguished Teaching Award from Stanford Graduate School of Business.</li>
              <li>Founder of a management research laboratory in Boulder, Colorado, where he continues his research.</li>
              <li>Advisor to leaders in business, education, healthcare, government, and social sectors.</li>
            </ul>
          </section>

          {/* Legacy */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Legacy</h2>
            <p className="echoes-paragraph">
              Jim Collins transformed management thinking by proving that excellence is not about genius, luck, or dramatic transformation — it's about disciplined consistency over time.
            </p>
            <p className="echoes-paragraph">
              His research methodology set a new standard for business scholarship, combining rigorous data analysis with accessible storytelling. He showed that the principles of greatness apply not just to corporations, but to schools, hospitals, nonprofits, and even individual lives.
            </p>
            <p className="echoes-paragraph">
              For young leaders, Collins offers a powerful message: <em>greatness is a choice available to anyone willing to embrace discipline, confront reality, and persist with unwavering faith</em>.
            </p>
          </section>

          {/* Closing Reflection */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Closing Reflection</h2>
            <p className="echoes-paragraph">
              Jim Collins continues to research and write, driven by the same question that launched his career: <em>What does it take to build something that lasts?</em>
            </p>
            <p className="echoes-paragraph">
              Through ECHOES, his voice reminds every future leader that greatness is not reserved for the lucky few — it's available to anyone willing to do the disciplined work of turning good into great, one decision at a time.
            </p>
          </section>

        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="echoes-footer-nav">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="echoes-next-link">
            <a href="/voices/echoes">← Back to ECHOES Collection</a>
          </div>
        </div>
      </footer>
    </article>
  );
};

export default JimCollinsPage;
