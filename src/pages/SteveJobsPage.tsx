import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import jobsImage from "@/assets/echoes-symbolic-jobs.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const SteveJobsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Steve Jobs — The Architect of Human-Centered Innovation | ECHOES | TMA</title>
        <meta name="description" content="Biography of Steve Jobs, the visionary who revolutionized technology by merging art, science, and humanity." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Steve Jobs — The Architect of Human-Centered Innovation
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={jobsImage} 
                alt="Symbolic representation of Steve Jobs' innovation - a glowing circuit symbolizing human creativity and technology"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Technology alone is not enough. It's technology married with the liberal arts, married with the humanities, that yields the results that make our hearts sing."
              <span className="echoes-quote-attrib">— Steve Jobs (1955 – 2011)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <p className="echoes-paragraph">
            Steve Jobs was an American entrepreneur, inventor, and visionary whose pursuit of perfection transformed the way the world experiences technology.
          </p>
          <p className="echoes-paragraph">
            As co-founder of Apple Inc., he revolutionized personal computing, music, animation, and mobile communication by infusing soul into technology — insisting that design should not just look good but feel right.
          </p>
          <p className="echoes-paragraph">
            Born in 1955 in San Francisco, Jobs dropped out of college but never abandoned learning. His curiosity for design, calligraphy, and Zen philosophy later shaped the simplicity and clarity that became Apple's identity.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          <ul className="echoes-list">
            <li><strong>User-Centered Design:</strong> Jobs believed that innovation starts with empathy — understanding the user's heart and mind before building the product.</li>
            <li><strong>Interdisciplinary Thinking:</strong> He merged art, science, and business — proving creativity and technology thrive together.</li>
            <li><strong>Pursuit of Excellence:</strong> His famous mantra, "Stay Hungry, Stay Foolish," inspired generations to remain curious and fearless.</li>
            <li><strong>The Reality Distortion Field:</strong> A term coined by his colleagues to describe how his conviction and storytelling could make the impossible seem achievable — a testament to the power of vision in leadership.</li>
          </ul>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "Innovation distinguishes between a leader and a follower."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The people who are crazy enough to think they can change the world are the ones who do."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Design is not just what it looks like and feels like. Design is how it works."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Co-founder, Apple Inc., Pixar Animation Studios, and NeXT Inc.</li>
            <li>Named among Time's 100 Most Influential People of the Century</li>
            <li>Recipient of National Medal of Technology (posthumous 2012)</li>
            <li>His legacy continues to influence digital design, entrepreneurship, and leadership education worldwide.</li>
          </ul>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Steve Jobs reminded the world that technology is at its best when it amplifies human potential.
          </p>
          <p className="echoes-paragraph">
            Through ECHOES, his message to future leaders is timeless: lead innovation not through complexity, but through clarity — where design meets purpose, and intelligence serves humanity.
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
              title="Steve Jobs — The Architect of Human-Centered Innovation"
              description="Biography of Steve Jobs, the visionary who revolutionized technology by merging art, science, and humanity."
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

export default SteveJobsPage;
