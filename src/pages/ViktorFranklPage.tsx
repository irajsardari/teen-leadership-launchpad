import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import franklImage from "@/assets/echoes-symbolic-frankl.jpg";

const ViktorFranklPage = () => {
  return (
    <article className="echoes-article">
      <Helmet>
        <title>Viktor E. Frankl - The Psychiatrist Who Found Freedom in Meaning | ECHOES - TMA</title>
        <meta 
          name="description" 
          content="Biography of Viktor E. Frankl, the Austrian psychiatrist and Holocaust survivor who taught that meaning is the anchor of resilience." 
        />
        <link rel="canonical" href="https://teenmanagementacademy.com/echoes/viktor-frankl" />
      </Helmet>

      {/* Hero Section */}
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
            <figcaption className="text-center text-sm text-muted-foreground mt-4 italic">
              A small flame glowing within darkness — representing the light of purpose that survives every storm.
            </figcaption>
          </figure>

          {/* SIGNATURE QUOTE */}
          <blockquote className="echoes-quote">
            "Everything can be taken from a man but one thing: the last of the human freedoms — to choose one's attitude in any given set of circumstances."
            <span className="echoes-quote-attrib">— Viktor E. Frankl (1905 – 1997)</span>
          </blockquote>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">

          {/* Snapshot Section */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Snapshot</h2>
            <p className="echoes-paragraph">
              <strong>Viktor Emil Frankl</strong> was an Austrian neurologist, psychiatrist, and Holocaust survivor 
              whose life and work revealed one of humanity's deepest truths: <em>meaning is the anchor of resilience</em>.
            </p>
            <p className="echoes-paragraph">
              He taught that our greatest freedom is the freedom to choose our response — even in suffering.
            </p>
          </section>

          {/* Early Life & Influences */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Early Life & Influences</h2>
            <p className="echoes-paragraph">
              Born in Vienna in 1905, Frankl grew up amid the intellectual energy of Freud and Adler but soon 
              forged his own path — from pleasure and power toward purpose.
            </p>
            <p className="echoes-paragraph">
              As a young doctor he counseled students who had lost hope during the Great Depression, laying 
              the first stones of what he later called <strong>Logotherapy</strong>.
            </p>
          </section>

          {/* Turning Point */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Turning Point</h2>
            <p className="echoes-paragraph">
              In 1942 he and his family were deported to concentration camps, including Auschwitz.
            </p>
            <p className="echoes-paragraph">
              He lost his parents, brother, and wife — yet within that horror he discovered something transformative: 
              those who endured found meaning in love, faith, or duty.
            </p>
            <p className="echoes-paragraph">
              From this grew his central insight: <strong>life never loses meaning, even when everything else is taken away</strong>.
            </p>
          </section>

          {/* Major Works & Signature Ideas */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
            <ul className="echoes-list">
              <li>
                <strong>Man's Search for Meaning (1946)</strong> — a memoir that has inspired generations.
              </li>
              <li>
                <strong>The Doctor and the Soul (1955)</strong> — applies Logotherapy to everyday life.
              </li>
              <li>
                <strong>The Unheard Cry for Meaning (1978)</strong> — addresses the modern emptiness of 
                comfort without purpose.
              </li>
            </ul>
            
            <h3 className="echoes-subheading">Core Ideas</h3>
            <ul className="echoes-list">
              <li>Life always has meaning.</li>
              <li>Freedom lies in attitude, not circumstance.</li>
              <li>Purpose and responsibility create inner strength.</li>
              <li>Human beings are spiritual and moral agents, not objects of fate.</li>
            </ul>
          </section>

          {/* Selected Quotes */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Selected Quotes</h2>
            <div className="echoes-quote-list">
              <blockquote className="echoes-inline-quote">
                "When we are no longer able to change a situation, we are challenged to change ourselves."
              </blockquote>
              <blockquote className="echoes-inline-quote">
                "Those who have a why to live can bear almost any how."
              </blockquote>
              <blockquote className="echoes-inline-quote">
                "Happiness cannot be pursued; it must ensue as the side effect of dedication to a cause greater than oneself."
              </blockquote>
            </div>
          </section>

          {/* Honours & Recognition */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Honours & Recognition</h2>
            <ul className="echoes-list">
              <li>Founder of <strong>Logotherapy</strong> and the Vienna Institute of Neurology and Psychiatry.</li>
              <li>Received <strong>29 honorary doctorates</strong> worldwide.</li>
              <li><em>Man's Search for Meaning</em> listed by the Library of Congress among America's most influential books.</li>
              <li>Lectured at Harvard, Stanford, and universities around the world.</li>
            </ul>
          </section>

          {/* Legacy */}
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

          {/* Closing Reflection */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Closing Reflection</h2>
            <p className="echoes-paragraph">
              Viktor Frankl's life reminds us that even in darkness, the human spirit can shine. His voice in 
              <strong> ECHOES — The Academy's Hall of Thinkers</strong> represents the pillar of <strong>Resilience</strong> — 
              the power to endure through purpose, faith, and choice.
            </p>
          </section>

        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="echoes-footer-nav">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground mb-4 italic text-sm">
              Curated by Dr. Iraj Sardari Baf
            </p>
            <div className="echoes-next-link">
              <a href="/voices/echoes">← Back to ECHOES Collection</a>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
};

export default ViktorFranklPage;
