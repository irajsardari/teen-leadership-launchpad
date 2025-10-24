import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import mayoSymbolic from "@/assets/echoes-symbolic-mayo.jpg";

const EltonMayoPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ECHOES – Elton Mayo | Teenagers Management Academy</title>
        <meta 
          name="description" 
          content="The life and legacy of Elton Mayo (1880–1949) – the listener who brought humanity to the workplace – presented in the ECHOES series, The Messengers of Management." 
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
              Elton Mayo — The Listener Who Brought Humanity to the Workplace
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={mayoSymbolic} 
                alt="Symbolic visual representing human connection and empathy in the workplace"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "One friend, one person who is truly understanding, who takes the trouble to listen to us as we consider our problems, can change our whole outlook on life."
              <span className="echoes-quote-attrib">— Elton Mayo (1880–1949)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> George Elton Mayo</li>
            <li><strong>Born:</strong> 26 December 1880, Adelaide, South Australia</li>
            <li><strong>Died:</strong> 7 September 1949, Guildford, Surrey, England (aged 68)</li>
            <li><strong>Profession:</strong> Psychologist, Sociologist, Organizational Theorist</li>
            <li><strong>Major Work:</strong> <em>The Human Problems of an Industrial Civilization</em> (1933)</li>
            <li><strong>Known For:</strong> The Hawthorne Studies and the Human Relations Movement</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: Harvard Business School Archives; Britannica; Australian Dictionary of Biography.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Elton Mayo was born in Adelaide, Australia, to a civil-servant father and a literary mother. Though initially trained in philosophy and medicine, he became fascinated with the psychology of work — why some people thrived in factories while others broke down under pressure.
          </p>
          <p className="echoes-paragraph">
            In 1911, he joined the University of Queensland, where his lectures blended psychology, ethics, and industry. His early research explored fatigue and mental health in repetitive work, at a time when industry saw workers merely as extensions of machines.
          </p>
          <p className="echoes-paragraph">
            This blend of science and compassion would define his entire career.
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            In 1926, Mayo joined Harvard Business School as a professor of industrial research. Two years later, the Western Electric Hawthorne Works near Chicago invited him to study how lighting affected productivity.
          </p>
          <p className="echoes-paragraph">
            What Mayo discovered was revolutionary:
          </p>
          <p className="echoes-paragraph">
            <strong>When workers felt observed, valued, and part of a social group, their performance improved — regardless of lighting conditions.</strong>
          </p>
          <p className="echoes-paragraph">
            This phenomenon, later called the <strong>Hawthorne Effect</strong>, revealed that human attention and social bonds were more powerful than mechanical conditions.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Publications</h3>
          <ul className="echoes-list">
            <li><em>The Human Problems of an Industrial Civilization</em> (1933)</li>
            <li><em>The Social Problems of an Industrial Civilization</em> (1945)</li>
            <li><em>The Political Problem of Industrial Civilization</em> (1947)</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas</h3>
          <ol className="echoes-list">
            <li><strong>Human Relations Matter More Than Conditions.</strong> Productivity depends on morale, recognition, and belonging.</li>
            <li><strong>Informal Groups Influence Behavior.</strong> Social networks shape motivation more than formal authority.</li>
            <li><strong>Communication Builds Trust.</strong> Listening is the foundation of leadership.</li>
            <li><strong>Management as Counseling.</strong> Leaders must understand emotions, not just enforce rules.</li>
            <li><strong>Work as Community.</strong> The factory is a social system, not just a technical one.</li>
          </ol>
          <p className="echoes-paragraph">
            Mayo thus shifted management from stopwatch to sympathy — from control to connection.
          </p>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "Human cooperation is based on a common understanding of the situation."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The desire for continuous and intimate association with others is a fundamental human need."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Listening to workers is not weakness — it is the essence of leadership."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Appointed Professor of Industrial Research, Harvard University (1926–1947)</li>
            <li>Consultant to Western Electric Company and Rockefeller Foundation</li>
            <li>Awarded the James McKeen Cattell Gold Medal for contributions to applied psychology</li>
            <li>Recognized posthumously as one of the founders of organizational behavior and human resource management</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Elton Mayo transformed management science by giving it a heart. He showed that human beings seek recognition, friendship, and purpose more deeply than financial rewards.
          </p>
          <p className="echoes-paragraph">
            His students carried his influence worldwide, integrating psychology into business education and leadership training. Modern HR, employee engagement, and even counseling practices in workplaces all trace their roots to Mayo's ideas.
          </p>
          <p className="echoes-paragraph">
            He once wrote that the failure of modern civilization was "to think of men in terms of money rather than in terms of humanity." That insight remains timeless.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Elton Mayo died in 1949, but his message still echoes:
          </p>
          <p className="echoes-paragraph">
            <strong>"When you listen, you heal."</strong>
          </p>
          <p className="echoes-paragraph">
            Every team that values empathy over ego continues his quiet revolution. He did not build machines; he built understanding. Through his voice, management became not just a science — but a conversation.
          </p>
        </section>

        {/* FOOTER NAVIGATION */}
        <footer className="echoes-footer-nav">
          <div className="echoes-next-link">
            <Link to="/voices/echoes">← Back to ECHOES</Link>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default EltonMayoPage;
