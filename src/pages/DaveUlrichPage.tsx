import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import ulrichImage from "@/assets/echoes-symbolic-ulrich.jpg";

const DaveUlrichPage = () => {
  return (
    <article className="echoes-article">
      <Helmet>
        <title>Dave Ulrich - The Architect of Human Value | ECHOES - TMA</title>
        <meta 
          name="description" 
          content="Biography of Dave Ulrich, the father of modern HR who transformed human resources into a strategic partner for organizational success." 
        />
        <link rel="canonical" href="https://teenmanagementacademy.com/echoes/dave-ulrich" />
      </Helmet>

      {/* Hero Section */}
      <section className="echoes-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="echoes-badge">
              The Messengers of Management
            </Badge>
            <h1 className="echoes-title">
              ECHOES
            </h1>
            <div className="echoes-subtitle">
              Dave Ulrich — The Architect of Human Value in Organizations
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Opening Quote */}
          <div className="echoes-quote-block">
            <blockquote className="echoes-quote">
              "Value is created when we turn human capability into organizational success."
            </blockquote>
          </div>

          {/* Symbolic Image */}
          <div className="echoes-image-container">
            <img 
              src={ulrichImage} 
              alt="Symbolic representation of Dave Ulrich's HR philosophy - interconnected people forming a bridge"
              className="echoes-image"
              loading="lazy"
              decoding="async"
            />
            <p className="text-center text-sm text-muted-foreground mt-4 italic">
              Interlinked human figures forming a luminous bridge between people and performance — 
              symbolizing Ulrich's lifelong idea that organizations thrive when people and strategy are connected.
            </p>
          </div>

          {/* Snapshot Section */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Snapshot</h2>
            <p className="echoes-paragraph">
              <strong>Dave Ulrich</strong> (b. 1953) is an American organizational psychologist and professor 
              at the University of Michigan's Ross School of Business. Called <em>"the father of modern HR,"</em> he 
              transformed human resources from a support function into a strategic partner that builds leadership, 
              culture, and capability.
            </p>
          </section>

          {/* Early Life & Influences */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Early Life & Influences</h2>
            <p className="echoes-paragraph">
              Born in Utah, Ulrich studied at Brigham Young University before completing his PhD at UCLA. 
              Early exposure to psychology and organizational theory shaped his fascination with how people 
              systems drive performance.
            </p>
            <p className="echoes-paragraph">
              He often described his early years as a mix of <em>"mission work, community learning, and academic 
              curiosity,"</em> experiences that built his belief that organizations exist to serve people — not 
              the other way around.
            </p>
          </section>

          {/* Turning Point */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Turning Point</h2>
            <p className="echoes-paragraph">
              In the late 1980s, while consulting for global corporations, Ulrich recognized that HR was often 
              reactive — focused on policies, not purpose.
            </p>
            <p className="echoes-paragraph">
              At the University of Michigan's Executive Education Center, he began codifying a new model: 
              <strong> HR as a business partner</strong>. His research reframed HR around four roles — 
              <strong>Strategic Partner, Change Agent, Administrative Expert, and Employee Champion</strong> — 
              a model that redefined the field worldwide.
            </p>
          </section>

          {/* Major Works & Signature Ideas */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
            <ul className="echoes-list">
              <li>
                <strong>Human Resource Champions (1997)</strong> — introduced the HR Business Partner Model.
              </li>
              <li>
                <strong>Results-Based Leadership (1999)</strong> — co-authored with Norm Smallwood, 
                linking leadership behaviors to stakeholder outcomes.
              </li>
              <li>
                <strong>The Why of Work (2010)</strong> — explored purpose and meaning as drivers of 
                engagement and performance.
              </li>
              <li>
                <strong>Victory Through Organization (2017)</strong> — emphasized that organizational 
                capability, not individual talent alone, creates lasting success.
              </li>
            </ul>
            <p className="echoes-paragraph">
              Across all his works, Ulrich insists that <strong>value is defined by the receiver</strong> — 
              whether the customer, investor, or employee.
            </p>
          </section>

          {/* Selected Quotes */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Selected Quotes</h2>
            <div className="echoes-quote-list">
              <blockquote className="echoes-inline-quote">
                "Leaders build value by building people who build value."
              </blockquote>
              <blockquote className="echoes-inline-quote">
                "The best HR professionals don't do HR for HR's sake — they do HR for the business's sake."
              </blockquote>
              <blockquote className="echoes-inline-quote">
                "If culture eats strategy for breakfast, then leadership serves both the meal."
              </blockquote>
            </div>
          </section>

          {/* Honours & Recognition */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Honours & Recognition</h2>
            <ul className="echoes-list">
              <li>Ranked multiple times in <strong>Thinkers 50</strong> list of the world's most influential management thinkers.</li>
              <li><strong>Lifetime Achievement Award</strong> from HR Magazine.</li>
              <li><strong>Fellow, National Academy of Human Resources.</strong></li>
              <li>Co-founder of <strong>The RBL Group</strong>, a global consulting firm advancing leadership and HR capability.</li>
            </ul>
          </section>

          {/* Legacy */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Legacy</h2>
            <p className="echoes-paragraph">
              Ulrich's ideas shaped how Fortune 500 companies design their people strategies. He bridged academia 
              and industry, proving that <strong>HR is the architect of value creation</strong> — aligning talent, 
              leadership, and culture with business goals.
            </p>
            <p className="echoes-paragraph">
              For today's young leaders, his message is timeless: <em>management begins with people, but endures 
              through purpose.</em>
            </p>
          </section>

          {/* Closing Reflection */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Closing Reflection</h2>
            <p className="echoes-paragraph">
              Dave Ulrich reminds every future leader that <strong>"human resources"</strong> are not a department — 
              they are the source of every achievement. Through ECHOES, his voice continues to inspire a generation 
              to see management not as control, but as connection — turning human potential into organizational greatness.
            </p>
          </section>

          {/* References */}
          <section className="echoes-section">
            <h2 className="echoes-heading">References</h2>
            <ol className="echoes-list list-decimal text-sm">
              <li>Ulrich, D. (1997). <em>Human Resource Champions</em>. Harvard Business School Press.</li>
              <li>Ulrich & Smallwood (1999). <em>Results-Based Leadership</em>. Harvard Business Review Press.</li>
              <li>Ulrich, D. (2010). <em>The Why of Work</em>. McGraw-Hill.</li>
              <li>Ulrich et al. (2017). <em>Victory Through Organization</em>. McGraw-Hill.</li>
              <li>Thinkers 50 profile (2023).</li>
              <li>HR Magazine Lifetime Achievement citation.</li>
            </ol>
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

export default DaveUlrichPage;
