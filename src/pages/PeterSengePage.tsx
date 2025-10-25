import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import sengeImage from "@/assets/echoes-symbolic-senge.jpg";

const PeterSengePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Peter M. Senge – The Visionary Who Taught the World to Think in Systems | ECHOES | TMA</title>
        <meta name="description" content="The biography and legacy of Peter M. Senge, systems scientist and author of The Fifth Discipline, who introduced the world to learning organizations and systems thinking." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Peter M. Senge — The Visionary Who Taught the World to Think in Systems
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={sengeImage} 
                alt="Symbolic representation of systems thinking with interconnected circles and feedback loops"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Today's problems come from yesterday's solutions."
              <span className="echoes-quote-attrib">— Peter M. Senge (b. 1947)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Peter Michael Senge</li>
            <li><strong>Born:</strong> 1947, Stanford, California, USA</li>
            <li><strong>Profession:</strong> Systems scientist, organizational theorist, educator</li>
            <li><strong>Affiliation:</strong> MIT Sloan School of Management (Senior Lecturer); Founder, Society for Organizational Learning (SoL)</li>
            <li><strong>Major Work:</strong> <em>The Fifth Discipline: The Art and Practice of the Learning Organization</em> (1990)</li>
            <li><strong>Known For:</strong> Systems Thinking, Learning Organizations, Shared Vision, and Collective Intelligence</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: MIT Sloan Archives; Harvard Business Review; Society for Organizational Learning records.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Peter Senge grew up in California during the age of scientific optimism and social change. He studied engineering at Stanford University, systems dynamics at MIT, and philosophy at Harvard — blending logic with curiosity about human behavior.
          </p>
          <p className="echoes-paragraph">
            In the 1970s, under mentor Jay Forrester, founder of system dynamics, Senge learned to model complex feedback loops in industrial and social systems. But he soon realized that the same patterns that govern machines also shape human organizations. He began asking:
          </p>
          <blockquote className="echoes-inline-quote">
            "Why do well-intentioned organizations fail to learn?"
          </blockquote>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            Senge's breakthrough came with the 1990 publication of <em>The Fifth Discipline</em>, which introduced the idea of the <strong>Learning Organization</strong> — a place where people continually expand their capacity to create desired results, nurture new thinking patterns, and learn together.
          </p>
          <p className="echoes-paragraph">
            He called <strong>systems thinking</strong> the fifth discipline, uniting the other four into a coherent whole:
          </p>
          <ol className="echoes-list list-decimal">
            <li><strong>Personal Mastery</strong> – growth of individual purpose and capability</li>
            <li><strong>Mental Models</strong> – awareness of ingrained assumptions</li>
            <li><strong>Shared Vision</strong> – collective purpose that inspires</li>
            <li><strong>Team Learning</strong> – dialogue that turns insight into action</li>
            <li><strong>Systems Thinking</strong> – understanding interdependence and feedback</li>
          </ol>
          <p className="echoes-paragraph">
            The book became an international bestseller, translated into more than 30 languages, and reshaped leadership development worldwide.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Publications:</h3>
          <ul className="echoes-list">
            <li><em>The Fifth Discipline</em> (1990)</li>
            <li><em>The Fifth Discipline Fieldbook</em> (1994, with Kleiner et al.)</li>
            <li><em>Presence</em> (2004, with Jaworski, Scharmer & Flowers)</li>
            <li><em>The Necessary Revolution</em> (2008)</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas:</h3>
          <ol className="echoes-list list-decimal">
            <li><strong>Systems Thinking</strong> – every action creates feedback; seeing the whole prevents blame and fragmentation.</li>
            <li><strong>Learning Organization</strong> – organizations survive by learning faster than their environment changes.</li>
            <li><strong>Shared Vision</strong> – purpose must be co-created, not imposed.</li>
            <li><strong>Personal Mastery</strong> – leadership begins with self-discipline and continual growth.</li>
            <li><strong>Interconnected World</strong> – business, ecology, and society form one living system.</li>
          </ol>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "The only sustainable competitive advantage is your organization's ability to learn faster than the competition."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Systems thinking is a discipline for seeing wholes — for seeing patterns of change rather than static snapshots."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "People don't resist change; they resist being changed."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Learning is not compulsory… neither is survival."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Senior Lecturer, MIT Sloan School of Management</li>
            <li>Founder, Society for Organizational Learning (SoL), now global in 35+ countries</li>
            <li>Thinkers50 Lifetime Achievement Award (2015)</li>
            <li>Advisor to UN Global Compact, World Bank, and numerous corporations on sustainability and learning</li>
            <li>Recognized among the Top Management Thinkers of the 20th Century by Financial Times</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Peter Senge changed the vocabulary of leadership. He shifted focus from control to connection, from blame to feedback, from competition to collaboration. His learning organization model became the foundation for modern leadership development, sustainability strategies, and educational reform.
          </p>
          <p className="echoes-paragraph">
            In classrooms, boardrooms, and NGOs worldwide, his influence encourages reflection, dialogue, and systems awareness. Every time a leader asks, "What are the patterns behind this problem?" — Senge's spirit is present.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Peter Senge continues to teach and write from MIT, reminding the world that genuine progress requires learning at every level. He believes that the greatest revolution of our time is internal — a shift from reactive thinking to systemic awareness.
          </p>
          <blockquote className="echoes-inline-quote">
            "We can only transform the world if we first transform how we see it."
          </blockquote>
          <p className="echoes-paragraph">
            Through ECHOES, his voice guides future leaders to look beyond symptoms, trace connections, and act with wisdom.
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

export default PeterSengePage;
