import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import golemanImage from "@/assets/echoes-symbolic-goleman.jpg";

const DanielGolemanPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Daniel Goleman – The Psychologist Who Made Emotions Intelligent | ECHOES | TMA</title>
        <meta name="description" content="Biography of Daniel Goleman, psychologist who popularized Emotional Intelligence (EQ) and showed that success depends on self-awareness, empathy, and emotional mastery." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Daniel Goleman — The Psychologist Who Made Emotions Intelligent
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={golemanImage} 
                alt="Symbolic representation of heart and brain connected - emotional intelligence"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "What really matters for success, character, happiness, and life-long achievements is a definite set of emotional skills — your EQ."
              <span className="echoes-quote-attrib">— Daniel Goleman (b. 1946)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Daniel Goleman</li>
            <li><strong>Born:</strong> 7 March 1946, Stockton, California, USA</li>
            <li><strong>Profession:</strong> Psychologist, science journalist, author, lecturer</li>
            <li><strong>Affiliation:</strong> Harvard University (PhD in Psychology); New York Times science writer; Founder, Consortium for Research on Emotional Intelligence in Organizations</li>
            <li><strong>Major Works:</strong> <em>Emotional Intelligence</em> (1995), <em>Working with Emotional Intelligence</em> (1998), <em>Primal Leadership</em> (2002), <em>Focus</em> (2013)</li>
            <li><strong>Known For:</strong> Popularizing the concept of Emotional Intelligence (EQ) and linking it to leadership performance</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: Harvard Gazette; American Psychological Association; Consortium for EI archives.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Goleman grew up in a family of teachers and psychologists in California, developing curiosity about emotion and morality from an early age. After earning his PhD from Harvard, he joined <em>Psychology Today</em> and later <em>The New York Times</em>, where he translated complex brain research into clear public language.
          </p>
          <p className="echoes-paragraph">
            While studying emotional development under mentors such as David McClelland and Richard Boyatzis, he saw that intelligence alone did not predict success — self-management and empathy did.
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            In 1995, Goleman published <em>Emotional Intelligence</em>, summarizing decades of neuroscience and psychology into one revolutionary idea: that our emotional competence matters as much as IQ. The book became a worldwide bestseller and shifted the paradigm of education and leadership training.
          </p>
          <p className="echoes-paragraph">
            He defined five core components of Emotional Intelligence:
          </p>
          <ol className="echoes-list list-decimal">
            <li><strong>Self-Awareness</strong> – recognizing one's emotions and their effects</li>
            <li><strong>Self-Regulation</strong> – managing impulses and stress constructively</li>
            <li><strong>Motivation</strong> – driving oneself with purpose beyond status or money</li>
            <li><strong>Empathy</strong> – understanding others' feelings and perspectives</li>
            <li><strong>Social Skill</strong> – building trust and influence through relationships</li>
          </ol>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Books</h3>
          <ul className="echoes-list">
            <li><em>Emotional Intelligence</em> (1995)</li>
            <li><em>Working with Emotional Intelligence</em> (1998)</li>
            <li><em>Primal Leadership</em> (2002, with Boyatzis & McKee)</li>
            <li><em>Social Intelligence</em> (2006)</li>
            <li><em>Focus</em> (2013)</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas</h3>
          <ol className="echoes-list list-decimal">
            <li><strong>EQ over IQ.</strong> Emotional skills predict two-thirds of leadership success.</li>
            <li><strong>Resonant Leadership.</strong> Leaders set emotional tone; their mood spreads faster than their orders.</li>
            <li><strong>Neuroscience of Empathy.</strong> The brain is wired for connection through mirror neurons.</li>
            <li><strong>Attention and Focus.</strong> Sustained focus is the foundation of self-control and ethics.</li>
            <li><strong>Emotional Balance.</strong> Performance depends on managing stress, not avoiding it.</li>
          </ol>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "IQ and technical skills matter, but emotional intelligence matters more."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The leader's mood is contagious; it spreads through the organization like electric current."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "If you cannot manage your own emotions, how can you manage those of others?"
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Emotional self-control is the real sign of strength."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Harvard PhD and visiting scholar at UC Berkeley's Greater Good Science Center</li>
            <li>Co-founder of the Consortium for Research on Emotional Intelligence in Organizations</li>
            <li>Multiple Thinkers50 rankings among the top management thinkers</li>
            <li>Awarded for science journalism by the American Psychological Association</li>
            <li>Advisor to UNICEF, Dalai Lama Center, and World Economic Forum</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Daniel Goleman gave leaders a new mirror — one that reflects not just performance but presence. He proved that empathy and self-awareness are skills to be learned, not traits to be born with.
          </p>
          <p className="echoes-paragraph">
            From classrooms to corporate boardrooms, his framework has reshaped how people hire, teach, coach, and lead.
          </p>
          <p className="echoes-paragraph">
            Every time a manager pauses to listen before reacting, or a student learns to name a feeling before expressing it, his influence is alive.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Daniel Goleman continues to teach and write from Massachusetts, urging leaders to build "emotionally intelligent societies." He reminds us that self-management is the foundation of human progress.
          </p>
          <blockquote className="echoes-inline-quote">
            "The greatest leaders move us through our emotions — not despite them."
          </blockquote>
          <p className="echoes-paragraph">
            Through <strong>ECHOES</strong>, his voice reminds future leaders that emotional intelligence is not a soft skill — it's a core competence for a human world.
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

export default DanielGolemanPage;
