import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import duckworthImage from "@/assets/echoes-symbolic-duckworth.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const AngelaDuckworthPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Angela Duckworth — The Psychologist Who Proved That Grit Outlasts Talent | ECHOES | TMA</title>
        <meta name="description" content="Biography of Angela Duckworth, psychologist and author who introduced the concept of grit as the combination of passion and perseverance toward long-term goals." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Angela Duckworth — The Psychologist Who Proved That Grit Outlasts Talent
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={duckworthImage} 
                alt="A small green sprout breaking through dry earth symbolizing perseverance and determination"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Enthusiasm is common. Endurance is rare."
              <span className="echoes-quote-attrib">— Angela Duckworth (b. 1970)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <p className="echoes-paragraph">
            Angela Duckworth is an American psychologist and professor at the University of Pennsylvania, globally recognized for introducing the concept of <strong>grit</strong> — the combination of passion and perseverance toward long-term goals.
          </p>
          <p className="echoes-paragraph">
            Her groundbreaking work challenges the traditional belief that intelligence or talent alone predicts success. Through large-scale studies across students, cadets, and professionals, Duckworth demonstrated that sustained effort and consistency of interest often outperform raw ability.
          </p>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Duckworth's book <em>Grit: The Power of Passion and Perseverance</em> (2016) reshaped modern education and leadership by highlighting the science of resilience. Her framework inspired schools, sports teams, and organizations worldwide to focus on character development, self-discipline, and long-term purpose instead of short bursts of motivation.
          </p>
          <p className="echoes-paragraph">
            Her message resonates deeply with TMA's mission — that resilience is not born but built, and that young people can learn to transform obstacles into opportunities through sustained effort and belief in meaningful goals.
          </p>
        </section>

        {/* WHY SHE BELONGS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Why She Belongs to the Academy Hall of Thinkers</h2>
          <p className="echoes-paragraph">
            Angela Duckworth's research bridges psychology, education, and leadership — embodying the essence of human capability development.
          </p>
          <p className="echoes-paragraph">
            In a fast-changing world, her insight reminds future leaders that while knowledge can open doors, grit keeps them open.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <p className="echoes-paragraph text-center italic mt-8">
            Curated by Dr. Iraj Sardari Baf
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Angela Duckworth — The Psychologist Who Proved That Grit Outlasts Talent"
              description="Biography of Angela Duckworth, psychologist and author who introduced the concept of grit as the combination of passion and perseverance toward long-term goals."
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

export default AngelaDuckworthPage;
