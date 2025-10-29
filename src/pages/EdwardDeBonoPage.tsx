import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import deBonoImage from "@/assets/echoes-symbolic-debono.jpg";

const EdwardDeBonoPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ECHOES – Edward de Bono | Teenagers Management Academy</title>
        <meta name="description" content="Biography of Edward de Bono, the mind that taught the world to think sideways through lateral thinking and Six Thinking Hats." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Edward de Bono — The Mind That Taught the World to Think Sideways
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={deBonoImage} 
                alt="A prism splitting one beam of light into many colors symbolizing perspective expansion"
                loading="eager"
              />
              <figcaption className="text-sm text-muted-foreground mt-3 italic">
                A prism splitting one beam of light into many colors — symbolizing how a single thought can expand into countless new perspectives.
              </figcaption>
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Creativity involves breaking out of established patterns so that you can look at things in a different way."
              <span className="echoes-quote-attrib">— Edward de Bono (1933 – 2021)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <p className="echoes-paragraph">
            Edward de Bono was a Maltese physician, psychologist, and philosopher who devoted his life to one idea:
            that thinking itself can be taught.
          </p>
          <p className="echoes-paragraph">
            At a time when most education systems rewarded memorization, de Bono showed the world that creativity is not a gift for the few — it is a skill for everyone.
            Through his concepts of Lateral Thinking and Six Thinking Hats, he gave people practical tools to escape rigid logic and approach problems from fresh angles.
            He believed intelligence was like water: it must be directed, not contained.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          <ul className="echoes-list">
            <li><strong>Lateral Thinking:</strong> Moving beyond traditional step-by-step logic to find unexpected solutions.</li>
            <li><strong>Six Thinking Hats:</strong> A framework that teaches groups to look at challenges from six mental perspectives — facts, emotions, caution, optimism, creativity, and control.</li>
            <li><strong>Teaching Thinking:</strong> Advocated adding "thinking" as a subject in schools — as fundamental as math or language.</li>
            <li><strong>Design Thinking for Life:</strong> Applied creative reasoning to everything from business innovation to conflict resolution and education reform.</li>
            <li><strong>Provocation Technique ("Po"):</strong> Encouraged using deliberately unusual statements to trigger new connections in the mind.</li>
          </ul>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">A Voice of Reflection</h2>
          <blockquote className="echoes-inline-quote">
            "You can't dig a new hole by digging the same hole deeper."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Lateral thinking is concerned not with playing with the existing pieces but with seeking to change those very pieces."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "An idea that is developed and put into action is more important than an idea that exists only as an idea."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Thinking is the ultimate human resource — yet it is often the most neglected."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours and Recognition</h2>
          <ul className="echoes-list">
            <li>Author of over 80 books translated into 40 languages.</li>
            <li>Coined and popularized the term <em>Lateral Thinking</em>, now part of global business and education vocabulary.</li>
            <li>Served as consultant and lecturer for organizations such as IBM, DuPont, Nokia, and UNESCO.</li>
            <li>Nominated for the Nobel Prize in Economics for contributions to practical creativity and decision-making.</li>
            <li>Founder of Cognitive Research Trust (CORT), one of the first global programs teaching thinking skills in schools.</li>
          </ul>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Edward de Bono showed the world that thinking is not only about analysis — it is also about design.
            Through ECHOES, his message to TMA students is timeless:
            don't only look for answers — create better questions.
            He reminds every young leader that progress begins when courage meets imagination, and when thought becomes a tool for possibility.
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

export default EdwardDeBonoPage;
