import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import kahnemanImage from "@/assets/echoes-symbolic-kahneman.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const DanielKahnemanPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Daniel Kahneman – The Psychologist Who Measured How the Mind Decides | ECHOES | TMA</title>
        <meta name="description" content="Biography of Daniel Kahneman, Nobel Prize-winning psychologist who revealed how cognitive biases shape decision-making and founded behavioral economics." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Daniel Kahneman — The Psychologist Who Measured How the Mind Decides
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={kahnemanImage} 
                alt="Symbolic representation of dual thinking systems - fast and slow"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Nothing in life is as important as you think it is while you are thinking about it."
              <span className="echoes-quote-attrib">— Daniel Kahneman (1934 – 2024)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Daniel Kahneman</li>
            <li><strong>Born:</strong> 5 March 1934, Tel Aviv, Israel</li>
            <li><strong>Died:</strong> 27 March 2024, New York, USA</li>
            <li><strong>Profession:</strong> Psychologist, economist, author</li>
            <li><strong>Affiliation:</strong> Princeton University | Hebrew University of Jerusalem | UC Berkeley</li>
            <li><strong>Major Works:</strong> <em>Thinking, Fast and Slow</em> (2011); Nobel Prize in Economic Sciences (2002 with Amos Tversky)</li>
            <li><strong>Known For:</strong> Behavioral Economics, Prospect Theory, Cognitive Bias research</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: Princeton University archives; Nobel Prize Foundation; The Behavioral Science Journal.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Kahneman was born in Tel Aviv and raised partly in France during World War II, where he experienced human behavior at its most irrational and resilient. He earned a psychology degree from the Hebrew University of Jerusalem and a PhD from UC Berkeley.
          </p>
          <p className="echoes-paragraph">
            During his military service in Israel, he worked on personnel selection and assessment — where he began noticing how biases and intuition shaped even expert judgment. That curiosity would define his life's work: <em>Why do smart people make predictable mistakes?</em>
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            In the late 1960s, Kahneman met Amos Tversky, a brilliant cognitive psychologist. Their partnership became legendary — a fusion of precision and imagination that produced a new science: <strong>Behavioral Economics</strong>.
          </p>
          <p className="echoes-paragraph">
            In 1979 they published <em>Prospect Theory</em>, proving that people do not make rational decisions; they fear losses more than they value gains, and their choices depend on how options are framed. Their research dismantled the classical view of humans as "rational actors" and changed economics forever.
          </p>
          <p className="echoes-paragraph">
            Decades later, Kahneman gathered their insights into <em>Thinking, Fast and Slow</em> (2011), explaining the two systems of thought:
          </p>
          <ul className="echoes-list">
            <li><strong>System 1:</strong> Fast, intuitive, automatic — our first reactions.</li>
            <li><strong>System 2:</strong> Slow, deliberate, analytical — our second thoughts.</li>
          </ul>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Publications</h3>
          <ul className="echoes-list">
            <li><em>Prospect Theory</em> (1979, with Tversky)</li>
            <li><em>Judgment under Uncertainty: Heuristics and Biases</em> (1982)</li>
            <li><em>Thinking, Fast and Slow</em> (2011)</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas</h3>
          <ol className="echoes-list list-decimal">
            <li><strong>Two Systems of Thinking:</strong> Fast intuition vs. slow reason.</li>
            <li><strong>Heuristics and Biases:</strong> Mental shortcuts that distort judgment.</li>
            <li><strong>Prospect Theory:</strong> People fear losses twice as much as they value gains.</li>
            <li><strong>Framing Effect:</strong> Decisions change based on presentation, not content.</li>
            <li><strong>Anchoring & Availability:</strong> We judge based on what comes easily to mind.</li>
          </ol>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "We are blind to our blindness. We have very little idea of how little we know."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Intuition is nothing more and nothing less than recognition."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "A reliable way to make people believe in falsehoods is frequent repetition."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "True intuitive expertise is learned from prolonged experience with good feedback."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Nobel Prize in Economic Sciences (2002)</li>
            <li>Presidential Medal of Freedom, USA (2013)</li>
            <li>Co-founder, Behavioral Insights Team in public policy</li>
            <li>Ranked among the most cited psychologists of all time</li>
            <li><em>Thinking, Fast and Slow</em> translated into 40+ languages</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Daniel Kahneman replaced the myth of the "rational manager" with the reality of the human thinker. His research gave birth to fields as diverse as behavioral finance, risk management, public policy, and decision science.
          </p>
          <p className="echoes-paragraph">
            Executives, judges, investors, and teachers now learn to slow down, challenge assumptions, and test their intuition. Every time a leader pauses and asks, <em>"Am I deciding or reacting?"</em> — Kahneman's voice is there.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Kahneman spent his life reminding us that wisdom begins in humility. He believed that by recognizing our mental shortcuts, we can build fairer systems, better leadership, and wiser societies.
          </p>
          <blockquote className="echoes-inline-quote">
            "We can be blind to the obvious, and we are also blind to our blindness."
          </blockquote>
          <p className="echoes-paragraph">
            Through <strong>ECHOES</strong>, his voice reminds young leaders that self-awareness is not only emotional — it is cognitive: the art of thinking about how we think.
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Daniel Kahneman — The Psychologist Who Measured How the Mind Decides"
              description="Biography of Daniel Kahneman, Nobel Prize-winning psychologist who revealed how cognitive biases shape decision-making and founded behavioral economics."
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

export default DanielKahnemanPage;
