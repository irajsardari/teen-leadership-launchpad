import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import kotterImage from "@/assets/echoes-symbolic-kotter.jpg";

const JohnKotterPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>John P. Kotter – The Architect of Change Leadership | ECHOES | TMA</title>
        <meta name="description" content="Biography of John P. Kotter, leadership scholar and author of Leading Change, who showed that change is not a plan but a journey." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              John P. Kotter — The Architect of Change Leadership
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={kotterImage} 
                alt="Symbolic representation of change and transformation - spiral staircase ascending"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Change is a process, not an event."
              <span className="echoes-quote-attrib">— John P. Kotter (b. 1947)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> John Paul Kotter</li>
            <li><strong>Born:</strong> 1947, San Diego, California, USA</li>
            <li><strong>Profession:</strong> Professor of Leadership, Author, Consultant</li>
            <li><strong>Affiliation:</strong> Harvard Business School</li>
            <li><strong>Major Works:</strong> <em>Leading Change</em> (1996), <em>The Heart of Change</em> (2002), <em>Accelerate</em> (2014)</li>
            <li><strong>Known For:</strong> The 8-Step Process for Leading Change</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: Harvard Business School Archives; Kotter International; Thinkers50.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Kotter grew up in California and studied electrical engineering at MIT before earning a PhD from Harvard Business School. His early research focused on how managers actually lead, not just how textbooks said they should.
          </p>
          <p className="echoes-paragraph">
            He was influenced by Abraham Zaleznik, who taught him that leadership is distinct from management — it's about inspiring people, not just controlling them.
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            After years of studying failed change initiatives, Kotter identified eight critical steps that separate success from failure. He published these in his bestselling book, <em>Leading Change</em> (1996), which became the playbook for leaders facing disruption.
          </p>
          <p className="echoes-paragraph">
            His 8-Step Process for Leading Change:
          </p>
          <ol className="echoes-list list-decimal">
            <li><strong>Create Urgency</strong> – Inspire people to move.</li>
            <li><strong>Build a Guiding Coalition</strong> – Get the right people in charge.</li>
            <li><strong>Form a Strategic Vision</strong> – Create a clear view of the future.</li>
            <li><strong>Enlist a Volunteer Army</strong> – Get buy-in and participation.</li>
            <li><strong>Enable Action</strong> – Remove barriers.</li>
            <li><strong>Generate Short-Term Wins</strong> – Celebrate progress.</li>
            <li><strong>Sustain Acceleration</strong> – Keep the momentum going.</li>
            <li><strong>Institute Change</strong> – Make it stick.</li>
          </ol>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Publications</h3>
          <ul className="echoes-list">
            <li><em>Leading Change</em> (1996)</li>
            <li><em>The Heart of Change</em> (2002, with Dan Cohen)</li>
            <li><em>Our Iceberg Is Melting</em> (2006, with Holger Rathgeber)</li>
            <li><em>Accelerate</em> (2014)</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas</h3>
          <ol className="echoes-list list-decimal">
            <li><strong>Change is Constant.</strong> Organizations must adapt to survive.</li>
            <li><strong>Leadership is Action, Not Position.</strong> Anyone can lead change.</li>
            <li><strong>Vision Drives Action.</strong> People need a clear picture of the future.</li>
            <li><strong>Communication is Key.</strong> Share the vision constantly.</li>
            <li><strong>Empowerment Unleashes Potential.</strong> Remove obstacles to progress.</li>
          </ol>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "Effective change requires a powerful guiding coalition."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The central issue is never strategy, structure, culture, or systems. The core of the matter is always about changing the behavior of people."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Create a sense of urgency around a significant opportunity."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "People change what they do less because they are given analysis that shifts their thinking than because they are shown a truth that influences their feelings."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Professor Emeritus at Harvard Business School</li>
            <li>Founder of Kotter International, a change-management consulting firm</li>
            <li>Thinkers50 Hall of Fame</li>
            <li>Numerous awards for his contributions to leadership and management</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            John Kotter gave leaders a roadmap for navigating change. He showed that change is not a project to be managed, but a journey to be led. His 8-Step Process has become a universal framework for organizations facing disruption.
          </p>
          <p className="echoes-paragraph">
            Every time a leader creates urgency, builds a coalition, or celebrates a short-term win, Kotter's influence is at work.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            John Kotter continues to teach and consult, urging leaders to embrace change as a constant opportunity. He reminds us that leadership is not about predicting the future, but preparing people for it.
          </p>
          <blockquote className="echoes-inline-quote">
            "The most effective organizations are the ones that can adapt quickly and effectively to change."
          </blockquote>
          <p className="echoes-paragraph">
            Through <strong>ECHOES</strong>, his voice reminds future leaders that change is not a threat, but a chance to build a better world.
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

export default JohnKotterPage;
