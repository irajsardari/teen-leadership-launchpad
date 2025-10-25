import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import maslowSymbolic from "@/assets/echoes-symbolic-maslow.jpg";

const AbrahamMaslowPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ECHOES – Abraham Maslow | Teenagers Management Academy</title>
        <meta 
          name="description" 
          content="The life and legacy of Abraham H. Maslow (1908–1970) – the architect of human motivation – presented in the ECHOES series, The Messengers of Management." 
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
              Abraham H. Maslow — The Architect of Human Motivation
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={maslowSymbolic} 
                alt="Symbolic visual representing Abraham Maslow's hierarchy of needs and human growth"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "What a man can be, he must be. This need we may call self-actualization."
              <span className="echoes-quote-attrib">— Abraham Maslow (1908–1970)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Abraham Harold Maslow</li>
            <li><strong>Born:</strong> 1 April 1908, Brooklyn, New York, USA</li>
            <li><strong>Died:</strong> 8 June 1970, Menlo Park, California (aged 62)</li>
            <li><strong>Profession:</strong> Psychologist, researcher, university professor</li>
            <li><strong>Major Work:</strong> <em>Motivation and Personality</em> (1954)</li>
            <li><strong>Field:</strong> Humanistic psychology, motivation theory, organizational behavior</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: American Psychological Association; Britannica; Archives of the History of American Psychology.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Maslow was born in Brooklyn, New York, the eldest of seven children. His parents were Jewish immigrants who had fled persecution in Russia. They wanted stability and success for their children, but the household was often tense.
          </p>
          <p className="echoes-paragraph">
            Maslow described his childhood as lonely and unhappy. He took refuge in books and learning. At first, he studied law to satisfy his father, but soon realized that his true calling was to understand human nature.
          </p>
          <p className="echoes-paragraph">
            He pursued psychology at the University of Wisconsin, where he worked under Harry Harlow studying primate behavior. Later, at Columbia University and Brooklyn College, he was influenced by thinkers such as Alfred Adler, Max Wertheimer, and Ruth Benedict—people who believed in the potential of human beings, not just their limitations.
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            During the 1930s and 1940s, psychology was dominated by two extremes: Freud's psychoanalysis, which focused on mental illness and unconscious drives, and behaviorism, which treated people like machines responding to stimuli.
          </p>
          <p className="echoes-paragraph">
            Maslow asked a different question: "What if we studied the healthiest, most fulfilled people instead of only the sick ones?"
          </p>
          <p className="echoes-paragraph">
            He began researching exceptional individuals—people who seemed to live with purpose, creativity, and inner peace. He called them <strong>self-actualizing</strong> people. From this study, he developed his famous <strong>Hierarchy of Needs</strong>, first published in 1943.
          </p>
          <p className="echoes-paragraph">
            His model showed that human motivation moves in stages: from basic survival (food, shelter) to safety, belonging, self-esteem, and finally to self-actualization—the full realization of one's potential.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Works</h3>
          <ul className="echoes-list">
            <li><em>Motivation and Personality</em> (1954)</li>
            <li><em>Toward a Psychology of Being</em> (1962)</li>
            <li><em>Religions, Values and Peak Experiences</em> (1964)</li>
            <li><em>The Farther Reaches of Human Nature</em> (1971, posthumous)</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas</h3>
          <p className="echoes-paragraph">
            Maslow's work showed that people are not simply driven by fear, instinct, or reward. They are also motivated by growth, meaning, and the desire to become their best selves.
          </p>
          <p className="echoes-paragraph">
            He believed that organizations, schools, and societies function best when they support human development—not just productivity. He argued that true success comes when people feel valued, respected, and given opportunities to contribute meaningfully.
          </p>
          <blockquote className="echoes-inline-quote">
            "One can choose to go back toward safety or forward toward growth. Growth must be chosen again and again; fear must be overcome again and again."
          </blockquote>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "What a man can be, he must be. This need we may call self-actualization."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "If you plan on being anything less than you are capable of being, you will probably be unhappy all the days of your life."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The story of the human race is the story of men and women selling themselves short."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "A musician must make music, an artist must paint, a poet must write, if he is to be ultimately at peace with himself."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <p className="echoes-paragraph">
            Maslow served as President of the American Psychological Association in 1967. He was elected a Fellow of the American Academy of Arts and Sciences and received numerous academic honors throughout his career.
          </p>
          <p className="echoes-paragraph">
            His work influenced not only psychology but also education, management theory, social policy, and even marketing. Companies began to recognize that employee motivation depends on dignity, respect, and purpose—not just wages.
          </p>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Maslow shifted psychology from illness to potential. He showed that understanding human greatness is just as important as understanding human suffering.
          </p>
          <p className="echoes-paragraph">
            His Hierarchy of Needs is now taught in nearly every psychology, business, and leadership course in the world. It has become a universal framework for understanding what people need to thrive.
          </p>
          <p className="echoes-paragraph">
            Leaders across sectors use his insights to build better workplaces, schools, and communities—places where people are seen not as resources to be managed, but as individuals with dignity and potential.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            When Abraham Maslow died in 1970, he left behind a simple but profound message: that every person has the potential to grow, to create, and to contribute something meaningful to the world.
          </p>
          <p className="echoes-paragraph">
            His voice still echoes through classrooms and boardrooms alike, reminding us that progress begins when we ask not what people can do for us, but what we can do to help people become who they are meant to be.
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

export default AbrahamMaslowPage;
