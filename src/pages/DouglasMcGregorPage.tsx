import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import mcgregorImage from "@/assets/echoes-symbolic-mcgregor.jpg";

const DouglasMcGregorPage = () => {
  return (
    <article className="echoes-article">
      <Helmet>
        <title>Douglas McGregor – The Voice Who Taught the World How to See People at Work | ECHOES | TMA</title>
        <meta name="description" content="Biography and legacy of Douglas McGregor, creator of Theory X and Theory Y, who transformed management by teaching leaders to see people as capable partners in achievement." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      {/* Hero Section */}
      <header className="echoes-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="echoes-badge">
              The Messengers of Management
            </Badge>
            <h1 className="echoes-title">
              ECHOES
            </h1>
            <p className="echoes-subtitle">
              Douglas McGregor — The Voice Who Taught the World How to See People at Work
            </p>
          </div>
        </div>
      </header>

      {/* Quote Section */}
      <section className="echoes-quote-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <blockquote className="echoes-quote">
            <p className="echoes-quote-text">
              "The greatest barrier to progress in management is not ignorance — it's the illusion of knowledge."
            </p>
            <footer className="echoes-quote-author">
              — Douglas McGregor (1906 – 1964)
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Symbolic Image */}
      <section className="echoes-image-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <figure className="echoes-figure">
            <img 
              src={mcgregorImage} 
              alt="Symbolic representation: two arrows — one rigid and dark, one open and bright — converging toward a shared horizon, representing trust over control"
              className="echoes-image"
              loading="eager"
            />
            <figcaption className="echoes-caption">
              Symbolic representation: two arrows — one rigid and dark, one open and bright — converging toward a shared horizon, representing trust over control.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Biography Content */}
      <section className="echoes-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="echoes-content">
            
            {/* Snapshot */}
            <div className="echoes-section-block">
              <h2 className="echoes-heading">Snapshot</h2>
              <ul className="echoes-list">
                <li><strong>Full Name:</strong> Douglas Murray McGregor</li>
                <li><strong>Born:</strong> 16 September 1906, Detroit, Michigan, USA</li>
                <li><strong>Died:</strong> 1 October 1964, Massachusetts (aged 58)</li>
                <li><strong>Profession:</strong> Psychologist, Professor of Management, Organizational Behavior Pioneer</li>
                <li><strong>Major Work:</strong> <em>The Human Side of Enterprise</em> (1960)</li>
                <li><strong>Known For:</strong> Theory X and Theory Y — the two views of human motivation that reshaped leadership forever</li>
              </ul>
              <p className="echoes-paragraph italic text-sm mt-4">
                (Sources: MIT Sloan Archives; Harvard Business Review Library; Britannica.)
              </p>
            </div>

            {/* Early Life & Influences */}
            <div className="echoes-section-block">
              <h2 className="echoes-heading">Early Life & Influences</h2>
              <p className="echoes-paragraph">
                McGregor grew up in Detroit during the rise of American industry.
                While studying psychology at Wayne State University, he worked nights at a gas station owned by his family — an early lesson in how differently people respond to work and responsibility.
              </p>
              <p className="echoes-paragraph">
                He later earned a master's degree from Harvard and a doctorate from Massachusetts Institute of Technology (MIT), where he would spend much of his career.
                His early studies in social psychology made him question a simple but profound assumption:
              </p>
              <p className="echoes-paragraph italic">
                "What do managers really believe about the people who work for them?"
              </p>
            </div>

            {/* Turning Point */}
            <div className="echoes-section-block">
              <h2 className="echoes-heading">Turning Point</h2>
              <p className="echoes-paragraph">
                In the 1950s, McGregor became president of Antioch College in Ohio, a progressive university that trusted students with real responsibility for governing the campus.
                There he witnessed how trust created initiative and innovation — the same principles he would soon bring to management theory.
              </p>
              <p className="echoes-paragraph">
                Returning to MIT's Sloan School of Management, he condensed years of observation into his classic book <em>The Human Side of Enterprise</em> (1960).
                In it, he introduced two contrasting mental models of management that continue to shape leadership today.
              </p>
            </div>

            {/* Major Works & Signature Ideas */}
            <div className="echoes-section-block">
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

              <p className="echoes-paragraph mt-4">
                McGregor's writing was calm, clear, and deeply human. He did not preach revolution — he simply asked managers to see people as capable partners in achievement.
              </p>
            </div>

            {/* Selected Quotes */}
            <div className="echoes-section-block">
              <h2 className="echoes-heading">Selected Quotes</h2>
              <blockquote className="echoes-blockquote">
                "If human beings are to be managed effectively, they must first be seen as human beings."
              </blockquote>
              <blockquote className="echoes-blockquote">
                "People have a deep need to exercise their own initiative and responsibility."
              </blockquote>
              <blockquote className="echoes-blockquote">
                "The success of management depends more on its philosophy of human nature than on its techniques."
              </blockquote>
              <blockquote className="echoes-blockquote">
                "The manager's real job is not to control people, but to unleash their potential."
              </blockquote>
            </div>

            {/* Honours & Recognition */}
            <div className="echoes-section-block">
              <h2 className="echoes-heading">Honours & Recognition</h2>
              <ul className="echoes-list">
                <li>Served as Professor of Industrial Relations at MIT Sloan School of Management</li>
                <li>Consultant for General Electric, Union Carbide, and U.S. government agencies</li>
                <li>Founding influence on Human Relations and Organizational Behavior programs worldwide</li>
                <li>Honored posthumously by the Academy of Management for pioneering humanistic leadership education</li>
              </ul>
            </div>

            {/* Legacy */}
            <div className="echoes-section-block">
              <h2 className="echoes-heading">Legacy</h2>
              <p className="echoes-paragraph">
                Douglas McGregor shifted management philosophy from compliance to trust.
                He proved that productivity and human dignity are not opposites but partners.
                His Theory X and Theory Y sparked the development of motivation science, influencing Herzberg's Two-Factor Theory, Maslow's Hierarchy in practice, and later the concept of empowerment in modern HR.
              </p>
              <p className="echoes-paragraph">
                He reminded leaders that every management system is a mirror of its assumptions about people.
              </p>
            </div>

            {/* Closing Reflection */}
            <div className="echoes-section-block">
              <h2 className="echoes-heading">Closing Reflection</h2>
              <p className="echoes-paragraph">
                Douglas McGregor passed away suddenly in 1964, but his ideas still guide the best leaders of the modern world.
                He believed that a manager's greatest choice is not what strategy to follow, but what belief to hold about human nature.
              </p>
              <blockquote className="echoes-blockquote">
                "The task of management is to arrange conditions so that people can achieve their own goals best by directing their efforts toward organizational objectives."
              </blockquote>
              <p className="echoes-paragraph">
                Through ECHOES, his voice continues to teach a new generation that leadership begins with trust.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className="echoes-footer">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="group/btn text-white hover:text-white/80" 
            asChild
          >
            <Link to="/voices/echoes" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover/btn:-translate-x-1 transition-transform duration-200" />
              Back to ECHOES
            </Link>
          </Button>
        </div>
      </footer>
    </article>
  );
};

export default DouglasMcGregorPage;
