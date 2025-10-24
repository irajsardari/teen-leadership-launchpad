import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import kotterImage from "@/assets/echoes-symbolic-kotter.jpg";

const JohnKotterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>John P. Kotter – The Architect of Change Leadership | ECHOES | TMA</title>
        <meta name="description" content="Biography of John P. Kotter, leadership scholar and author of Leading Change, who showed that change is not a plan but a journey — one that succeeds only when hearts move before charts." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-r from-tma-navy to-tma-blue">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white space-y-6">
            <Badge className="bg-tma-red text-white hover:bg-tma-red/90">
              ECHOES
            </Badge>
            <p className="text-sm md:text-base uppercase tracking-wider font-medium text-white/80">
              The Messengers of Management
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-inter tracking-tight">
              John P. Kotter — The Architect of Change Leadership
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Quote Card */}
            <Card className="bg-gradient-to-br from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-blue shadow-lg">
              <CardContent className="p-8">
                <blockquote className="text-xl md:text-2xl font-serif italic text-foreground leading-relaxed">
                  "Change is a process, not an event."
                </blockquote>
                <p className="mt-4 text-base text-muted-foreground font-medium">
                  — John P. Kotter (b. 1947)
                </p>
              </CardContent>
            </Card>

            {/* Symbolic Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={kotterImage} 
                alt="Symbolic representation of change and transformation - spiral staircase ascending"
                className="w-full h-auto"
                loading="eager"
              />
            </div>

            {/* Snapshot */}
            <Card className="shadow-lg">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold text-foreground mb-6">Snapshot</h2>
                <ul className="space-y-3 text-base leading-relaxed">
                  <li><strong className="text-foreground">Full Name:</strong> <span className="text-muted-foreground">John Paul Kotter</span></li>
                  <li><strong className="text-foreground">Born:</strong> <span className="text-muted-foreground">25 February 1947, San Diego, California, USA</span></li>
                  <li><strong className="text-foreground">Profession:</strong> <span className="text-muted-foreground">Leadership scholar, professor, author, consultant</span></li>
                  <li><strong className="text-foreground">Affiliation:</strong> <span className="text-muted-foreground">Harvard Business School (Konosuke Matsushita Professor Emeritus of Leadership)</span></li>
                  <li><strong className="text-foreground">Major Works:</strong> <span className="text-muted-foreground">Leading Change (1996), The Heart of Change (2002), A Sense of Urgency (2008), Accelerate (2014)</span></li>
                  <li><strong className="text-foreground">Known For:</strong> <span className="text-muted-foreground">Eight-Step Model of Change and the Dual-Operating-System framework</span></li>
                </ul>
                <p className="text-sm text-muted-foreground italic mt-6">
                  (Sources: Harvard Business School archives; Kotter International Library; Thinkers50 reports.)
                </p>
              </CardContent>
            </Card>

            {/* Early Life & Influences */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">Early Life & Influences</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Kotter studied engineering at MIT and earned his doctorate from Harvard Business School, where he later became one of its youngest tenured professors.
                In the 1970s and '80s, he watched organizations struggle to adapt to technological and market disruption. He asked:
              </p>
              <blockquote className="border-l-4 border-tma-blue pl-6 italic text-lg text-foreground my-6">
                "Why do smart people and good plans fail to make change happen?"
              </blockquote>
              <p className="text-base text-muted-foreground leading-relaxed">
                That question defined his career — and the modern field of change leadership.
              </p>
            </div>

            {/* Turning Point */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">Turning Point</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                In 1996, Kotter published <em>Leading Change</em>, the result of a 15-year study of companies undergoing transformation.
                He concluded that most fail not for strategic reasons but for emotional ones — complacency, fear, or confusion.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                He proposed the <strong>8-Step Change Model</strong>, a roadmap that became the standard for leaders worldwide:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-base text-muted-foreground leading-relaxed ml-4">
                <li><strong>Create Urgency</strong> – help people see why change matters now.</li>
                <li><strong>Build a Guiding Coalition</strong> – assemble a group with power and trust.</li>
                <li><strong>Form a Strategic Vision and Initiatives.</strong></li>
                <li><strong>Enlist a Volunteer Army.</strong></li>
                <li><strong>Enable Action by Removing Barriers.</strong></li>
                <li><strong>Generate Short-Term Wins.</strong></li>
                <li><strong>Sustain Acceleration.</strong></li>
                <li><strong>Institute Change in Culture.</strong></li>
              </ol>
              <p className="text-base text-muted-foreground leading-relaxed mt-4">
                In later work (<em>Accelerate</em>, 2014) he introduced the <strong>Dual-Operating-System</strong> — an organization with two coexisting structures: a stable hierarchy for efficiency and a flexible network for innovation.
              </p>
            </div>

            {/* Major Works & Signature Ideas */}
            <Card className="shadow-lg bg-gradient-to-br from-muted/30 to-background">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Major Works & Signature Ideas</h2>
                
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Key Books</h3>
                  <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground ml-4">
                    <li><em>Leading Change</em> (1996)</li>
                    <li><em>The Heart of Change</em> (2002)</li>
                    <li><em>Our Iceberg Is Melting</em> (2005, with Holger Rathgeber)</li>
                    <li><em>Accelerate</em> (2014)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Core Ideas</h3>
                  <ol className="list-decimal list-inside space-y-3 text-base text-muted-foreground ml-4">
                    <li><strong>Change Begins with Emotion.</strong> Logic informs, but emotion moves people to act.</li>
                    <li><strong>Leadership and Management Are Different.</strong> Management stabilizes; leadership mobilizes.</li>
                    <li><strong>Culture Is the Final Stage of Change.</strong> Sustainability comes only when new habits become norms.</li>
                    <li><strong>Urgency Over Complacency.</strong> Complacency is the enemy of innovation.</li>
                    <li><strong>Networked Leadership.</strong> Modern organizations thrive through agility and collaboration.</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Selected Quotes */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground mb-4">Selected Quotes</h2>
              <Card className="bg-gradient-to-br from-tma-navy/5 to-background border-l-4 border-tma-teal">
                <CardContent className="p-6">
                  <p className="text-lg italic text-foreground leading-relaxed">
                    "Leaders establish the vision for the future and set the strategy for getting there."
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-tma-blue/5 to-background border-l-4 border-tma-blue">
                <CardContent className="p-6">
                  <p className="text-lg italic text-foreground leading-relaxed">
                    "Change sticks when it becomes 'the way we do things around here.'"
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-tma-navy/5 to-background border-l-4 border-tma-teal">
                <CardContent className="p-6">
                  <p className="text-lg italic text-foreground leading-relaxed">
                    "Behavior change happens mostly by speaking to people's feelings."
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-tma-blue/5 to-background border-l-4 border-tma-blue">
                <CardContent className="p-6">
                  <p className="text-lg italic text-foreground leading-relaxed">
                    "Never waste a good crisis — it's often the best time to lead."
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Honours & Recognition */}
            <Card className="shadow-lg">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold text-foreground mb-4">Honours & Recognition</h2>
                <ul className="list-disc list-inside space-y-2 text-base text-muted-foreground leading-relaxed ml-4">
                  <li>Harvard Business School Professor Emeritus of Leadership</li>
                  <li>Founder and Chairman, Kotter International</li>
                  <li>Thinkers50 Lifetime Achievement Award (2011)</li>
                  <li>Over 25 languages translated, 5 million books sold</li>
                  <li>Consultant to Fortune 500 companies and governments worldwide</li>
                </ul>
              </CardContent>
            </Card>

            {/* Legacy */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">Legacy</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                John Kotter taught the world how to turn analysis into action and vision into movement.
                He transformed change from a mechanical process into a human narrative — one of energy, communication, and shared purpose.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Today his framework is used in corporations, universities, nonprofits, and even public health campaigns.
                Every time a leader asks, "How do I make people believe in the future?" — Kotter's ideas are present.
              </p>
            </div>

            {/* Closing Reflection */}
            <Card className="bg-gradient-to-r from-tma-navy/10 to-tma-blue/10 border-0 shadow-xl">
              <CardContent className="p-8 lg:p-12 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Closing Reflection</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  John Kotter continues to write and teach, reminding leaders that change is not a crisis to survive but a chance to evolve.
                </p>
                <blockquote className="border-l-4 border-tma-blue pl-6 italic text-lg text-foreground">
                  "People don't change because they are told to; they change because they are inspired to."
                </blockquote>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Through <strong>ECHOES</strong>, his voice calls on young leaders to combine vision with emotion, discipline with hope — and to lead change that lasts.
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

export default JohnKotterPage;