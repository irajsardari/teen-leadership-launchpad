import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import scheinImage from "@/assets/echoes-symbolic-schein.jpg";

const EdgarScheinPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Edgar H. Schein – The Architect of Organizational Culture | ECHOES | TMA</title>
        <meta name="description" content="Biography of Edgar H. Schein, the psychologist who revealed the three levels of organizational culture and pioneered the concept of humble inquiry in leadership." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Edgar H. Schein — The Architect of Organizational Culture
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={scheinImage} 
                alt="Symbolic representation of organizational culture - three concentric layers representing Edgar H. Schein's model of artifacts, values, and underlying assumptions"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Culture is not just one aspect of the game — it is the game."
              <span className="echoes-quote-attrib">— Edgar H. Schein (1928 – 2023)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Edgar Henry Schein</li>
            <li><strong>Born:</strong> 5 March 1928, Zurich, Switzerland</li>
            <li><strong>Died:</strong> 26 January 2023, Palo Alto, California (aged 94)</li>
            <li><strong>Profession:</strong> Psychologist, Professor of Management, Consultant</li>
            <li><strong>Affiliation:</strong> MIT Sloan School of Management (Professor Emeritus)</li>
            <li><strong>Major Works:</strong> <em>Organizational Culture and Leadership</em> (1985 → 2017 editions); <em>Process Consultation</em> series; <em>Humble Inquiry</em> (2013); <em>Humble Leadership</em> (2018)</li>
            <li><strong>Known For:</strong> The three-level model of organizational culture and the concept of "humble inquiry."</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: MIT Sloan Archives; Harvard Business Review; Academy of Management memorial collection.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Born in Zurich to a German father and Russian mother, Schein grew up in a multicultural home that sparked his lifelong interest in values and communication. He emigrated to the United States as a teenager, earning degrees in social psychology at the University of Chicago and Harvard.
          </p>
          <p className="echoes-paragraph">
            During his service in the U.S. Army in occupied Germany, he witnessed how culture shapes behavior — a lesson that later guided his theories about organizations as mini-societies.
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            In the 1950s and '60s, Schein joined MIT to study how people adapt to corporate life. He coined the term "organizational socialization" — how new employees absorb the values of their company. His research at Digital Equipment Corporation and other firms revealed that beneath every policy and procedure lies a set of invisible assumptions that govern behavior.
          </p>
          <p className="echoes-paragraph">
            This discovery led to his seminal book <em>Organizational Culture and Leadership</em> (1985), where he described three levels of culture:
          </p>
          <ol className="echoes-list list-decimal">
            <li><strong>Artifacts</strong> – visible structures, rituals, language</li>
            <li><strong>Espoused Values</strong> – what people say they believe</li>
            <li><strong>Underlying Assumptions</strong> – the deep, unquestioned beliefs that truly drive behavior</li>
          </ol>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Publications:</h3>
          <ul className="echoes-list">
            <li><em>Organizational Culture and Leadership</em> (1985–2017)</li>
            <li><em>Process Consultation</em> (1969, 1987, 1999)</li>
            <li><em>Career Anchors</em> (1990)</li>
            <li><em>Humble Inquiry</em> (2013)</li>
            <li><em>Humble Leadership</em> (2018, with Peter Schein)</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas:</h3>
          <ol className="echoes-list list-decimal">
            <li><strong>Culture Lives Below the Surface.</strong> To change behavior, leaders must understand hidden assumptions.</li>
            <li><strong>Leadership Creates and Manages Culture.</strong> Every decision a leader makes teaches values.</li>
            <li><strong>Process Consultation.</strong> Helping is a relationship of inquiry and respect, not expertise and control.</li>
            <li><strong>Humble Inquiry.</strong> The art of asking genuine questions that build trust and learning.</li>
            <li><strong>Psychological Safety.</strong> Organizations must create environments where people feel safe to speak honestly.</li>
          </ol>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "The only thing of real importance that leaders do is to create and manage culture."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "If you want to understand a culture, listen to its stories."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Humble Inquiry is the gentle art of drawing someone out by asking questions to which you do not already know the answer."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Learning starts with admitting that you don't already know."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Professor Emeritus, MIT Sloan School of Management</li>
            <li>Lifetime Achievement Award, Academy of Management (2009)</li>
            <li>Distinguished Scholar, Society for Industrial and Organizational Psychology</li>
            <li>Consultant to NASA, Digital Equipment Corp., and U.S. Department of Defense</li>
            <li>Founder of the Center for Organizational Learning with Peter Senge</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Edgar Schein taught the world that organizations are living cultures, not machines. His work on trust, learning, and helping laid the foundation for modern leadership development and psychological safety. He bridged psychology and management, showing that transformation begins with humility and conversation.
          </p>
          <p className="echoes-paragraph">
            Today, his son Peter Schein continues his legacy through the Humble Leadership Institute. Every time a leader asks not "What's wrong with you?" but "What am I not seeing?" — Schein's influence is alive.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Edgar Schein passed away in 2023, leaving behind a philosophy of leadership based on curiosity and respect. He believed that organizations grow only when people feel safe enough to learn.
          </p>
          <blockquote className="echoes-inline-quote">
            "To lead is to learn, and to learn is to listen."
          </blockquote>
          <p className="echoes-paragraph">
            Through ECHOES, his voice continues to remind young leaders that culture is not what you declare — it's what you practice every day.
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

export default EdgarScheinPage;
