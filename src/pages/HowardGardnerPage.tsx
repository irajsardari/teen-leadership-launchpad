import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import gardnerImage from "@/assets/echoes-symbolic-gardner.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const HowardGardnerPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Howard Gardner — The Psychologist Who Proved Intelligence Has Many Faces | TMA ECHOES</title>
        <meta name="description" content="Howard Gardner's Multiple Intelligences reframed what it means to be smart. Explore his ideas and why they matter for teenagers' learning and leadership at TMA." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Howard Gardner — The Psychologist Who Proved Intelligence Has Many Faces
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={gardnerImage} 
                alt="A prism-like brain radiating multiple colors — symbolizing Gardner's belief that intelligence is not one beam, but many lights working together"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "It's not how smart you are that matters — it's how you are smart."
              <span className="echoes-quote-attrib">— Howard Gardner (b. 1943)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Howard Earl Gardner</li>
            <li><strong>Born:</strong> July 11, 1943, Scranton, Pennsylvania, USA</li>
            <li><strong>Profession:</strong> Developmental psychologist; Professor of Cognition and Education, Harvard University</li>
            <li><strong>Known For:</strong> Theory of Multiple Intelligences (1983)</li>
          </ul>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Publications:</h3>
          <ul className="echoes-list">
            <li><em>Frames of Mind: The Theory of Multiple Intelligences</em> (1983)</li>
            <li><em>Multiple Intelligences: New Horizons</em> (2006)</li>
            <li><em>Five Minds for the Future</em> (2006)</li>
            <li><em>The Unschooled Mind</em> (1991)</li>
          </ul>

          <h3 className="echoes-subheading">Core Idea:</h3>
          <p className="echoes-paragraph">
            Gardner challenged the single-number IQ model. He proposed that each person carries a unique blend of intelligences that can be developed through experience and education. Schools and workplaces thrive when they recognize, nurture, and combine different kinds of "smart."
          </p>

          <h3 className="echoes-subheading">The Intelligences:</h3>
          <ul className="echoes-list">
            <li><strong>Linguistic</strong> – mastery of words and language</li>
            <li><strong>Logical-Mathematical</strong> – reasoning and numerical thinking</li>
            <li><strong>Spatial</strong> – visual and spatial perception</li>
            <li><strong>Musical</strong> – sensitivity to rhythm, pitch, and melody</li>
            <li><strong>Bodily-Kinesthetic</strong> – physical coordination and movement</li>
            <li><strong>Interpersonal</strong> – understanding others and social dynamics</li>
            <li><strong>Intrapersonal</strong> – self-awareness and reflection</li>
            <li><strong>Naturalistic</strong> – recognizing patterns in nature</li>
            <li><strong>Existential</strong> (often discussed) – contemplating big questions of existence</li>
          </ul>
        </section>

        {/* WHY IT MATTERS FOR TMA */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Why It Matters for TMA</h2>
          <p className="echoes-paragraph">
            For teenagers, Gardner's work is permission to learn <strong>their way</strong> and a map for building teams where differences become strengths. TMA applies Multiple Intelligences to lesson design, assessment, and student projects so every learner can lead with their best abilities.
          </p>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "The greatest mistake in schools is treating all students as if they were variants of the same individual."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "True education is discovering how each mind learns best."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Diversity of minds isn't a problem to fix; it's the resource to build with."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>MacArthur "Genius" Fellowship (1981)</li>
            <li>Prince of Asturias Award for Social Sciences (2011)</li>
            <li>30+ books; translated into 30+ languages</li>
            <li>Long-time faculty, Harvard Graduate School of Education</li>
          </ul>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Howard Gardner redefined "intelligence" for a new century. Through ECHOES, his message endures: <strong>success is not fitting a narrow mold of smart—it's discovering your own form of excellence and learning to combine many minds to solve real problems.</strong>
          </p>
          <p className="echoes-paragraph text-center italic mt-8">
            Curated by Dr. Iraj Sardari Baf
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Howard Gardner — The Psychologist Who Proved Intelligence Has Many Faces"
              description="Howard Gardner's Multiple Intelligences reframed what it means to be smart. Explore his ideas and why they matter for teenagers' learning and leadership at TMA."
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

export default HowardGardnerPage;
