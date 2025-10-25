import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import kahnemanImage from "@/assets/echoes-symbolic-kahneman.jpg";

const DanielKahnemanPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>Daniel Kahneman – The Psychologist Who Measured How the Mind Decides | ECHOES | TMA</title>
        <meta name="description" content="Biography of Daniel Kahneman, Nobel Prize-winning psychologist who revealed how cognitive biases shape decision-making and founded behavioral economics." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-r from-tma-navy to-tma-blue">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Badge className="mb-6 bg-tma-red text-white hover:bg-tma-red/90">
              ECHOES – The Messengers of Management
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white font-inter">
              Daniel Kahneman
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/90 font-inter font-medium italic">
              The Psychologist Who Measured How the Mind Decides
            </p>

            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl mb-8">
              <img 
                src={kahnemanImage} 
                alt="Symbolic representation of dual thinking systems - fast and slow"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>

            <blockquote className="text-lg md:text-xl text-white/95 italic border-l-4 border-tma-red pl-6 py-2">
              "Nothing in life is as important as you think it is while you are thinking about it."
              <footer className="text-white/80 mt-2 not-italic">— Daniel Kahneman (1934 – 2024)</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-12">
            
            {/* Snapshot */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                  Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Full Name:</strong> Daniel Kahneman</li>
                  <li><strong className="text-foreground">Born:</strong> 5 March 1934, Tel Aviv, Israel  |  <strong className="text-foreground">Died:</strong> 27 March 2024, New York, USA</li>
                  <li><strong className="text-foreground">Profession:</strong> Psychologist, economist, author</li>
                  <li><strong className="text-foreground">Affiliation:</strong> Princeton University | Hebrew University of Jerusalem | UC Berkeley</li>
                  <li><strong className="text-foreground">Major Works:</strong> <em>Thinking, Fast and Slow</em> (2011); Nobel Prize in Economic Sciences (2002 with Amos Tversky)</li>
                  <li><strong className="text-foreground">Known For:</strong> Behavioral Economics, Prospect Theory, Cognitive Bias research</li>
                </ul>
                <p className="text-sm italic mt-4 text-muted-foreground">
                  (Sources: Princeton University archives; Nobel Prize Foundation; The Behavioral Science Journal.)
                </p>
              </CardContent>
            </Card>

            {/* Early Life & Influences */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                  Early Life & Influences
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Kahneman was born in Tel Aviv and raised partly in France during World War II, where he experienced human behavior at its most irrational and resilient. He earned a psychology degree from the Hebrew University of Jerusalem and a PhD from UC Berkeley.
                </p>
                <p>
                  During his military service in Israel, he worked on personnel selection and assessment — where he began noticing how biases and intuition shaped even expert judgment. That curiosity would define his life's work: <em>Why do smart people make predictable mistakes?</em>
                </p>
              </CardContent>
            </Card>

            {/* Turning Point */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                  Turning Point
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  In the late 1960s, Kahneman met Amos Tversky, a brilliant cognitive psychologist. Their partnership became legendary — a fusion of precision and imagination that produced a new science: <strong className="text-foreground">Behavioral Economics</strong>.
                </p>
                <p>
                  In 1979 they published <em>Prospect Theory</em>, proving that people do not make rational decisions; they fear losses more than they value gains, and their choices depend on how options are framed. Their research dismantled the classical view of humans as "rational actors" and changed economics forever.
                </p>
                <p>
                  Decades later, Kahneman gathered their insights into <em>Thinking, Fast and Slow</em> (2011), explaining the two systems of thought:
                </p>
                <ul>
                  <li><strong className="text-foreground">System 1:</strong> Fast, intuitive, automatic — our first reactions.</li>
                  <li><strong className="text-foreground">System 2:</strong> Slow, deliberate, analytical — our second thoughts.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Major Works & Signature Ideas */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                  Major Works & Signature Ideas
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none text-muted-foreground">
                <h3 className="text-xl font-semibold text-foreground mt-6">Key Publications</h3>
                <ul>
                  <li><em>Prospect Theory</em> (1979, with Tversky)</li>
                  <li><em>Judgment under Uncertainty: Heuristics and Biases</em> (1982)</li>
                  <li><em>Thinking, Fast and Slow</em> (2011)</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mt-6">Core Ideas</h3>
                <ol>
                  <li><strong className="text-foreground">Two Systems of Thinking:</strong> Fast intuition vs. slow reason.</li>
                  <li><strong className="text-foreground">Heuristics and Biases:</strong> Mental shortcuts that distort judgment.</li>
                  <li><strong className="text-foreground">Prospect Theory:</strong> People fear losses twice as much as they value gains.</li>
                  <li><strong className="text-foreground">Framing Effect:</strong> Decisions change based on presentation, not content.</li>
                  <li><strong className="text-foreground">Anchoring & Availability:</strong> We judge based on what comes easily to mind.</li>
                </ol>
              </CardContent>
            </Card>

            {/* Selected Quotes */}
            <Card className="bg-gradient-to-br from-tma-navy/5 to-tma-blue/5 backdrop-blur-sm border border-tma-navy/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                  Selected Quotes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <blockquote className="border-l-4 border-tma-blue pl-4 italic text-lg text-muted-foreground">
                  "We are blind to our blindness. We have very little idea of how little we know."
                </blockquote>
                <blockquote className="border-l-4 border-tma-blue pl-4 italic text-lg text-muted-foreground">
                  "Intuition is nothing more and nothing less than recognition."
                </blockquote>
                <blockquote className="border-l-4 border-tma-blue pl-4 italic text-lg text-muted-foreground">
                  "A reliable way to make people believe in falsehoods is frequent repetition."
                </blockquote>
                <blockquote className="border-l-4 border-tma-blue pl-4 italic text-lg text-muted-foreground">
                  "True intuitive expertise is learned from prolonged experience with good feedback."
                </blockquote>
              </CardContent>
            </Card>

            {/* Honours & Recognition */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                  Honours & Recognition
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none text-muted-foreground">
                <ul>
                  <li>Nobel Prize in Economic Sciences (2002)</li>
                  <li>Presidential Medal of Freedom, USA (2013)</li>
                  <li>Co-founder, Behavioral Insights Team in public policy</li>
                  <li>Ranked among the most cited psychologists of all time</li>
                  <li><em>Thinking, Fast and Slow</em> translated into 40+ languages</li>
                </ul>
              </CardContent>
            </Card>

            {/* Legacy */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                  Legacy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Daniel Kahneman replaced the myth of the "rational manager" with the reality of the human thinker. His research gave birth to fields as diverse as behavioral finance, risk management, public policy, and decision science.
                </p>
                <p>
                  Executives, judges, investors, and teachers now learn to slow down, challenge assumptions, and test their intuition. Every time a leader pauses and asks, <em>"Am I deciding or reacting?"</em> — Kahneman's voice is there.
                </p>
              </CardContent>
            </Card>

            {/* Closing Reflection */}
            <Card className="bg-gradient-to-r from-tma-navy/10 to-tma-blue/10 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                  Closing Reflection
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  Kahneman spent his life reminding us that wisdom begins in humility. He believed that by recognizing our mental shortcuts, we can build fairer systems, better leadership, and wiser societies.
                </p>
                <blockquote className="border-l-4 border-tma-red pl-6 italic text-xl my-6">
                  "We can be blind to the obvious, and we are also blind to our blindness."
                </blockquote>
                <p>
                  Through <strong className="text-foreground">ECHOES</strong>, his voice reminds young leaders that self-awareness is not only emotional — it is cognitive: the art of thinking about how we think.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link to="/voices/echoes">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to ECHOES Collection
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default DanielKahnemanPage;
