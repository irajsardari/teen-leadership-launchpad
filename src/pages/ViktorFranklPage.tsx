import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import franklImage from "@/assets/echoes-symbolic-frankl.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const ViktorFranklPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Viktor E. Frankl – The Psychiatrist Who Found Freedom in Meaning | ECHOES | TMA</title>
        <meta name="description" content="Biography of Viktor E. Frankl, the Austrian psychiatrist and Holocaust survivor who taught that meaning is the anchor of resilience." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Viktor E. Frankl — The Psychiatrist Who Found Freedom in Meaning
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={franklImage} 
                alt="Symbolic representation of Viktor Frankl's philosophy - a small flame glowing within darkness"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Everything can be taken from a man but one thing: the last of the human freedoms — to choose one's attitude in any given set of circumstances."
              <span className="echoes-quote-attrib">— Viktor E. Frankl (1905 – 1997)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Viktor Emil Frankl</li>
            <li><strong>Born:</strong> 26 March 1905, Vienna, Austria</li>
            <li><strong>Died:</strong> 2 September 1997, Vienna, Austria (aged 92)</li>
            <li><strong>Profession:</strong> Neurologist, psychiatrist, Holocaust survivor</li>
            <li><strong>Major Work:</strong> <em>Man's Search for Meaning</em> (1946)</li>
            <li><strong>Known For:</strong> Founder of <strong>Logotherapy</strong>; teaching that meaning is the anchor of resilience.</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: Viktor Frankl Institute; Library of Congress; Britannica.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Born in Vienna in 1905, Frankl grew up amid the intellectual energy of Freud and Adler but soon forged his own path — from pleasure and power toward purpose.
          </p>
          <p className="echoes-paragraph">
            As a young doctor he counseled students who had lost hope during the Great Depression, laying the first stones of what he later called <strong>Logotherapy</strong>.
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            In 1942 he and his family were deported to concentration camps, including Auschwitz.
          </p>
          <p className="echoes-paragraph">
            He lost his parents, brother, and wife — yet within that horror he discovered something transformative: those who endured found meaning in love, faith, or duty.
          </p>
          <p className="echoes-paragraph">
            From this grew his central insight: <strong>life never loses meaning, even when everything else is taken away</strong>.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Publications:</h3>
          <ul className="echoes-list">
            <li><em>Man's Search for Meaning</em> (1946) — a memoir that has inspired generations.</li>
            <li><em>The Doctor and the Soul</em> (1955) — applies Logotherapy to everyday life.</li>
            <li><em>The Unheard Cry for Meaning</em> (1978) — addresses the modern emptiness of comfort without purpose.</li>
          </ul>
          
          <h3 className="echoes-subheading">Core Ideas:</h3>
          <ol className="echoes-list list-decimal">
            <li>Life always has meaning.</li>
            <li>Freedom lies in attitude, not circumstance.</li>
            <li>Purpose and responsibility create inner strength.</li>
            <li>Human beings are spiritual and moral agents, not objects of fate.</li>
          </ol>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "When we are no longer able to change a situation, we are challenged to change ourselves."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Those who have a why to live can bear almost any how."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Happiness cannot be pursued; it must ensue as the side effect of dedication to a cause greater than oneself."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Founder of <strong>Logotherapy</strong> and the Vienna Institute of Neurology and Psychiatry.</li>
            <li>Received <strong>29 honorary doctorates</strong> worldwide.</li>
            <li><em>Man's Search for Meaning</em> listed by the Library of Congress among America's most influential books.</li>
            <li>Lectured at Harvard, Stanford, and universities around the world.</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Frankl turned tragedy into a theory of hope.
          </p>
          <p className="echoes-paragraph">
            He proved that resilience is not the absence of pain but the presence of meaning.
          </p>
          <p className="echoes-paragraph">
            His ideas became the roots of positive psychology, resilience training, and human-centered leadership.
          </p>
          <p className="echoes-paragraph">
            To every generation he whispers: <em>your circumstances do not define you; your response does</em>.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Viktor Frankl's life reminds us that even in darkness, the human spirit can shine. His voice in ECHOES — The Academy's Hall of Thinkers represents the pillar of <strong>Resilience</strong> — the power to endure through purpose, faith, and choice.
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Viktor E. Frankl — The Psychiatrist Who Found Freedom in Meaning"
              description="Biography of Viktor E. Frankl, the Austrian psychiatrist and Holocaust survivor who taught that meaning is the anchor of resilience."
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

export default ViktorFranklPage;
