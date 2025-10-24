import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import scheinImage from "@/assets/echoes-symbolic-schein.jpg";

const EdgarScheinPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>Edgar H. Schein – The Architect of Organizational Culture | ECHOES | TMA</title>
        <meta name="description" content="Biography of Edgar H. Schein, the psychologist who revealed the three levels of organizational culture and pioneered the concept of humble inquiry in leadership." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 max-w-4xl">
        {/* Back Button */}
        <Link to="/voices/echoes" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to ECHOES
          </Button>
        </Link>

        {/* Header Section */}
        <header className="mb-12">
          <div className="inline-block px-4 py-1.5 bg-tma-red/10 text-tma-red rounded-full text-sm font-semibold mb-6">
            ECHOES
          </div>
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
            The Messengers of Management
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
            Edgar H. Schein — The Architect of Organizational Culture
          </h1>
        </header>

        {/* Quote Section */}
        <div className="mb-12 p-8 bg-gradient-to-br from-tma-navy/5 to-tma-blue/5 rounded-2xl border border-tma-navy/10">
          <blockquote className="text-xl md:text-2xl italic text-foreground leading-relaxed">
            "Culture is not just one aspect of the game — it is the game."
          </blockquote>
          <p className="mt-4 text-muted-foreground font-medium">
            — Edgar H. Schein (1928 – 2023)
          </p>
        </div>

        {/* Symbolic Image */}
        <figure className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src={scheinImage} 
            alt="Symbolic representation of organizational culture - three concentric layers representing Edgar H. Schein's model of artifacts, values, and underlying assumptions"
            className="w-full h-auto"
            loading="eager"
          />
        </figure>

        {/* Snapshot Section */}
        <section className="mb-12 p-8 bg-card rounded-2xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Snapshot</h2>
          <ul className="space-y-3 text-foreground/90">
            <li><strong>Full Name:</strong> Edgar Henry Schein</li>
            <li><strong>Born:</strong> 5 March 1928, Zurich, Switzerland</li>
            <li><strong>Died:</strong> 26 January 2023, Palo Alto, California (aged 94)</li>
            <li><strong>Profession:</strong> Psychologist, Professor of Management, Consultant</li>
            <li><strong>Affiliation:</strong> MIT Sloan School of Management (Professor Emeritus)</li>
            <li><strong>Major Works:</strong> <em>Organizational Culture and Leadership</em> (1985 → 2017 editions); <em>Process Consultation</em> series; <em>Humble Inquiry</em> (2013); <em>Humble Leadership</em> (2018)</li>
            <li><strong>Known For:</strong> The three-level model of organizational culture and the concept of "humble inquiry."</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground italic">
            (Sources: MIT Sloan Archives; Harvard Business Review; Academy of Management memorial collection.)
          </p>
        </section>

        {/* Early Life Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Early Life & Influences</h2>
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
            <p>
              Born in Zurich to a German father and Russian mother, Schein grew up in a multicultural home that sparked his lifelong interest in values and communication.
              He emigrated to the United States as a teenager, earning degrees in social psychology at the University of Chicago and Harvard.
              During his service in the U.S. Army in occupied Germany, he witnessed how culture shapes behavior — a lesson that later guided his theories about organizations as mini-societies.
            </p>
          </div>
        </section>

        {/* Turning Point Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Turning Point</h2>
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
            <p>
              In the 1950s and '60s, Schein joined MIT to study how people adapt to corporate life.
              He coined the term "organizational socialization" — how new employees absorb the values of their company.
              His research at Digital Equipment Corporation and other firms revealed that beneath every policy and procedure lies a set of invisible assumptions that govern behavior.
            </p>
            <p>
              This discovery led to his seminal book <em>Organizational Culture and Leadership</em> (1985), where he described three levels of culture:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Artifacts</strong> – visible structures, rituals, language</li>
              <li><strong>Espoused Values</strong> – what people say they believe</li>
              <li><strong>Underlying Assumptions</strong> – the deep, unquestioned beliefs that truly drive behavior</li>
            </ol>
          </div>
        </section>

        {/* Major Works Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Major Works & Signature Ideas</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-foreground">Key Publications:</h3>
            <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
              <li><em>Organizational Culture and Leadership</em> (1985–2017)</li>
              <li><em>Process Consultation</em> (1969, 1987, 1999)</li>
              <li><em>Career Anchors</em> (1990)</li>
              <li><em>Humble Inquiry</em> (2013)</li>
              <li><em>Humble Leadership</em> (2018, with Peter Schein)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Core Ideas:</h3>
            <ol className="list-decimal list-inside space-y-2 text-foreground/90 ml-4">
              <li><strong>Culture Lives Below the Surface.</strong> To change behavior, leaders must understand hidden assumptions.</li>
              <li><strong>Leadership Creates and Manages Culture.</strong> Every decision a leader makes teaches values.</li>
              <li><strong>Process Consultation.</strong> Helping is a relationship of inquiry and respect, not expertise and control.</li>
              <li><strong>Humble Inquiry.</strong> The art of asking genuine questions that build trust and learning.</li>
              <li><strong>Psychological Safety.</strong> Organizations must create environments where people feel safe to speak honestly.</li>
            </ol>
          </div>
        </section>

        {/* Selected Quotes Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Selected Quotes</h2>
          <div className="space-y-6">
            <blockquote className="pl-6 border-l-4 border-tma-blue text-lg italic text-foreground/90">
              "The only thing of real importance that leaders do is to create and manage culture."
            </blockquote>
            <blockquote className="pl-6 border-l-4 border-tma-blue text-lg italic text-foreground/90">
              "If you want to understand a culture, listen to its stories."
            </blockquote>
            <blockquote className="pl-6 border-l-4 border-tma-blue text-lg italic text-foreground/90">
              "Humble Inquiry is the gentle art of drawing someone out by asking questions to which you do not already know the answer."
            </blockquote>
            <blockquote className="pl-6 border-l-4 border-tma-blue text-lg italic text-foreground/90">
              "Learning starts with admitting that you don't already know."
            </blockquote>
          </div>
        </section>

        {/* Honours Section */}
        <section className="mb-12 p-8 bg-gradient-to-br from-tma-teal/5 to-tma-blue/5 rounded-2xl border border-tma-teal/10">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Honours & Recognition</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
            <li>Professor Emeritus, MIT Sloan School of Management</li>
            <li>Lifetime Achievement Award, Academy of Management (2009)</li>
            <li>Distinguished Scholar, Society for Industrial and Organizational Psychology</li>
            <li>Consultant to NASA, Digital Equipment Corp., and U.S. Department of Defense</li>
            <li>Founder of the Center for Organizational Learning with Peter Senge</li>
          </ul>
        </section>

        {/* Legacy Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Legacy</h2>
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
            <p>
              Edgar Schein taught the world that organizations are living cultures, not machines.
              His work on trust, learning, and helping laid the foundation for modern leadership development and psychological safety.
              He bridged psychology and management, showing that transformation begins with humility and conversation.
            </p>
            <p>
              Today, his son Peter Schein continues his legacy through the Humble Leadership Institute.
              Every time a leader asks not "What's wrong with you?" but "What am I not seeing?" — Schein's influence is alive.
            </p>
          </div>
        </section>

        {/* Closing Reflection */}
        <section className="mb-12 p-8 bg-gradient-to-r from-tma-navy/10 to-tma-blue/10 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Closing Reflection</h2>
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
            <p>
              Edgar Schein passed away in 2023, leaving behind a philosophy of leadership based on curiosity and respect.
              He believed that organizations grow only when people feel safe enough to learn.
            </p>
            <blockquote className="text-xl font-semibold italic text-center my-6">
              "To lead is to learn, and to learn is to listen."
            </blockquote>
            <p>
              Through ECHOES, his voice continues to remind young leaders that culture is not what you declare — it's what you practice every day.
            </p>
          </div>
        </section>

        {/* Navigation Footer */}
        <footer className="pt-8 border-t">
          <Link to="/voices/echoes">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to ECHOES Collection
            </Button>
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default EdgarScheinPage;
