import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ulrichImage from "@/assets/echoes-symbolic-ulrich.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const DaveUlrichPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dave Ulrich – The Architect of Human Value | ECHOES | TMA</title>
        <meta name="description" content="Biography of Dave Ulrich, the father of modern HR who transformed human resources into a strategic partner for organizational success." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Dave Ulrich — The Architect of Human Value in Organizations
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={ulrichImage} 
                alt="Symbolic representation of Dave Ulrich's HR philosophy - interconnected people forming a bridge"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Value is created when we turn human capability into organizational success."
              <span className="echoes-quote-attrib">— Dave Ulrich (b. 1953)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Dave Ulrich</li>
            <li><strong>Born:</strong> 1953, United States</li>
            <li><strong>Profession:</strong> Organizational psychologist, professor, consultant</li>
            <li><strong>Affiliation:</strong> University of Michigan's Ross School of Business</li>
            <li><strong>Major Works:</strong> <em>Human Resource Champions</em> (1997), <em>Results-Based Leadership</em> (1999), <em>The Why of Work</em> (2010), <em>Victory Through Organization</em> (2017)</li>
            <li><strong>Known For:</strong> Father of modern HR; HR Business Partner Model; building leadership, culture, and capability</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: University of Michigan Ross School of Business; Thinkers50; RBL Group.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Born in Utah, Ulrich studied at Brigham Young University before completing his PhD at UCLA. Early exposure to psychology and organizational theory shaped his fascination with how people systems drive performance.
          </p>
          <p className="echoes-paragraph">
            He often described his early years as a mix of <em>"mission work, community learning, and academic curiosity,"</em> experiences that built his belief that organizations exist to serve people — not the other way around.
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            In the late 1980s, while consulting for global corporations, Ulrich recognized that HR was often reactive — focused on policies, not purpose.
          </p>
          <p className="echoes-paragraph">
            At the University of Michigan's Executive Education Center, he began codifying a new model: <strong>HR as a business partner</strong>. His research reframed HR around four roles — <strong>Strategic Partner, Change Agent, Administrative Expert, and Employee Champion</strong> — a model that redefined the field worldwide.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Publications:</h3>
          <ul className="echoes-list">
            <li><em>Human Resource Champions</em> (1997) — introduced the HR Business Partner Model.</li>
            <li><em>Results-Based Leadership</em> (1999) — co-authored with Norm Smallwood, linking leadership behaviors to stakeholder outcomes.</li>
            <li><em>The Why of Work</em> (2010) — explored purpose and meaning as drivers of engagement and performance.</li>
            <li><em>Victory Through Organization</em> (2017) — emphasized that organizational capability, not individual talent alone, creates lasting success.</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas:</h3>
          <ol className="echoes-list list-decimal">
            <li><strong>HR as Strategic Partner</strong> — HR must align talent, leadership, and culture with business goals.</li>
            <li><strong>Results-Based Leadership</strong> — leadership is defined by outcomes, not just behaviors.</li>
            <li><strong>Organizational Capability</strong> — success comes from what the organization can do, not just who it has.</li>
            <li><strong>Value Creation</strong> — value is defined by the receiver — customer, investor, or employee.</li>
          </ol>

          <p className="echoes-paragraph">
            Across all his works, Ulrich insists that <strong>value is defined by the receiver</strong> — whether the customer, investor, or employee.
          </p>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "Leaders build value by building people who build value."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The best HR professionals don't do HR for HR's sake — they do HR for the business's sake."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "If culture eats strategy for breakfast, then leadership serves both the meal."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Ranked multiple times in <strong>Thinkers 50</strong> list of the world's most influential management thinkers.</li>
            <li><strong>Lifetime Achievement Award</strong> from HR Magazine.</li>
            <li><strong>Fellow, National Academy of Human Resources.</strong></li>
            <li>Co-founder of <strong>The RBL Group</strong>, a global consulting firm advancing leadership and HR capability.</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Ulrich's ideas shaped how Fortune 500 companies design their people strategies. He bridged academia and industry, proving that <strong>HR is the architect of value creation</strong> — aligning talent, leadership, and culture with business goals.
          </p>
          <p className="echoes-paragraph">
            For today's young leaders, his message is timeless: <em>management begins with people, but endures through purpose.</em>
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Dave Ulrich reminds every future leader that <strong>"human resources"</strong> are not a department — they are the source of every achievement. Through ECHOES, his voice continues to inspire a generation to see management not as control, but as connection — turning human potential into organizational greatness.
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Dave Ulrich — The Architect of Human Value in Organizations"
              description="Biography of Dave Ulrich, the father of modern HR who transformed human resources into a strategic partner for organizational success."
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

export default DaveUlrichPage;
