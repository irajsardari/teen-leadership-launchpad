import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FounderPage = () => {
  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" className="mb-4" asChild>
            <Link to="/about" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to About Us
            </Link>
          </Button>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-inter">
              Our Founder
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 font-inter">
              Meet the visionary behind TMA's mission to empower teenagers worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Founder Bio Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-none shadow-[var(--shadow-elegant)] bg-gradient-to-br from-background via-background to-muted/20">
              <CardContent className="p-8 md:p-16">
                
                {/* Profile Image and Title */}
                <div className="text-center mb-12">
                  <Avatar className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6">
                    <AvatarImage src="/lovable-uploads/3e5fdf0b-b217-4351-89f4-4d4158e63364.png" alt="Dr. Iraj Sardari Baf" />
                    <AvatarFallback className="text-3xl font-bold">IS</AvatarFallback>
                  </Avatar>
                  <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-inter">
                    Dr. Iraj Sardari Baf
                  </h2>
                  <p className="text-xl text-tma-coral font-inter mb-8">
                    Founder of Teenagers Management Academy (TMA)
                  </p>
                </div>

                {/* Biography */}
                <div className="prose prose-lg max-w-none text-foreground/90 font-inter leading-relaxed">
                  <p className="text-lg md:text-xl leading-relaxed mb-8">
                    Dr. Iraj Sardari Baf is a visionary educator, strategist, and leadership expert with over two decades of senior executive experience in banking and management. He holds a Ph.D. in Business Management, with a focus on Organizational Behavior and Human Resource Development.
                  </p>
                  
                  <p className="text-lg leading-relaxed mb-8">
                    Driven by a deep commitment to youth empowerment, he founded TMA to help teenagers unlock their inner potential and shape the future with wisdom, values, and leadership. His life's mission is to ensure that no young person is left behind — mentally, emotionally, or morally — in a world that demands both skill and soul.
                  </p>

                  <div className="bg-gradient-to-r from-tma-blue/5 to-tma-teal/5 p-8 rounded-xl border-l-4 border-tma-coral my-12">
                    <blockquote className="text-xl md:text-2xl font-semibold text-primary italic text-center">
                      "My life's mission is to ensure that no young person is left behind — mentally, emotionally, or morally — in a world that demands both skill and soul."
                    </blockquote>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mt-12">
                    <div className="bg-muted/30 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-primary mb-4">Professional Background</h3>
                      <ul className="space-y-2 text-foreground/80">
                        <li>• Ph.D. in Business Management</li>
                        <li>• Specialization in Organizational Behavior</li>
                        <li>• Expert in Human Resource Development</li>
                        <li>• 20+ years of senior executive experience</li>
                        <li>• Banking and management leadership</li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted/30 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-primary mb-4">Vision & Mission</h3>
                      <ul className="space-y-2 text-foreground/80">
                        <li>• Youth empowerment advocate</li>
                        <li>• Leadership development expert</li>
                        <li>• Mental health awareness champion</li>
                        <li>• Global education innovator</li>
                        <li>• Character-building strategist</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
              Learn More About TMA
            </h3>
            <p className="text-xl text-foreground/80 mb-8 font-inter">
              Discover how Dr. Iraj's vision is transforming teenage leadership development worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#FF715B] hover:bg-[#FF715B]/90 text-white font-inter" asChild>
                <Link to="/about">About TMA</Link>
              </Button>
              <Button size="lg" className="bg-transparent border-2 border-[#012D5A] text-[#012D5A] hover:bg-[#F8F4EE] font-inter" variant="outline" asChild>
                <Link to="/curriculum">Our Curriculum</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FounderPage;