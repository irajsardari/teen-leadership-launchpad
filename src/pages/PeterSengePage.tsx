import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import sengeImage from "@/assets/echoes-symbolic-senge.jpg";

const PeterSengePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>Peter M. Senge – The Visionary Who Taught the World to Think in Systems | ECHOES | TMA</title>
        <meta name="description" content="The biography and legacy of Peter M. Senge, systems scientist and author of The Fifth Discipline, who introduced the world to learning organizations and systems thinking." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 bg-gradient-to-r from-tma-navy to-tma-blue">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/voices/echoes">
            <Button variant="ghost" className="mb-6 text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to ECHOES
            </Button>
          </Link>
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-4 bg-tma-red text-white hover:bg-tma-red/90">
              ECHOES
            </Badge>
            <p className="text-lg md:text-xl mb-2 text-white/90">
              The Messengers of Management
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          
          {/* Title */}
          <header className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Peter M. Senge
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground italic">
              The Visionary Who Taught the World to Think in Systems
            </p>
          </header>

          {/* Opening Quote */}
          <blockquote className="border-l-4 border-tma-blue pl-6 mb-12 italic text-lg text-muted-foreground">
            "Today's problems come from yesterday's solutions."
            <footer className="mt-2 text-sm not-italic">
              — Peter M. Senge (b. 1947)
            </footer>
          </blockquote>

          {/* Symbolic Image */}
          <figure className="mb-12 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={sengeImage} 
              alt="Symbolic representation of systems thinking with interconnected circles and feedback loops"
              loading="eager"
              className="w-full h-auto"
            />
          </figure>

          {/* Snapshot */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Snapshot</h2>
            <ul className="space-y-2 text-base leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">Full Name:</strong> Peter Michael Senge</li>
              <li><strong className="text-foreground">Born:</strong> 1947, Stanford, California, USA</li>
              <li><strong className="text-foreground">Profession:</strong> Systems scientist, organizational theorist, educator</li>
              <li><strong className="text-foreground">Affiliation:</strong> MIT Sloan School of Management (Senior Lecturer); Founder, Society for Organizational Learning (SoL)</li>
              <li><strong className="text-foreground">Major Work:</strong> <em>The Fifth Discipline: The Art and Practice of the Learning Organization</em> (1990)</li>
              <li><strong className="text-foreground">Known For:</strong> Systems Thinking, Learning Organizations, Shared Vision, and Collective Intelligence</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4 italic">
              (Sources: MIT Sloan Archives; Harvard Business Review; Society for Organizational Learning records.)
            </p>
          </section>

          {/* Early Life & Influences */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Early Life & Influences</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Peter Senge grew up in California during the age of scientific optimism and social change.
                He studied engineering at Stanford University, systems dynamics at MIT, and philosophy at Harvard — blending logic with curiosity about human behavior.
              </p>
              <p>
                In the 1970s, under mentor Jay Forrester, founder of system dynamics, Senge learned to model complex feedback loops in industrial and social systems. But he soon realized that the same patterns that govern machines also shape human organizations.
                He began asking:
              </p>
              <p className="italic pl-6 border-l-2 border-tma-blue">
                "Why do well-intentioned organizations fail to learn?"
              </p>
            </div>
          </section>

          {/* Turning Point */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Turning Point</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Senge's breakthrough came with the 1990 publication of <em>The Fifth Discipline</em>, which introduced the idea of the <strong>Learning Organization</strong> — a place where people continually expand their capacity to create desired results, nurture new thinking patterns, and learn together.
              </p>
              <p>
                He called <strong>systems thinking</strong> the fifth discipline, uniting the other four into a coherent whole:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-4">
                <li><strong>Personal Mastery</strong> – growth of individual purpose and capability</li>
                <li><strong>Mental Models</strong> – awareness of ingrained assumptions</li>
                <li><strong>Shared Vision</strong> – collective purpose that inspires</li>
                <li><strong>Team Learning</strong> – dialogue that turns insight into action</li>
                <li><strong>Systems Thinking</strong> – understanding interdependence and feedback</li>
              </ol>
              <p>
                The book became an international bestseller, translated into more than 30 languages, and reshaped leadership development worldwide.
              </p>
            </div>
          </section>

          {/* Major Works & Signature Ideas */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Major Works & Signature Ideas</h2>
            
            <h3 className="text-xl font-semibold mb-4 text-foreground">Key Publications:</h3>
            <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
              <li><em>The Fifth Discipline</em> (1990)</li>
              <li><em>The Fifth Discipline Fieldbook</em> (1994, with Kleiner et al.)</li>
              <li><em>Presence</em> (2004, with Jaworski, Scharmer & Flowers)</li>
              <li><em>The Necessary Revolution</em> (2008)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-foreground">Core Ideas:</h3>
            <ol className="list-decimal list-inside space-y-3 text-base leading-relaxed text-muted-foreground">
              <li><strong className="text-foreground">Systems Thinking</strong> – every action creates feedback; seeing the whole prevents blame and fragmentation.</li>
              <li><strong className="text-foreground">Learning Organization</strong> – organizations survive by learning faster than their environment changes.</li>
              <li><strong className="text-foreground">Shared Vision</strong> – purpose must be co-created, not imposed.</li>
              <li><strong className="text-foreground">Personal Mastery</strong> – leadership begins with self-discipline and continual growth.</li>
              <li><strong className="text-foreground">Interconnected World</strong> – business, ecology, and society form one living system.</li>
            </ol>
          </section>

          {/* Selected Quotes */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Selected Quotes</h2>
            <div className="space-y-6">
              <blockquote className="border-l-4 border-tma-blue pl-6 italic text-lg text-muted-foreground">
                "The only sustainable competitive advantage is your organization's ability to learn faster than the competition."
              </blockquote>
              <blockquote className="border-l-4 border-tma-blue pl-6 italic text-lg text-muted-foreground">
                "Systems thinking is a discipline for seeing wholes — for seeing patterns of change rather than static snapshots."
              </blockquote>
              <blockquote className="border-l-4 border-tma-blue pl-6 italic text-lg text-muted-foreground">
                "People don't resist change; they resist being changed."
              </blockquote>
              <blockquote className="border-l-4 border-tma-blue pl-6 italic text-lg text-muted-foreground">
                "Learning is not compulsory… neither is survival."
              </blockquote>
            </div>
          </section>

          {/* Honours & Recognition */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Honours & Recognition</h2>
            <ul className="list-disc list-inside space-y-2 text-base leading-relaxed text-muted-foreground">
              <li>Senior Lecturer, MIT Sloan School of Management</li>
              <li>Founder, Society for Organizational Learning (SoL), now global in 35+ countries</li>
              <li>Thinkers50 Lifetime Achievement Award (2015)</li>
              <li>Advisor to UN Global Compact, World Bank, and numerous corporations on sustainability and learning</li>
              <li>Recognized among the Top Management Thinkers of the 20th Century by Financial Times</li>
            </ul>
          </section>

          {/* Legacy */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Legacy</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Peter Senge changed the vocabulary of leadership.
                He shifted focus from control to connection, from blame to feedback, from competition to collaboration.
                His learning organization model became the foundation for modern leadership development, sustainability strategies, and educational reform.
              </p>
              <p>
                In classrooms, boardrooms, and NGOs worldwide, his influence encourages reflection, dialogue, and systems awareness.
                Every time a leader asks, "What are the patterns behind this problem?" — Senge's spirit is present.
              </p>
            </div>
          </section>

          {/* Closing Reflection */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Closing Reflection</h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Peter Senge continues to teach and write from MIT, reminding the world that genuine progress requires learning at every level.
                He believes that the greatest revolution of our time is internal — a shift from reactive thinking to systemic awareness.
              </p>
              <blockquote className="border-l-4 border-tma-blue pl-6 my-6 italic text-lg">
                "We can only transform the world if we first transform how we see it."
              </blockquote>
              <p>
                Through <strong>ECHOES</strong>, his voice guides future leaders to look beyond symptoms, trace connections, and act with wisdom.
              </p>
            </div>
          </section>

          {/* Back Button */}
          <div className="mt-16 text-center">
            <Link to="/voices/echoes">
              <Button variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to ECHOES Collection
              </Button>
            </Link>
          </div>

        </div>
      </article>
    </div>
  );
};

export default PeterSengePage;
