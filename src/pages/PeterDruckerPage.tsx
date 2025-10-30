import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import symbolicImage from "@/assets/echoes-symbolic-drucker.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const PeterDruckerPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ECHOES – Peter F. Drucker | Teenagers Management Academy</title>
        <meta name="description" content="Biography and legacy of Peter F. Drucker, presented in the ECHOES series: The Messengers of Management." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Peter F. Drucker — The Visionary Who Taught the World How to Think
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={symbolicImage} 
                alt="Symbolic visual representing Peter F. Drucker's body of work"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "The best way to predict the future is to create it."
              <span className="echoes-quote-attrib">— Peter F. Drucker (1909–2005)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Peter Ferdinand Drucker</li>
            <li><strong>Born:</strong> 19 November 1909, Vienna, Austria</li>
            <li><strong>Died:</strong> 11 November 2005, Claremont, California, USA (aged 95)</li>
            <li><strong>Profession:</strong> Author, consultant, university professor, social philosopher</li>
            <li><strong>Field:</strong> Management theory, organizational behavior, leadership, social responsibility</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: Britannica, Library of Congress, Drucker Institute at Claremont Graduate University.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Peter Ferdinand Drucker was born on 19 November 1909 in Vienna. He grew up in a household where conversation, books, and debate were part of daily life.
          </p>
          <p className="echoes-paragraph">
            His father was a senior civil servant; his mother, a physician. The family home became a gathering place for intellectuals, and young Peter listened to discussions on philosophy, economics, and art.
          </p>
          <p className="echoes-paragraph">
            After briefly studying law in Hamburg, Drucker moved to Frankfurt, where he worked as a journalist and completed his doctorate in public and international law.
          </p>
          <p className="echoes-paragraph">
            When the Nazis came to power, Drucker emigrated to London, and later to the United States, where he began teaching and writing.
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">The Turning Point</h2>
          <p className="echoes-paragraph">
            Drucker's breakthrough came after his deep study of General Motors in the 1940s. He spent two years inside the company, observing how decisions were made and how people worked together.
          </p>
          <p className="echoes-paragraph">
            In 1946 he published <em>Concept of the Corporation</em>, a book that showed how large organizations function—and how leadership, structure, and values determine success.
          </p>
          <p className="echoes-paragraph">
            His work was revolutionary. He argued that management is not simply about giving orders—it is about creating conditions where people can contribute meaningfully.
          </p>
        </section>

        {/* TEACHER AND THINKER */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Teacher and Thinker</h2>
          <p className="echoes-paragraph">
            Over the following decades he taught at Bennington College, NYU, and Claremont Graduate University. He also worked as a consultant to major corporations, governments, and nonprofit organizations.
          </p>
          <p className="echoes-paragraph">
            He wrote 39 books, each grounded in observation and real experience, not academic theory alone. Titles such as <em>The Practice of Management</em> (1954), <em>The Effective Executive</em> (1967), and <em>Managing for Results</em> (1964) became essential reading for leaders worldwide.
          </p>
        </section>

        {/* SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Signature Ideas</h2>
          <p className="echoes-paragraph">
            Drucker believed that management is a liberal art: it unites economics, psychology, ethics, and responsibility. He argued that the purpose of business is to create and keep a customer, and that profit is the result of doing that well—not the only goal.
          </p>
          <p className="echoes-paragraph">
            He also stressed that leadership must focus on what needs to be done, not what is easy or popular. He asked leaders everywhere the same questions:
          </p>
          <blockquote className="echoes-inline-quote">
            "What is our mission?"<br />
            "Who is our customer?"<br />
            "What does the customer value?"
          </blockquote>
          <p className="echoes-paragraph">
            He taught that genuine results come from clarity, discipline, and integrity—not from shortcuts.
          </p>
          <blockquote className="echoes-inline-quote">
            "There is nothing so useless as doing efficiently that which should not be done at all."
          </blockquote>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">A Voice of Reflection</h2>
          <blockquote className="echoes-inline-quote">
            "Management is doing things right; leadership is doing the right things."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The best way to predict the future is to create it."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Time is the scarcest resource; unless it is managed, nothing else can be managed."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "The most important thing in communication is hearing what isn't said."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours and Recognition</h2>
          <p className="echoes-paragraph">
            In 2002, Peter Drucker received the Presidential Medal of Freedom, the highest civilian award in the United States.
          </p>
          <p className="echoes-paragraph">
            By the time of his passing in 2005 in Claremont, California, he was known worldwide as the father of modern management.
          </p>
          <p className="echoes-paragraph">
            His work inspired not only business leaders but also those working in education, healthcare, the military, and the nonprofit sector.
          </p>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Drucker taught that leadership is ultimately about people, purpose, and responsibility.
          </p>
          <p className="echoes-paragraph">
            His books and lectures continue to shape how organizations work, how leaders think, and how societies define progress.
          </p>
          <p className="echoes-paragraph">
            Long after his death, his influence remains alive in classrooms, boardrooms, and public institutions around the world.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Peter Drucker never looked for fame. He looked for clarity.
          </p>
          <p className="echoes-paragraph">
            He believed that the future belongs to those who understand people, not just systems.
          </p>
          <p className="echoes-paragraph">
            His work still asks every young leader the same question: What kind of future will you create?
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Peter F. Drucker — The Visionary Who Taught the World How to Think"
              description="Biography and legacy of Peter F. Drucker, presented in the ECHOES series: The Messengers of Management."
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

export default PeterDruckerPage;
