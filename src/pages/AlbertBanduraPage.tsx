import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import banduraImage from "@/assets/echoes-symbolic-bandura.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const AlbertBanduraPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Albert Bandura — The Psychologist Who Showed How Confidence Is Built | TMA ECHOES</title>
        <meta name="description" content="Discover how Albert Bandura's ideas on self-efficacy and social learning shaped modern psychology and why they matter for today's young leaders." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Albert Bandura — The Psychologist Who Showed How Confidence Is Built
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={banduraImage} 
                alt="A young person climbing illuminated steps with their shadow showing a stronger version of themselves, symbolizing self-efficacy and confidence building"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Self-belief does not necessarily ensure success, but self-disbelief almost certainly ensures failure."
              <span className="echoes-quote-attrib">— Albert Bandura (1925–2021)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Albert Bandura</li>
            <li><strong>Born:</strong> December 4, 1925 – Mundare, Alberta, Canada</li>
            <li><strong>Died:</strong> July 26, 2021 – Stanford, California, USA</li>
            <li><strong>Field:</strong> Psychology (Social Learning, Social Cognitive Theory)</li>
            <li><strong>Known For:</strong> Social Learning Theory, Bobo Doll Experiments, the concept of Self-Efficacy, Social Cognitive Theory</li>
          </ul>
          <p className="echoes-paragraph">
            Albert Bandura is one of the most influential psychologists of the 20th and 21st centuries.
            He changed how we understand learning, confidence, and behavior — showing that people are not just shaped by the world around them; they also shape themselves.
          </p>
        </section>

        {/* FROM A SMALL TOWN TO A GLOBAL MIND */}
        <section className="echoes-section">
          <h2 className="echoes-heading">From a Small Town to a Global Mind</h2>
          <p className="echoes-paragraph">
            Bandura grew up in a small farming community in Canada.
            His school was modest, with limited resources, but he quickly noticed something powerful:
          </p>
          <blockquote className="echoes-inline-quote">
            the quality of your learning is not only about your environment — it is also about how you respond to it.
          </blockquote>
          <p className="echoes-paragraph">
            After moving to the United States, Bandura studied psychology and eventually became a professor at Stanford University. From there, his work began to reshape modern psychology.
          </p>
        </section>

        {/* SOCIAL LEARNING */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Social Learning: We Become What We See</h2>
          <p className="echoes-paragraph">
            One of Bandura's most famous contributions is Social Learning Theory.
          </p>
          <p className="echoes-paragraph">
            Through his well-known Bobo Doll experiments, he showed that children imitate the behavior they see — especially from adults and role models. When children watched adults act aggressively toward a toy doll, they often copied the same behavior.
          </p>
          <p className="echoes-paragraph">
            This discovery carried a deep message:
          </p>
          <blockquote className="echoes-inline-quote">
            We learn not only from what we are told, but also from what we watch — in families, schools, media, and society.
          </blockquote>
          <p className="echoes-paragraph">
            For teenagers, this means:
            The people you follow, admire, and imitate are quietly shaping who you become.
          </p>
        </section>

        {/* SELF-EFFICACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Self-Efficacy: The Science of "I Can"</h2>
          <p className="echoes-paragraph">
            Bandura's most powerful idea for young leaders is self-efficacy — the belief in one's ability to organize and execute actions needed to reach a goal.
          </p>
          <p className="echoes-paragraph">
            He showed that people with high self-efficacy:
          </p>
          <ul className="echoes-list">
            <li>take on challenges instead of avoiding them,</li>
            <li>recover more quickly from setbacks,</li>
            <li>stay motivated longer,</li>
            <li>and are more likely to turn knowledge into action.</li>
          </ul>
          <p className="echoes-paragraph">
            In other words:
          </p>
          <blockquote className="echoes-inline-quote">
            It is not only your skills that matter — it is whether you believe you can use them.
          </blockquote>
          <p className="echoes-paragraph">
            For teenagers, self-efficacy is the quiet engine behind:
          </p>
          <ul className="echoes-list">
            <li>raising your hand in class,</li>
            <li>starting a project,</li>
            <li>handling exams,</li>
            <li>speaking up for yourself,</li>
            <li>and leading others.</li>
          </ul>
        </section>

        {/* KEY IDEAS & CONTRIBUTIONS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Key Ideas & Contributions</h2>
          
          <h3 className="echoes-subheading">Social Learning Theory</h3>
          <p className="echoes-paragraph">
            People learn through observation, imitation, and modeling. Learning is social, not just individual.
          </p>

          <h3 className="echoes-subheading">Reciprocal Determinism</h3>
          <p className="echoes-paragraph">
            Our behavior, our thoughts, and our environment all influence each other in both directions. We are not passive — we are participants shaping our own lives.
          </p>

          <h3 className="echoes-subheading">Self-Efficacy</h3>
          <p className="echoes-paragraph">
            Confidence is not a vague feeling; it is a specific belief: "I can handle this situation." It is built through experience, encouragement, and small wins.
          </p>

          <h3 className="echoes-subheading">Social Cognitive Theory</h3>
          <p className="echoes-paragraph">
            Combined all of his ideas into a broader view of human functioning: people are active, thinking agents, capable of reflection, planning, and self-regulation.
          </p>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "In order to succeed, people need a sense of self-efficacy, to struggle together with resilience to meet the inevitable obstacles and inequities of life."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "People's beliefs about their abilities have a profound effect on those abilities."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "We are not just products of our environment; we are producers of our environment."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Most of the images of reality on which we base our actions are really based on vicarious experience."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Long-time Professor of Psychology at Stanford University</li>
            <li>Past President of the American Psychological Association (APA)</li>
            <li>Widely ranked among the most cited psychologists in history</li>
            <li>Awarded the National Medal of Science (USA) for his contributions to the behavioral sciences</li>
          </ul>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Albert Bandura showed that confidence is not magic — it is something we build.
            Through ECHOES, his voice reminds every teenager and young leader:
          </p>
          <p className="echoes-paragraph">
            You are always learning from the people you watch. Choose your models wisely.
          </p>
          <p className="echoes-paragraph">
            Your belief in yourself is one of your greatest strengths.
          </p>
          <p className="echoes-paragraph">
            You are not only shaped by the world — you are also shaping the world in return.
          </p>
          <p className="echoes-paragraph">
            His life and work whisper a simple, powerful message to the next generation:
            "When you change what you believe you can do, you change what becomes possible."
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
              title="Albert Bandura — The Psychologist Who Showed How Confidence Is Built"
              description="Discover how Albert Bandura's ideas on self-efficacy and social learning shaped modern psychology and why they matter for today's young leaders."
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

export default AlbertBanduraPage;
