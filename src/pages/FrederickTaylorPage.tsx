import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import taylorSymbolic from "@/assets/echoes-symbolic-taylor.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const FrederickTaylorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Frederick Winslow Taylor – The Engineer Who Measured Work and Shaped Modern Management | ECHOES | TMA</title>
        <meta name="description" content="Biography and legacy of Frederick Winslow Taylor, founder of Scientific Management who proved that work could be designed, not just endured." />
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
            <li><strong>Profession:</strong> Mechanical engineer, efficiency expert, management consultant</li>
            <li><strong>Major Works:</strong> <em>The Principles of Scientific Management</em> (1911), <em>Shop Management</em> (1903)</li>
            <li><strong>Known For:</strong> Founder of <strong>Scientific Management</strong> (Taylorism), standardizing work processes, systematic efficiency studies.</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: Britannica; Smithsonian Institution; Taylor's published works.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Born into a wealthy Philadelphia family, Taylor showed an early fascination with systems and precision. He studied patterns in play, measured results, and questioned inefficiencies from childhood.
          </p>
          <p className="echoes-paragraph">
            Although he passed Harvard's entrance exams, failing eyesight led him instead to an apprenticeship as a machinist. This turned out to be his turning point — he joined the working world not as an observer, but as a participant who saw waste everywhere.
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
          
          <h3 className="echoes-subheading">Key Publications:</h3>
          <ul className="echoes-list">
            <li><em>Shop Management</em> (1903) – Early practical studies in factory efficiency.</li>
            <li><em>The Principles of Scientific Management</em> (1911) – The manifesto of systematic work design.</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas:</h3>
          <ol className="echoes-list list-decimal">
            <li><strong>Science, Not Rule of Thumb</strong> — Replace guesswork with measurement.</li>
            <li><strong>Standardization</strong> — Identify the "one best way" and train everyone to follow it.</li>
            <li><strong>Selection and Training</strong> — Match workers to tasks scientifically and develop their skills systematically.</li>
            <li><strong>Cooperation, Not Conflict</strong> — Taylor believed that fair systems create trust between workers and managers.</li>
          </ol>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "There is no question that the cost of production is lowered by separating the work of planning and the brain work as much as possible from the manual labor."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "In the past the man has been first; in the future the system must be first."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The principal object of management should be to secure the maximum prosperity for the employer, coupled with the maximum prosperity for each employee."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>President of the American Society of Mechanical Engineers (ASME), 1906.</li>
            <li>Called to testify before the U.S. Congress on his management methods in 1912.</li>
            <li>Awarded honorary doctorates from the University of Pennsylvania (1906).</li>
            <li>His principles spread globally, influencing manufacturing from Detroit to Tokyo.</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Frederick Winslow Taylor changed the world by proving that work could be designed, not just endured. His methods fueled the productivity explosion of the 20th century — from Ford's assembly lines to lean manufacturing.
          </p>
          <p className="echoes-paragraph">
            Yet his legacy is complex. Critics accused his system of treating workers like machines. Supporters argue he gave labor the evidence needed to demand better wages.
          </p>
          <p className="echoes-paragraph">
            What remains clear is this: Taylor showed that management is not luck or tradition — it is a discipline that can be learned, tested, and improved.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Frederick Taylor passed away in 1915, but his voice echoes through every process chart, every efficiency study, every system designed to respect the value of time and effort.
          </p>
          <p className="echoes-paragraph">
            Through ECHOES, his message remains: <em>the work we do matters — and doing it right matters even more</em>.
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Frederick Winslow Taylor — The Engineer Who Measured Work and Shaped Modern Management"
              description="Biography and legacy of Frederick Winslow Taylor, founder of Scientific Management who proved that work could be designed, not just endured."
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

export default FrederickTaylorPage;
