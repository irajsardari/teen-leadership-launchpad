import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import mayoSymbolic from "@/assets/echoes-symbolic-mayo.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const EltonMayoPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Elton Mayo – The Listener Who Brought Humanity to the Workplace | ECHOES | TMA</title>
        <meta name="description" content="Biography and legacy of Elton Mayo, the psychologist who proved that workers respond to attention, respect, and connection through the Hawthorne Studies." />
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
            <li><strong>Profession:</strong> Psychologist, industrial researcher, professor at Harvard Business School</li>
            <li><strong>Major Works:</strong> <em>The Human Problems of an Industrial Civilization</em> (1933), <em>The Social Problems of an Industrial Civilization</em> (1945)</li>
            <li><strong>Known For:</strong> The Hawthorne Studies; founding the <strong>Human Relations Movement</strong>; proving that workers respond to attention, respect, and social connection.</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: Harvard Business School Archives; Britannica; Mayo's published works.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Born in Adelaide, Australia, Elton Mayo studied medicine and philosophy before finding his true calling in psychology. After teaching at the University of Queensland, he moved to the United States, where his work on industrial fatigue and morale began to gain attention.
          </p>
          <p className="echoes-paragraph">
            Mayo believed that many workplace problems stemmed not from laziness, but from isolation, stress, and a lack of meaningful connection. He was deeply influenced by the writings of Émile Durkheim on social solidarity and Sigmund Freud on the inner life of individuals.
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            From 1924 to 1932, Mayo led a series of groundbreaking studies at the Western Electric Hawthorne Works in Chicago. What began as experiments on lighting and productivity turned into something far more profound.
          </p>
          <p className="echoes-paragraph">
            Mayo and his team discovered that workers' output increased not because of better conditions, but because <strong>they were being listened to</strong>. When managers showed interest in workers' opinions, morale improved. When small groups developed strong social bonds, performance rose.
          </p>
          <p className="echoes-paragraph">
            This became known as the <strong>Hawthorne Effect</strong>: people perform better when they know someone cares.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Publications:</h3>
          <ul className="echoes-list">
            <li><em>The Human Problems of an Industrial Civilization</em> (1933) – Introduced findings from the Hawthorne Studies.</li>
            <li><em>The Social Problems of an Industrial Civilization</em> (1945) – Examined the breakdown of community in modern work.</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas:</h3>
          <ol className="echoes-list list-decimal">
            <li><strong>Work is Social</strong> — Employees are not isolated units; they are people embedded in relationships.</li>
            <li><strong>Attention Matters</strong> — Recognition and respect can be more powerful than pay or perks.</li>
            <li><strong>Informal Groups Shape Behavior</strong> — Peer influence and workplace culture often matter more than formal rules.</li>
            <li><strong>Management Must Listen</strong> — Understanding workers' feelings is as important as managing their tasks.</li>
          </ol>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "The desire to be continuously associated in work with one's fellows is a strong, if not the strongest, human characteristic."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Man's desire to be continuously associated in work with his fellows is a strong, if not the strongest human characteristic."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "If our social skills had advanced step by step with our technical skills, there would not have been another European war."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Professor at Harvard Business School (1926–1947).</li>
            <li>The Hawthorne Studies remain one of the most cited research projects in management history.</li>
            <li>Recognized as the founder of the <strong>Human Relations Movement</strong>, which humanized management theory.</li>
            <li>His ideas influenced organizational behavior, HR practices, and leadership training worldwide.</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Elton Mayo reminded the world that behind every job title is a human being with emotions, relationships, and a need to belong.
          </p>
          <p className="echoes-paragraph">
            His work countered the cold efficiency of Taylorism by proving that people are not machines. They thrive in environments where they are heard, valued, and connected to others.
          </p>
          <p className="echoes-paragraph">
            Mayo's influence can be seen in modern ideas about employee engagement, teamwork, and workplace well-being. He showed that productivity begins with humanity.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Elton Mayo passed away in 1949, but his voice continues to echo in every workplace that values listening over orders, connection over control, and people over processes.
          </p>
          <p className="echoes-paragraph">
            Through ECHOES, his lesson remains: <em>to lead is to listen — because understanding is the beginning of respect</em>.
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Elton Mayo — The Listener Who Brought Humanity to the Workplace"
              description="Biography and legacy of Elton Mayo, the psychologist who proved that workers respond to attention, respect, and connection through the Hawthorne Studies."
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

export default EltonMayoPage;
