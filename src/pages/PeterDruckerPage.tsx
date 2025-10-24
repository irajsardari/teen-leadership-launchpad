import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import symbolicImage from "@/assets/echoes-symbolic-drucker.jpg";

const PeterDruckerPage = () => {
  const { slug } = useParams();
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ECHOES – Peter F. Drucker | Teenagers Management Academy</title>
        <meta name="description" content="Biography and legacy of Peter F. Drucker, presented in the ECHOES series: The Messengers of Management." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      {/* Header Navigation */}
      <section className="bg-tma-navy text-white py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80 hover:bg-white/10" 
            asChild
          >
            <Link to="/voices/echoes" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to ECHOES
            </Link>
          </Button>
        </div>
      </section>

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-tma-navy to-tma-navy/90 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <div className="text-sm font-semibold tracking-widest uppercase text-tma-red">
                ECHOES
              </div>
              <div className="text-sm font-light tracking-wide text-white/80">
                The Messengers of Management
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-inter tracking-tight leading-tight">
              Peter F. Drucker — The Visionary Who Taught the World How to Think
            </h1>

            {/* Symbolic Image */}
            <figure className="my-12">
              <img 
                src={symbolicImage}
                alt="Symbolic visual representing Peter F. Drucker's body of work"
                className="rounded-lg shadow-2xl max-w-2xl w-full mx-auto"
              />
            </figure>

            {/* Signature Quote */}
            <blockquote className="text-xl md:text-2xl font-light italic leading-relaxed pt-8">
              <div className="mb-4">
                "The best way to predict the future is to create it."
              </div>
              <cite className="text-base not-italic text-white/70">
                — Peter F. Drucker (1909–2005)
              </cite>
            </blockquote>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8 text-foreground leading-relaxed">
              
              {/* Early Life & Influences */}
              <section className="echoes-section mt-8">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Early Life & Influences</h2>
                <p className="echoes-paragraph mb-6">
                  Peter Ferdinand Drucker was born on 19 November 1909 in Vienna. He grew up in a household where conversation, books, and debate were part of daily life. His father, a senior government economist, regularly hosted gatherings where intellectuals, artists, and policymakers discussed the future of Europe.
                </p>
                <p className="echoes-paragraph mb-6">
                  Drucker witnessed firsthand the collapse of the Austro-Hungarian Empire, the rise of totalitarianism, and the fragility of institutions. These experiences taught him that societies depend not just on systems, but on how people within those systems think and act.
                </p>
                <p className="echoes-paragraph">
                  He studied law at the University of Frankfurt and worked as a journalist in Germany and London during the 1930s. It was during this time that he observed how businesses and governments made decisions — often without understanding the human consequences.
                </p>
              </section>

              {/* The Turning Point */}
              <section className="echoes-section mt-16">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">The Turning Point</h2>
                <p className="echoes-paragraph mb-6">
                  Drucker's breakthrough came after his deep study of General Motors in the 1940s. Unlike other consultants who focused only on efficiency and production numbers, Drucker examined the organization as a living system of people, decisions, and responsibilities.
                </p>
                <p className="echoes-paragraph mb-6">
                  His 1946 book <em>The Concept of the Corporation</em> argued that businesses could only succeed if they respected workers as thinking individuals with dignity and purpose — not merely as tools for profit. This insight was revolutionary.
                </p>
                <p className="echoes-paragraph">
                  For the first time, management was seen not as a mechanical process, but as a human discipline requiring judgment, ethics, and respect.
                </p>
              </section>

              {/* Teacher and Thinker */}
              <section className="echoes-section mt-16">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Teacher and Thinker</h2>
                <p className="echoes-paragraph mb-6">
                  Over the following decades, Drucker taught at Bennington College, New York University, and eventually at Claremont Graduate University in California. His courses were not about formulas — they were about asking better questions.
                </p>
                <p className="echoes-paragraph mb-6">
                  He consulted for multinational corporations, nonprofits, hospitals, and government agencies. Wherever he went, he insisted that the role of a manager is not to command, but to enable others to contribute their strengths.
                </p>
                <p className="echoes-paragraph">
                  Drucker believed that management was a liberal art — it required knowledge of economics, psychology, history, and ethics all at once.
                </p>
              </section>

              {/* Signature Ideas */}
              <section className="echoes-section mt-16">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Signature Ideas</h2>
                <p className="echoes-paragraph mb-6">
                  Drucker believed that management is a liberal art: it unites economics, psychology, ethics, and responsibility. He argued that the purpose of business is to create and keep a customer, and that profit is the result of doing that well — not the only goal.
                </p>
                <p className="echoes-paragraph mb-6">
                  He introduced concepts that are now fundamental:
                </p>
                <ul className="list-disc pl-6 space-y-3 mb-6">
                  <li><strong>Management by Objectives (MBO):</strong> aligning individual goals with organizational purpose.</li>
                  <li><strong>The Knowledge Worker:</strong> recognizing that people who think are the most valuable assets.</li>
                  <li><strong>Decentralization:</strong> pushing decision-making closer to where the work happens.</li>
                  <li><strong>Effectiveness over Efficiency:</strong> doing the right things matters more than doing things fast.</li>
                  <li><strong>The Importance of Questions:</strong> "What is our mission?" "What does the customer value?"</li>
                </ul>
                <blockquote className="echoes-inline-quote p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic mb-6">
                  <p>"There is nothing so useless as doing efficiently that which should not be done at all."</p>
                </blockquote>
                <p className="echoes-paragraph">
                  His work reminded leaders that success is not measured by control, but by contribution.
                </p>
              </section>

              {/* A Voice of Reflection (Quotes) */}
              <section className="echoes-section mt-16">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">A Voice of Reflection</h2>
                <p className="echoes-paragraph mb-8">
                  Throughout his life, Drucker offered insights that remain as relevant today as when he first spoke them. Here are some of his most enduring reflections:
                </p>
                <blockquote className="p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic mb-6">
                  <p>"Management is doing things right; leadership is doing the right things."</p>
                </blockquote>
                <blockquote className="p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic mb-6">
                  <p>"The most important thing in communication is hearing what isn't said."</p>
                </blockquote>
                <blockquote className="p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic mb-6">
                  <p>"Knowledge has to be improved, challenged, and increased constantly, or it vanishes."</p>
                </blockquote>
                <blockquote className="p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic mb-6">
                  <p>"Follow effective action with quiet reflection. From the quiet reflection will come even more effective action."</p>
                </blockquote>
              </section>

              {/* Honours and Recognition */}
              <section className="echoes-section mt-16">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Honours and Recognition</h2>
                <p className="echoes-paragraph mb-6">
                  In 2002, Peter Drucker received the Presidential Medal of Freedom, the highest civilian award in the United States. By the time of his passing in 2005 in Claremont, California, he was known worldwide as the father of modern management.
                </p>
                <p className="echoes-paragraph mb-6">
                  Universities, business schools, and research centers around the world bear his name. His books have been translated into more than 30 languages. Leaders from every sector — business, education, government, and nonprofits — continue to study his work.
                </p>
                <p className="echoes-paragraph">
                  More than awards, however, Drucker's true legacy is in the countless individuals he inspired to lead with integrity, ask meaningful questions, and treat people with dignity.
                </p>
              </section>

              {/* Legacy */}
              <section className="echoes-section mt-16">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Legacy</h2>
                <p className="echoes-paragraph mb-6">
                  Drucker taught that leadership is ultimately about people, purpose, and responsibility. His books and lectures continue to shape how organizations work, how leaders think, and how societies define progress.
                </p>
                <p className="echoes-paragraph mb-6">
                  He showed that management is not just a profession — it is a way of thinking about how we organize ourselves to achieve something meaningful together.
                </p>
                <p className="echoes-paragraph">
                  Nearly every MBA program in the world begins with his principles. His ideas remain foundational to understanding how organizations can serve humanity rather than control it.
                </p>
              </section>

              {/* Closing Reflection */}
              <section className="echoes-section echoes-closing mt-16 p-8 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 rounded-lg border border-tma-navy/20">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Closing Reflection</h2>
                <p className="echoes-paragraph text-lg">
                  Peter Drucker never looked for fame. He looked for clarity. He believed that the future belongs to those who understand people, not just systems. His work still asks every young leader the same question: What kind of future will you create?
                </p>
              </section>

            </div>
          </div>

          {/* Next in Series */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Next in ECHOES</p>
                <p className="text-lg font-medium text-muted-foreground">Coming Soon...</p>
              </div>
              <Button 
                variant="outline"
                asChild
              >
                <Link to="/voices/echoes">
                  View All Profiles
                </Link>
              </Button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="italic">
              <strong>Disclaimer:</strong> This biography is presented for educational purposes, celebrating the contributions 
              of management pioneers to inspire the next generation of leaders at TMA.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PeterDruckerPage;
