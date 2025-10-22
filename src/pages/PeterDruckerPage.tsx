import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Quote } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";


const PeterDruckerPage = () => {
  const { slug } = useParams();
  
  // In the future, you can load different profiles based on the slug
  // For now, we only have Peter Drucker
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>ECHOES – Peter Drucker | Teenagers Management Academy</title>
        <meta name="description" content="The story and legacy of Peter F. Drucker — the father of modern management — through TMA's ECHOES series, connecting timeless ideas with today's AI generation." />
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

      {/* Article Content */}
      <article className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <Badge className="mb-6 bg-tma-red text-white hover:bg-tma-red/90">
              ECHOES – The Messengers of Management
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-inter tracking-tight text-foreground leading-tight">
              Peter F. Drucker: The Visionary Who Taught Us How to Think
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground italic font-light">
              The father of modern management who believed people, not profit, are the true measure of success
            </p>
          </div>


          {/* Famous Quote */}
          <blockquote className="my-16 p-8 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg">
            <div className="flex items-start gap-4">
              <Quote className="h-8 w-8 text-tma-red flex-shrink-0 mt-1" />
              <div>
                <p className="text-xl md:text-2xl font-medium italic text-foreground mb-4">
                  "The best way to predict the future is to create it."
                </p>
                <cite className="text-muted-foreground not-italic">— Peter F. Drucker</cite>
              </div>
            </div>
          </blockquote>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8 text-foreground leading-relaxed">
              
              {/* Introduction */}
              <p className="text-lg">
                A quiet observer of people and organizations, Peter Drucker reshaped how the modern world understands work, leadership, and responsibility. He believed management was not about power — it was about purpose, people, and performance.
              </p>

              {/* Early Life & Influences */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground mt-16 mb-8">🌱 Early Life & Influences</h2>
                <p>
                  Peter Ferdinand Drucker was born in 1909 in Vienna, Austria, into a home filled with books, discussions, and ideas. His father, a senior government official, often hosted intellectual gatherings with economists, scientists, and philosophers — among them figures who later influenced Europe's political and cultural direction.
                </p>
                <p>
                  As a teenager, Drucker was deeply curious about how societies organize themselves. He studied law at the University of Frankfurt and later moved to London, where he worked as a journalist. His early years were shaped by the collapse of European stability and the rise of authoritarian systems — experiences that taught him how dangerous unexamined power could be.
                </p>
                <p className="font-medium">
                  These early observations later inspired him to ask a question that would define his life's work:<br />
                  <strong>"How can organizations serve humanity rather than control it?"</strong>
                </p>
              </section>

              {/* Turning Point */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground mt-16 mb-8">🔁 Turning Point</h2>
                <p>
                  In 1937, Drucker emigrated to the United States to escape Nazi Germany. There, he began teaching and consulting for major corporations. But what changed everything was his deep, human study of <strong>General Motors</strong> — one of the world's biggest companies at that time. Unlike others who only measured productivity, Drucker looked at the <em>people behind the machines.</em>
                </p>
                <p>
                  His 1946 book <em>The Concept of the Corporation</em> revealed that organizations could succeed only if they respected human beings as thinking, responsible individuals — not tools. This was the birth of <strong>modern management</strong> as we know it.
                </p>
              </section>

              {/* Major Works & Ideas */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground mt-16 mb-8">📚 Major Works & Ideas</h2>
                <p>
                  Peter Drucker wrote more than <strong>35 books</strong>, translated into over <strong>30 languages</strong>. His key ideas still guide universities, companies, and governments around the world.
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-10 mb-6">Core Ideas</h3>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong>Management is a human art:</strong> it's about people, not numbers.</li>
                  <li><strong>Decentralization:</strong> give responsibility to those closest to the work.</li>
                  <li><strong>Knowledge Worker:</strong> every person who uses their mind to create value is an asset, not a cost.</li>
                  <li><strong>Purpose of Business:</strong> to create a customer — and to serve society.</li>
                  <li><strong>Effectiveness over Efficiency:</strong> doing the <em>right</em> things matters more than doing things <em>right</em>.</li>
                  <li><strong>Continuous Learning:</strong> in a fast-changing world, education never ends.</li>
                </ul>
              </section>

              {/* Famous Quotes */}
              <section className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground mt-16 mb-8">💬 Famous Quotes by Peter Drucker</h2>
                <blockquote className="p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic">
                  <p>"Management is doing things right; leadership is doing the right things."</p>
                </blockquote>
                <blockquote className="p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic">
                  <p>"The most important thing in communication is hearing what isn't said."</p>
                </blockquote>
                <blockquote className="p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic">
                  <p>"Knowledge has to be improved, challenged, and increased constantly, or it vanishes."</p>
                </blockquote>
                <blockquote className="p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic">
                  <p>"There is nothing so useless as doing efficiently that which should not be done at all."</p>
                </blockquote>
                <blockquote className="p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic">
                  <p>"Follow effective action with quiet reflection. From the quiet reflection will come even more effective action."</p>
                </blockquote>
              </section>

              {/* Legacy & Global Impact */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground mt-16 mb-8">🌍 Legacy & Global Impact</h2>
                <p>
                  Peter Drucker revolutionized how nations, businesses, and schools see <em>leadership and productivity.</em> He advised CEOs, nonprofits, hospitals, and governments — always reminding them that <em>management is about human beings.</em>
                </p>
                <p>His influence spread across disciplines:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>In <strong>business</strong>, he inspired ethical capitalism.</li>
                  <li>In <strong>education</strong>, he pushed for self-management and lifelong learning.</li>
                  <li>In <strong>public service</strong>, he urged accountability and citizen focus.</li>
                  <li>In <strong>society</strong>, he gave us a new definition of success — not wealth, but contribution.</li>
                </ul>
                <p>
                  Today, nearly every MBA program in the world still begins with Drucker's principles.
                </p>
              </section>

              {/* TMA Connection */}
              <section className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground mt-16 mb-8">🧩 TMA Connection: How Drucker's Ideas Align with Our Pillars</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-tma-navy/10">
                        <th className="border border-border p-4 text-left font-bold text-foreground">TMA Pillar</th>
                        <th className="border border-border p-4 text-left font-bold text-foreground">Drucker's Alignment</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-4 font-semibold">Critical Thinking</td>
                        <td className="border border-border p-4">He taught that good questions are more valuable than quick answers.</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border border-border p-4 font-semibold">Compatibility</td>
                        <td className="border border-border p-4">He believed effective organizations depend on understanding people and differences.</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-4 font-semibold">Resilience</td>
                        <td className="border border-border p-4">He reinvented himself across continents and decades — a model of lifelong adaptation.</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border border-border p-4 font-semibold">Emotional Intelligence</td>
                        <td className="border border-border p-4">He saw management as "a liberal art" — rooted in empathy and respect.</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-4 font-semibold">Financial & Return Literacy</td>
                        <td className="border border-border p-4">He emphasized that profit is not a goal but a test of value creation.</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border border-border p-4 font-semibold">Leadership & Purpose</td>
                        <td className="border border-border p-4">His central message: "The task of leadership is to create an alignment of strengths."</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-lg font-medium">
                  Through these values, Peter Drucker's life becomes a living example of what TMA teaches:<br />
                  <strong>To manage the world, first learn to manage yourself.</strong>
                </p>
              </section>

              {/* If They Were Here Today */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground mt-16 mb-8">🪶 If They Were Here Today: Reflections for the AI & Digital Generation</h2>
                <p>
                  If Peter Drucker were alive in 2025, he would not fear Artificial Intelligence — he would ask what it teaches us about being <em>more human.</em>
                </p>
                <blockquote className="my-6 p-8 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg">
                  <p className="text-xl font-medium italic text-foreground">
                    "Technology should serve human judgment, not replace it."
                  </p>
                </blockquote>
                <p>He would challenge teenagers and young leaders to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use data with <strong>purpose</strong>, not vanity.</li>
                  <li>Lead with <strong>clarity</strong>, not noise.</li>
                  <li>Remember that <strong>innovation without ethics</strong> is confusion, not progress.</li>
                  <li>Manage their own attention as carefully as they manage their devices.</li>
                </ul>
                <p>
                  He would remind this generation that <strong>every click, post, and choice is an act of management</strong> — of your time, your mind, and your impact.
                </p>
              </section>

              {/* Closing Reflection */}
              <section className="space-y-4 mt-16 p-8 bg-gradient-to-r from-tma-teal/5 to-tma-blue/5 rounded-lg border border-tma-teal/20">
                <h2 className="text-3xl font-bold text-foreground mb-8">✨ Closing Reflection</h2>
                <p className="text-lg">
                  Peter Drucker never aimed to create followers.<br />
                  He aimed to create <strong>thinkers</strong> — people who act with integrity, courage, and curiosity.<br />
                  Through <strong>ECHOES</strong>, his voice continues to speak to the world's next generation of managers, dreamers, and leaders.
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
