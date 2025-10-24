import { Helmet } from "react-helmet-async";
import taylorSymbolic from "@/assets/echoes-symbolic-taylor.jpg";

const FrederickTaylorPage = () => {
  return (
    <div className="echoes-article">
      <Helmet>
        <title>ECHOES – Frederick Winslow Taylor | Teenagers Management Academy</title>
        <meta 
          name="description" 
          content="The life and legacy of Frederick Winslow Taylor (1856–1915), the engineer who measured work and shaped modern management, presented in the ECHOES series, The Messengers of Management." 
        />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Frederick Winslow Taylor — The Engineer Who Measured Work and Shaped Modern Management
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={taylorSymbolic} 
                alt="Symbolic visual representing Frederick Winslow Taylor's scientific management and precision measurement"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "In the past, man has been first; in the future, the system must be first."
              <span className="echoes-quote-attrib">— Frederick W. Taylor (1856–1915)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Frederick Winslow Taylor</li>
            <li><strong>Born:</strong> 20 March 1856, Philadelphia, Pennsylvania, USA</li>
            <li><strong>Died:</strong> 21 March 1915, Philadelphia, Pennsylvania (aged 59)</li>
            <li><strong>Profession:</strong> Mechanical engineer, efficiency pioneer, management theorist</li>
            <li><strong>Major Work:</strong> <em>The Principles of Scientific Management</em> (1911)</li>
            <li><strong>Field:</strong> Industrial engineering, operations management, organizational efficiency</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: Library of Congress archives; Britannica; Taylor Society Papers.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Taylor was born into a disciplined Quaker family in Philadelphia. His father was a lawyer; his mother an active social reformer. From childhood, he was fascinated by structure and order.
          </p>
          <p className="echoes-paragraph">
            He began as an apprentice patternmaker in a small machine shop, learning the mechanics of industry firsthand. Later, while working full-time, he earned an engineering degree from the Stevens Institute of Technology.
          </p>
          <p className="echoes-paragraph">
            Curious and analytical, Taylor asked a question that shaped his life:
          </p>
          <blockquote className="echoes-inline-quote">
            "Why does so much human effort go to waste?"
          </blockquote>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            At the Midvale Steel Company in the 1880s, Taylor began timing workers with a stopwatch to discover the most efficient way to perform each task.
          </p>
          <p className="echoes-paragraph">
            His approach shocked traditional managers but produced remarkable results. He argued that if work were measured and standardized scientifically, both productivity and wages could rise.
          </p>
          <p className="echoes-paragraph">
            At Bethlehem Steel, he developed specialized tools and task sequences that doubled output. In 1911 he published <em>The Principles of Scientific Management</em>, a small book that transformed industry by proposing that every job can be studied, measured, and improved scientifically rather than by habit.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Works</h3>
          <ul className="echoes-list">
            <li><em>Shop Management</em> (1903)</li>
            <li><em>The Principles of Scientific Management</em> (1911)</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas</h3>
          <ol className="echoes-list list-decimal">
            <li><strong>Science, Not Rule of Thumb</strong> – Base decisions on measurement and study.</li>
            <li><strong>Harmony, Not Discord</strong> – Promote cooperation between management and labor.</li>
            <li><strong>Maximum Output</strong> – Efficiency should increase both productivity and wages.</li>
            <li><strong>Division of Labor and Planning</strong> – Managers plan; workers execute.</li>
            <li><strong>Training and Standardization</strong> – Teach best methods through training, not trial and error.</li>
          </ol>

          <p className="echoes-paragraph">
            His system became known as <strong>Taylorism</strong>, the foundation of later methods such as Lean, Total Quality Management, and Six Sigma.
          </p>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "In the past, man has been first; in the future, the system must be first."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The principal object of management should be to secure the maximum prosperity for the employer, coupled with the maximum prosperity for each employee."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The best management is a true science, resting upon clearly defined laws, rules, and principles."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The real enemy of the worker is the inefficiency of the system."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <p className="echoes-paragraph">
            Though many labor leaders criticized his methods, Taylor's influence grew rapidly.
          </p>
          <p className="echoes-paragraph">
            He became President of the American Society of Mechanical Engineers (ASME) in 1906 and received global recognition for redefining industrial efficiency.
          </p>
          <p className="echoes-paragraph">
            By the 1910s, factories from the U.S. to Europe and Japan had adopted scientific management as the new model of progress.
          </p>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Taylor laid the foundation for modern management science.
          </p>
          <p className="echoes-paragraph">
            Every efficiency model, workflow analysis, and productivity metric stems from his original stopwatch studies.
          </p>
          <p className="echoes-paragraph">
            Later thinkers such as Elton Mayo and Peter Drucker built on his systems, bringing empathy and human values to the mechanical precision he pioneered.
          </p>
          <p className="echoes-paragraph">
            Taylor's life's question — "Can work itself be perfected?" — still echoes in every modern effort to balance efficiency with humanity.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Frederick Winslow Taylor died in 1915, just as the industrial age he had shaped was taking flight.
          </p>
          <p className="echoes-paragraph">
            He never saw the global influence of his ideas, yet his pursuit of precision changed how the world works.
          </p>
          <p className="echoes-paragraph">
            He believed progress begins with observation, discipline, and a better method.
          </p>
          <p className="echoes-paragraph">
            More than a century later, his stopwatch stands as a symbol — not of control, but of continual improvement.
          </p>
        </section>

        {/* FOOTER NAVIGATION */}
        <footer className="echoes-footer-nav">
          <div className="echoes-next-link">
            <a href="/voices/echoes">← Back to ECHOES</a>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default FrederickTaylorPage;
