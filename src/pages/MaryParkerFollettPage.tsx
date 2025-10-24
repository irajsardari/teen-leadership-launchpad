import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import follettImage from "@/assets/echoes-symbolic-follett.jpg";

const MaryParkerFollettPage = () => {
  return (
    <article className="echoes-article">
      <Helmet>
        <title>ECHOES – Mary Parker Follett | Teenagers Management Academy</title>
        <meta name="description" content="The life and legacy of Mary Parker Follett (1868–1933), the prophet of collaboration and shared power, presented in the ECHOES series, The Messengers of Management." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
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
              Mary Parker Follett — The Prophet of Collaboration and Shared Power
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
              "Power is not a thing that one person seizes and another loses. Power is the ability to make things happen together."
            </blockquote>
            <p className="echoes-quote-attribution">
              — Mary Parker Follett (1868 – 1933)
            </p>
          </div>

          {/* Symbolic Image */}
          <div className="echoes-image-container">
            <img 
              src={follettImage} 
              alt="Symbolic representation of collaboration and shared power - overlapping circles representing community and integration"
              className="echoes-image"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Snapshot Section */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Snapshot</h2>
            <ul className="echoes-list">
              <li><strong>Full Name:</strong> Mary Parker Follett</li>
              <li><strong>Born:</strong> 3 September 1868, Quincy, Massachusetts, USA</li>
              <li><strong>Died:</strong> 18 December 1933, Boston, Massachusetts (aged 65)</li>
              <li><strong>Profession:</strong> Management consultant, political philosopher, organizational theorist</li>
              <li><strong>Major Works:</strong> <em>The New State</em> (1918), <em>Creative Experience</em> (1924), <em>Dynamic Administration</em> (1941 posthumous)</li>
              <li><strong>Known For:</strong> Pioneering concepts of participatory management, conflict resolution, and "power with" rather than "power over."</li>
            </ul>
            <p className="echoes-paragraph text-sm italic mt-4">
              (Sources: Harvard Business School Archives; Britannica; Library of Congress; Mary Parker Follett Foundation.)
            </p>
          </section>

          {/* Early Life */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Early Life & Influences</h2>
            <p className="echoes-paragraph">
              Follett was born in Quincy, Massachusetts, at a time when women had limited access to education. Determined and brilliant, she entered Radcliffe College (then Harvard's women's annex) where she studied government, philosophy, and political science. Although she completed all the requirements for a Ph.D., Harvard refused to grant degrees to women — a barrier she turned into motivation.
            </p>
            <p className="echoes-paragraph">
              Instead of giving up, she began studying communities: how people cooperate, how conflicts arise, and how democracy could work in everyday life. Her early experiences volunteering in Boston's working-class neighborhoods deeply influenced her belief that leadership is about integration, not domination.
            </p>
          </section>

          {/* Turning Point */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Turning Point</h2>
            <p className="echoes-paragraph">
              By the 1910s, Mary Parker Follett was already advising civic groups and political leaders, earning national attention for her lectures on "The New Democracy." After World War I, industrial organizations invited her to speak about leadership and conflict resolution.
            </p>
            <p className="echoes-paragraph">
              In 1925, she addressed a meeting of executives at the Taylor Society (the organization founded to honor Frederick Winslow Taylor). Her speech shocked them — she argued that "the most important work of the manager is not control, but integration." Instead of seeing conflict as a battle to win, she called it "the appearance of difference that can lead to a higher unity."
            </p>
            <p className="echoes-paragraph">
              Her ideas were so far ahead of their time that many would only be recognized decades later as the foundation of modern organizational behavior and HRM.
            </p>
          </section>

          {/* Major Works */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
            
            <h3 className="echoes-subheading">Key Publications:</h3>
            <ul className="echoes-list">
              <li><strong>The New State</strong> (1918) – How group organization can renew democracy.</li>
              <li><strong>Creative Experience</strong> (1924) – How cooperation and dialogue spark innovation.</li>
              <li><strong>Dynamic Administration</strong> (1941, edited posthumously by Metcalf & Urwick) – Collected lectures on management and leadership.</li>
            </ul>

            <h3 className="echoes-subheading">Core Ideas:</h3>
            <ol className="echoes-list list-decimal">
              <li><strong>Power With, Not Power Over</strong> — True leadership builds mutual empowerment.</li>
              <li><strong>The Law of the Situation</strong> — Let facts and context guide decisions, not hierarchy.</li>
              <li><strong>Integration in Conflict</strong> — Difference is not danger; it is the beginning of creativity.</li>
              <li><strong>Participatory Leadership</strong> — Everyone has something to contribute; management is a social process.</li>
              <li><strong>Organizations as Communities</strong> — She viewed the workplace as a living network of human relationships.</li>
            </ol>

            <p className="echoes-paragraph">
              Follett's language was simple but visionary: she spoke of co-creation and collective intelligence long before those words existed.
            </p>
          </section>

          {/* Selected Quotes */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Selected Quotes</h2>
            <div className="echoes-quote-list">
              <blockquote className="echoes-inline-quote">
                "The best leaders do not create followers; they create more leaders."
              </blockquote>
              <blockquote className="echoes-inline-quote">
                "Conflict is not to be avoided but to be used — as the raw material of progress."
              </blockquote>
              <blockquote className="echoes-inline-quote">
                "Unity, not uniformity, must be our aim."
              </blockquote>
              <blockquote className="echoes-inline-quote">
                "Leadership is not defined by the exercise of power but by the capacity to increase the sense of power among those led."
              </blockquote>
            </div>
          </section>

          {/* Honours */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Honours & Recognition</h2>
            <ul className="echoes-list">
              <li>Advisor to President Franklin D. Roosevelt on community organization and public administration.</li>
              <li>Invited speaker to executive groups including the Taylor Society and British Institute of Management.</li>
              <li>Her lectures at Harvard Business School were attended by future industrial leaders.</li>
              <li>Posthumously recognized as the "Mother of Modern Management" by management historians in the 1970s.</li>
            </ul>
          </section>

          {/* Legacy */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Legacy</h2>
            <p className="echoes-paragraph">
              Mary Parker Follett changed management by bringing inclusion and democracy into the heart of leadership. Her ideas about shared power and constructive conflict inspired generations of thinkers — from Douglas McGregor's Theory Y to Peter Drucker's concept of management as a liberal art.
            </p>
            <p className="echoes-paragraph">
              In a century that often rewarded command and control, she stood alone to say:
            </p>
            <blockquote className="echoes-inline-quote">
              "The world does not need more bosses. It needs partners in creation."
            </blockquote>
            <p className="echoes-paragraph">
              Her writing continues to influence leadership development, teamwork, and public service around the world.
            </p>
          </section>

          {/* Closing Reflection */}
          <section className="echoes-section">
            <h2 className="echoes-heading">Closing Reflection</h2>
            <p className="echoes-paragraph">
              Mary Parker Follett passed away in 1933, but her voice remains extraordinarily modern. She believed that leadership is not a position but a relationship — a continuous dialogue of listening and creating together.
            </p>
            <blockquote className="echoes-inline-quote">
              "We find the real self only in our relation to others."
            </blockquote>
            <p className="echoes-paragraph">
              Through ECHOES, her message endures — that every leader's true power is born not from control, but from connection.
            </p>
          </section>

        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="echoes-footer-nav">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="echoes-next-link">
            <a href="/voices/echoes">← Return to ECHOES Collection</a>
          </div>
        </div>
      </footer>
    </article>
  );
};

export default MaryParkerFollettPage;
