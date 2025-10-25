import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import franklImage from "@/assets/echoes-symbolic-frankl.jpg";

const ViktorFranklPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Helmet>
        <title>Viktor E. Frankl - The Psychiatrist Who Found Freedom in Meaning | ECHOES - TMA</title>
        <meta 
          name="description" 
          content="Biography of Viktor E. Frankl, the Austrian psychiatrist and Holocaust survivor who taught that meaning is the anchor of resilience." 
        />
        <link rel="canonical" href="https://teenmanagementacademy.com/echoes/viktor-frankl" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-[#2B3442] via-[#1e2937] to-[#243447] overflow-hidden">
        {/* Back Button */}
        <div className="absolute top-8 left-8 z-20">
          <Link to="/echoes">
            <Button variant="ghost" className="text-white hover:bg-white/10 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to ECHOES
            </Button>
          </Link>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-8 bg-tma-red text-white hover:bg-tma-red/90 px-6 py-2 text-sm font-semibold shadow-lg">
              The Messengers of Management
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 font-inter tracking-tight text-white">
              Viktor E. Frankl
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl mb-8 text-[#4a9eba] font-medium leading-relaxed">
              The Psychiatrist Who Found Freedom in Meaning
            </p>
            <blockquote className="text-xl md:text-2xl text-white/90 italic font-light border-l-4 border-tma-teal pl-6 max-w-3xl mx-auto">
              "Everything can be taken from a man but one thing: the last of the human freedoms — to choose one's attitude in any given set of circumstances."
            </blockquote>
            <p className="text-sm text-white/70 mt-4">— Viktor E. Frankl (1905 – 1997)</p>
          </div>
        </div>
      </section>

      {/* Symbolic Image */}
      <section className="relative -mt-20 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <img 
              src={franklImage} 
              alt="Symbolic representation of Viktor Frankl's philosophy - a small flame glowing within darkness"
              className="w-full h-[400px] object-cover rounded-lg shadow-2xl"
            />
            <p className="text-center text-sm text-muted-foreground mt-4 italic">
              A small flame glowing within darkness — representing the light of purpose that survives every storm.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Snapshot */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-serif">Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p>
                  <strong>Viktor Emil Frankl</strong> was an Austrian neurologist, psychiatrist, and Holocaust survivor 
                  whose life and work revealed one of humanity's deepest truths: <em>meaning is the anchor of resilience</em>.
                </p>
                <p>
                  He taught that our greatest freedom is the freedom to choose our response — even in suffering.
                </p>
              </CardContent>
            </Card>

            {/* Early Life & Influences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-serif">Early Life & Influences</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p>
                  Born in Vienna in 1905, Frankl grew up amid the intellectual energy of Freud and Adler but soon 
                  forged his own path — from pleasure and power toward purpose.
                </p>
                <p>
                  As a young doctor he counseled students who had lost hope during the Great Depression, laying 
                  the first stones of what he later called <strong>Logotherapy</strong>.
                </p>
              </CardContent>
            </Card>

            {/* Turning Point */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-serif">Turning Point</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p>
                  In 1942 he and his family were deported to concentration camps, including Auschwitz.
                </p>
                <p>
                  He lost his parents, brother, and wife — yet within that horror he discovered something transformative: 
                  those who endured found meaning in love, faith, or duty.
                </p>
                <p>
                  From this grew his central insight: <strong>life never loses meaning, even when everything else is taken away</strong>.
                </p>
              </CardContent>
            </Card>

            {/* Major Works & Signature Ideas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-serif">Major Works & Signature Ideas</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <ul className="space-y-3">
                  <li>
                    <strong>Man's Search for Meaning (1946)</strong> — a memoir that has inspired generations.
                  </li>
                  <li>
                    <strong>The Doctor and the Soul (1955)</strong> — applies Logotherapy to everyday life.
                  </li>
                  <li>
                    <strong>The Unheard Cry for Meaning (1978)</strong> — addresses the modern emptiness of 
                    comfort without purpose.
                  </li>
                </ul>
                
                <h4 className="font-bold mt-6 mb-4">Core Ideas</h4>
                <ul className="space-y-2">
                  <li>Life always has meaning.</li>
                  <li>Freedom lies in attitude, not circumstance.</li>
                  <li>Purpose and responsibility create inner strength.</li>
                  <li>Human beings are spiritual and moral agents, not objects of fate.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Selected Quotes */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-serif">A Voice of Reflection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <blockquote className="border-l-4 border-tma-teal pl-6 italic text-lg">
                  "When we are no longer able to change a situation, we are challenged to change ourselves."
                </blockquote>
                <blockquote className="border-l-4 border-tma-teal pl-6 italic text-lg">
                  "Those who have a why to live can bear almost any how."
                </blockquote>
                <blockquote className="border-l-4 border-tma-teal pl-6 italic text-lg">
                  "Happiness cannot be pursued; it must ensue as the side effect of dedication to a cause greater than oneself."
                </blockquote>
              </CardContent>
            </Card>

            {/* Honours & Recognition */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-serif">Honours & Recognition</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <ul className="space-y-2">
                  <li>Founder of <strong>Logotherapy</strong> and the Vienna Institute of Neurology and Psychiatry.</li>
                  <li>Received <strong>29 honorary doctorates</strong> worldwide.</li>
                  <li><em>Man's Search for Meaning</em> listed by the Library of Congress among America's most influential books.</li>
                  <li>Lectured at Harvard, Stanford, and universities around the world.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Legacy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-serif">Legacy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p>
                  Frankl turned tragedy into a theory of hope.
                </p>
                <p>
                  He proved that resilience is not the absence of pain but the presence of meaning.
                </p>
                <p>
                  His ideas became the roots of positive psychology, resilience training, and human-centered leadership.
                </p>
                <p>
                  To every generation he whispers: <em>your circumstances do not define you; your response does</em>.
                </p>
              </CardContent>
            </Card>

            {/* Closing Reflection */}
            <Card className="bg-gradient-to-br from-tma-navy/10 to-tma-teal/10">
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-serif">Closing Reflection</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed">
                  Viktor Frankl's life reminds us that even in darkness, the human spirit can shine. His voice in 
                  <strong> ECHOES — The Academy's Hall of Thinkers</strong> represents the pillar of <strong>Resilience</strong> — 
                  the power to endure through purpose, faith, and choice.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-muted-foreground mb-4 italic">
              Curated by Dr. Iraj Sardari Baf
            </p>
            <Link to="/echoes">
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to ECHOES Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViktorFranklPage;
