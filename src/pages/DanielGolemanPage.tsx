import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import golemanImage from "@/assets/echoes-symbolic-goleman.jpg";

const DanielGolemanPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>Daniel Goleman – The Psychologist Who Made Emotions Intelligent | ECHOES | TMA</title>
        <meta name="description" content="Biography of Daniel Goleman, psychologist who popularized Emotional Intelligence (EQ) and showed that success depends on self-awareness, empathy, and emotional mastery." />
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
              Daniel Goleman
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/90 font-inter font-medium italic">
              The Psychologist Who Made Emotions Intelligent
            </p>

            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl mb-8">
              <img 
                src={golemanImage} 
                alt="Symbolic representation of heart and brain connected - emotional intelligence"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>

            <blockquote className="text-lg md:text-xl text-white/95 italic border-l-4 border-tma-red pl-6 py-2">
              "What really matters for success, character, happiness, and life-long achievements is a definite set of emotional skills — your EQ."
              <footer className="text-white/80 mt-2 not-italic">— Daniel Goleman (b. 1946)</footer>
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
                  <li><strong className="text-foreground">Full Name:</strong> Daniel Goleman</li>
                  <li><strong className="text-foreground">Born:</strong> 7 March 1946, Stockton, California, USA</li>
                  <li><strong className="text-foreground">Profession:</strong> Psychologist, science journalist, author, lecturer</li>
                  <li><strong className="text-foreground">Affiliation:</strong> Harvard University (PhD in Psychology); New York Times science writer; Founder, Consortium for Research on Emotional Intelligence in Organizations</li>
                  <li><strong className="text-foreground">Major Works:</strong> <em>Emotional Intelligence</em> (1995), <em>Working with Emotional Intelligence</em> (1998), <em>Primal Leadership</em> (2002, with Boyatzis & McKee), <em>Focus</em> (2013)</li>
                  <li><strong className="text-foreground">Known For:</strong> Popularizing the concept of Emotional Intelligence (EQ) and linking it to leadership performance</li>
                </ul>
                <p className="text-sm italic mt-4 text-muted-foreground">
                  (Sources: Harvard Gazette; American Psychological Association; Consortium for EI archives.)
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
                  Goleman grew up in a family of teachers and psychologists in California, developing curiosity about emotion and morality from an early age. After earning his PhD from Harvard, he joined <em>Psychology Today</em> and later <em>The New York Times</em>, where he translated complex brain research into clear public language.
                </p>
                <p>
                  While studying emotional development under mentors such as David McClelland and Richard Boyatzis, he saw that intelligence alone did not predict success — self-management and empathy did.
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
                  In 1995, Goleman published <em>Emotional Intelligence</em>, summarizing decades of neuroscience and psychology into one revolutionary idea: that our emotional competence matters as much as IQ. The book became a worldwide bestseller and shifted the paradigm of education and leadership training.
                </p>
                <p>
                  He defined five core components of Emotional Intelligence:
                </p>
                <ol>
                  <li><strong className="text-foreground">Self-Awareness</strong> – recognizing one's emotions and their effects</li>
                  <li><strong className="text-foreground">Self-Regulation</strong> – managing impulses and stress constructively</li>
                  <li><strong className="text-foreground">Motivation</strong> – driving oneself with purpose beyond status or money</li>
                  <li><strong className="text-foreground">Empathy</strong> – understanding others' feelings and perspectives</li>
                  <li><strong className="text-foreground">Social Skill</strong> – building trust and influence through relationships</li>
                </ol>
                <p>
                  In <em>Working with Emotional Intelligence</em> (1998) he applied these principles to the workplace, and in <em>Primal Leadership</em> (2002) he showed how emotional resonance creates extraordinary leaders.
                </p>
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
                <h3 className="text-xl font-semibold text-foreground mt-6">Key Books</h3>
                <ul>
                  <li><em>Emotional Intelligence</em> (1995)</li>
                  <li><em>Working with Emotional Intelligence</em> (1998)</li>
                  <li><em>Primal Leadership</em> (2002, with Boyatzis & McKee)</li>
                  <li><em>Social Intelligence</em> (2006)</li>
                  <li><em>Focus</em> (2013)</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mt-6">Core Ideas</h3>
                <ol>
                  <li><strong className="text-foreground">EQ over IQ.</strong> Emotional skills predict two-thirds of leadership success.</li>
                  <li><strong className="text-foreground">Resonant Leadership.</strong> Leaders set emotional tone; their mood spreads faster than their orders.</li>
                  <li><strong className="text-foreground">Neuroscience of Empathy.</strong> The brain is wired for connection through mirror neurons.</li>
                  <li><strong className="text-foreground">Attention and Focus.</strong> Sustained focus is the foundation of self-control and ethics.</li>
                  <li><strong className="text-foreground">Emotional Balance.</strong> Performance depends on managing stress, not avoiding it.</li>
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
                  "IQ and technical skills matter, but emotional intelligence matters more."
                </blockquote>
                <blockquote className="border-l-4 border-tma-blue pl-4 italic text-lg text-muted-foreground">
                  "The leader's mood is contagious; it spreads through the organization like electric current."
                </blockquote>
                <blockquote className="border-l-4 border-tma-blue pl-4 italic text-lg text-muted-foreground">
                  "If you cannot manage your own emotions, how can you manage those of others?"
                </blockquote>
                <blockquote className="border-l-4 border-tma-blue pl-4 italic text-lg text-muted-foreground">
                  "Emotional self-control is the real sign of strength."
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
                  <li>Harvard PhD and visiting scholar at UC Berkeley's Greater Good Science Center</li>
                  <li>Co-founder of the Consortium for Research on Emotional Intelligence in Organizations</li>
                  <li>Multiple Thinkers50 rankings among the top management thinkers</li>
                  <li>Awarded for science journalism by the American Psychological Association</li>
                  <li>Advisor to UNICEF, Dalai Lama Center, and World Economic Forum</li>
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
                  Daniel Goleman gave leaders a new mirror — one that reflects not just performance but presence. He proved that empathy and self-awareness are skills to be learned, not traits to be born with.
                </p>
                <p>
                  From classrooms to corporate boardrooms, his framework has reshaped how people hire, teach, coach, and lead.
                </p>
                <p>
                  Every time a manager pauses to listen before reacting, or a student learns to name a feeling before expressing it, his influence is alive.
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
                  Daniel Goleman continues to teach and write from Massachusetts, urging leaders to build "emotionally intelligent societies." He reminds us that self-management is the foundation of human progress.
                </p>
                <blockquote className="border-l-4 border-tma-red pl-6 italic text-xl my-6">
                  "The greatest leaders move us through our emotions — not despite them."
                </blockquote>
                <p>
                  Through <strong className="text-foreground">ECHOES</strong>, his voice reminds future leaders that emotional intelligence is not a soft skill — it's a core competence for a human world.
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
              Return to ECHOES Collection
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default DanielGolemanPage;
