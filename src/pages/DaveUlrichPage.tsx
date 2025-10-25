import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import ulrichImage from "@/assets/echoes-symbolic-ulrich.jpg";

const DaveUlrichPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Helmet>
        <title>Dave Ulrich - The Architect of Human Value | ECHOES - TMA</title>
        <meta 
          name="description" 
          content="Biography of Dave Ulrich, the father of modern HR who transformed human resources into a strategic partner for organizational success." 
        />
        <link rel="canonical" href="https://teenmanagementacademy.com/echoes/dave-ulrich" />
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
              Dave Ulrich
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl mb-8 text-[#4a9eba] font-medium leading-relaxed">
              The Architect of Human Value in Organizations
            </p>
            <blockquote className="text-xl md:text-2xl text-white/90 italic font-light border-l-4 border-tma-teal pl-6 max-w-3xl mx-auto">
              "Value is created when we turn human capability into organizational success."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Symbolic Image */}
      <section className="relative -mt-20 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <img 
              src={ulrichImage} 
              alt="Symbolic representation of Dave Ulrich's HR philosophy - interconnected people forming a bridge"
              className="w-full h-[400px] object-cover rounded-lg shadow-2xl"
            />
            <p className="text-center text-sm text-muted-foreground mt-4 italic">
              Interlinked human figures forming a luminous bridge between people and performance — 
              symbolizing Ulrich's lifelong idea that organizations thrive when people and strategy are connected.
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
                  <strong>Dave Ulrich</strong> (b. 1953) is an American organizational psychologist and professor 
                  at the University of Michigan's Ross School of Business. Called <em>"the father of modern HR,"</em> he 
                  transformed human resources from a support function into a strategic partner that builds leadership, 
                  culture, and capability.
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
                  Born in Utah, Ulrich studied at Brigham Young University before completing his PhD at UCLA. 
                  Early exposure to psychology and organizational theory shaped his fascination with how people 
                  systems drive performance.
                </p>
                <p>
                  He often described his early years as a mix of <em>"mission work, community learning, and academic 
                  curiosity,"</em> experiences that built his belief that organizations exist to serve people — not 
                  the other way around.
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
                  In the late 1980s, while consulting for global corporations, Ulrich recognized that HR was often 
                  reactive — focused on policies, not purpose.
                </p>
                <p>
                  At the University of Michigan's Executive Education Center, he began codifying a new model: 
                  <strong> HR as a business partner</strong>. His research reframed HR around four roles — 
                  <strong>Strategic Partner, Change Agent, Administrative Expert, and Employee Champion</strong> — 
                  a model that redefined the field worldwide.
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
                    <strong>Human Resource Champions (1997)</strong> — introduced the HR Business Partner Model.
                  </li>
                  <li>
                    <strong>Results-Based Leadership (1999)</strong> — co-authored with Norm Smallwood, 
                    linking leadership behaviors to stakeholder outcomes.
                  </li>
                  <li>
                    <strong>The Why of Work (2010)</strong> — explored purpose and meaning as drivers of 
                    engagement and performance.
                  </li>
                  <li>
                    <strong>Victory Through Organization (2017)</strong> — emphasized that organizational 
                    capability, not individual talent alone, creates lasting success.
                  </li>
                </ul>
                <p className="mt-6">
                  Across all his works, Ulrich insists that <strong>value is defined by the receiver</strong> — 
                  whether the customer, investor, or employee.
                </p>
              </CardContent>
            </Card>

            {/* Selected Quotes */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-serif">A Voice of Reflection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <blockquote className="border-l-4 border-tma-teal pl-6 italic text-lg">
                  "Leaders build value by building people who build value."
                </blockquote>
                <blockquote className="border-l-4 border-tma-teal pl-6 italic text-lg">
                  "The best HR professionals don't do HR for HR's sake — they do HR for the business's sake."
                </blockquote>
                <blockquote className="border-l-4 border-tma-teal pl-6 italic text-lg">
                  "If culture eats strategy for breakfast, then leadership serves both the meal."
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
                  <li>Ranked multiple times in <strong>Thinkers 50</strong> list of the world's most influential management thinkers.</li>
                  <li><strong>Lifetime Achievement Award</strong> from HR Magazine.</li>
                  <li><strong>Fellow, National Academy of Human Resources.</strong></li>
                  <li>Co-founder of <strong>The RBL Group</strong>, a global consulting firm advancing leadership and HR capability.</li>
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
                  Ulrich's ideas shaped how Fortune 500 companies design their people strategies. He bridged academia 
                  and industry, proving that <strong>HR is the architect of value creation</strong> — aligning talent, 
                  leadership, and culture with business goals.
                </p>
                <p>
                  For today's young leaders, his message is timeless: <em>management begins with people, but endures 
                  through purpose.</em>
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
                  Dave Ulrich reminds every future leader that <strong>"human resources"</strong> are not a department — 
                  they are the source of every achievement. Through ECHOES, his voice continues to inspire a generation 
                  to see management not as control, but as connection — turning human potential into organizational greatness.
                </p>
              </CardContent>
            </Card>

            {/* References */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold font-serif">References</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <ol className="space-y-1 text-sm">
                  <li>Ulrich, D. (1997). <em>Human Resource Champions</em>. Harvard Business School Press.</li>
                  <li>Ulrich & Smallwood (1999). <em>Results-Based Leadership</em>. Harvard Business Review Press.</li>
                  <li>Ulrich, D. (2010). <em>The Why of Work</em>. McGraw-Hill.</li>
                  <li>Ulrich et al. (2017). <em>Victory Through Organization</em>. McGraw-Hill.</li>
                  <li>Thinkers 50 profile (2023).</li>
                  <li>HR Magazine Lifetime Achievement citation.</li>
                </ol>
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

export default DaveUlrichPage;
