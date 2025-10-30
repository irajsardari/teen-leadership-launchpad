import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import mcgregorImage from "@/assets/echoes-symbolic-mcgregor.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const DouglasMcGregorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Douglas McGregor – The Voice Who Taught the World How to See People at Work | ECHOES | TMA</title>
        <meta name="description" content="Biography and legacy of Douglas McGregor, creator of Theory X and Theory Y, who transformed management by teaching leaders to see people as capable partners in achievement." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Douglas McGregor — The Voice Who Taught the World How to See People at Work
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={mcgregorImage} 
                alt="Symbolic representation: two arrows — one rigid and dark, one open and bright — converging toward a shared horizon, representing trust over control"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "The greatest barrier to progress in management is not ignorance — it's the illusion of knowledge."
              <span className="echoes-quote-attrib">— Douglas McGregor (1906 – 1964)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Douglas Murray McGregor</li>
            <li><strong>Born:</strong> 16 September 1906, Detroit, Michigan, USA</li>
            <li><strong>Died:</strong> 1 October 1964, Massachusetts (aged 58)</li>
            <li><strong>Profession:</strong> Psychologist, Professor of Management, Organizational Behavior Pioneer</li>
            <li><strong>Major Work:</strong> <em>The Human Side of Enterprise</em> (1960)</li>
            <li><strong>Known For:</strong> Theory X and Theory Y — the two views of human motivation that reshaped leadership forever</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: MIT Sloan Archives; Harvard Business Review Library; Britannica.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            McGregor grew up in Detroit during the rise of American industry. While studying psychology at Wayne State University, he worked nights at a gas station owned by his family — an early lesson in how differently people respond to work and responsibility.
          </p>
          <p className="echoes-paragraph">
            He later earned a master's degree from Harvard and a doctorate from Massachusetts Institute of Technology (MIT), where he would spend much of his career. His early studies in social psychology made him question a simple but profound assumption: "What do managers really believe about the people who work for them?"
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            In the 1950s, McGregor became president of Antioch College in Ohio, a progressive university that trusted students with real responsibility for governing the campus. There he witnessed how trust created initiative and innovation — the same principles he would soon bring to management theory.
          </p>
          <p className="echoes-paragraph">
            Returning to MIT's Sloan School of Management, he condensed years of observation into his classic book <em>The Human Side of Enterprise</em> (1960). In it, he introduced two contrasting mental models of management that continue to shape leadership today.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Publication:</h3>
          <ul className="echoes-list">
            <li><em>The Human Side of Enterprise</em> (1960)</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas:</h3>
          <ol className="echoes-list list-decimal">
            <li><strong>Theory X</strong> – Assumes people dislike work, avoid responsibility, and must be controlled.</li>
            <li><strong>Theory Y</strong> – Assumes people are self-motivated, seek meaning, and thrive under trust.</li>
            <li><strong>Leadership is a Belief System.</strong> Managers act on what they believe about others — and that belief creates reality.</li>
            <li><strong>Motivation Comes from Growth, Not Fear.</strong> Job satisfaction is rooted in participation and recognition.</li>
            <li><strong>Organizational Culture Matters.</strong> Structures should enable initiative, not suppress it.</li>
          </ol>

          <p className="echoes-paragraph">
            McGregor's writing was calm, clear, and deeply human. He did not preach revolution — he simply asked managers to see people as capable partners in achievement.
          </p>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "If human beings are to be managed effectively, they must first be seen as human beings."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "People have a deep need to exercise their own initiative and responsibility."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The success of management depends more on its philosophy of human nature than on its techniques."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The manager's real job is not to control people, but to unleash their potential."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Served as Professor of Industrial Relations at MIT Sloan School of Management</li>
            <li>Consultant for General Electric, Union Carbide, and U.S. government agencies</li>
            <li>Founding influence on Human Relations and Organizational Behavior programs worldwide</li>
            <li>Honored posthumously by the Academy of Management for pioneering humanistic leadership education</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Douglas McGregor shifted management philosophy from compliance to trust. He proved that productivity and human dignity are not opposites but partners. His Theory X and Theory Y sparked the development of motivation science, influencing Herzberg's Two-Factor Theory, Maslow's Hierarchy in practice, and later the concept of empowerment in modern HR.
          </p>
          <p className="echoes-paragraph">
            He reminded leaders that every management system is a mirror of its assumptions about people.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Douglas McGregor passed away suddenly in 1964, but his ideas still guide the best leaders of the modern world. He believed that a manager's greatest choice is not what strategy to follow, but what belief to hold about human nature.
          </p>
          <blockquote className="echoes-inline-quote">
            "The task of management is to arrange conditions so that people can achieve their own goals best by directing their efforts toward organizational objectives."
          </blockquote>
          <p className="echoes-paragraph">
            Through ECHOES, his voice continues to teach a new generation that leadership begins with trust.
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Douglas McGregor — The Voice Who Taught the World How to See People at Work"
              description="Biography and legacy of Douglas McGregor, creator of Theory X and Theory Y, who transformed management by teaching leaders to see people as capable partners in achievement."
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

export default DouglasMcGregorPage;
