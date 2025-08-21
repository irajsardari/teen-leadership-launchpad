import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Globe, Award, Target, Heart, BookOpen, Brain, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const differentiators = [
    {
      icon: Globe,
      title: "Global-first concept",
      description: "No other academy offers this 8-year comprehensive development structure"
    },
    {
      icon: Brain,
      title: "Multidisciplinary curriculum", 
      description: "Combining psychology, strategy, finance, leadership, ethics, and communication"
    },
    {
      icon: Target,
      title: "Age-appropriate design",
      description: "Clear stages for growth: Explorers (10-11), Builders (12-13), Innovators (14-15), Pathfinders (16-17), Future-Ready Leader Award (18)"
    },
    {
      icon: Award,
      title: "Real outcomes",
      description: "Confidence, decision-making, project planning, emotional strength"
    },
    {
      icon: Heart,
      title: "Vision beyond school",
      description: "We prepare leaders, not just graduates"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-inter">
              About Us – TMA: Teenagers Management Academy
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 font-inter">
              TMA — Teenagers Management Academy<br />
              Future Ready Leaders<br /><br />
              The world's first comprehensive leadership academy for pre-teens and teenagers aged 10 to 18
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
                🔹 Who We Are
              </h2>
            </div>
            
            <div className="text-lg text-foreground/80 space-y-6 font-inter">
              <p className="text-xl leading-relaxed">
                TMA is the world's first comprehensive leadership and life skills academy built specifically for pre-teens and teenagers aged 10 to 18.
              </p>
              
              <p className="leading-relaxed">
                Founded in the GCC and expanding globally, TMA offers an 8-year, 24-term curriculum that blends management, emotional intelligence, finance, psychology, digital literacy, and leadership — all designed to prepare students for real life, not just academics. Our curriculum spans 4 levels plus a prestigious Future-Ready Leader Award, starting at age 10.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
                🔹 Why We Exist
              </h2>
            </div>
            
            <div className="text-lg text-foreground/80 space-y-6 font-inter">
              <p className="leading-relaxed">
                Young people today face a world full of challenges — from anxiety and peer pressure to information overload and unclear life direction. Traditional education often doesn't equip them for these realities.
              </p>
              
              <p className="text-xl font-semibold text-primary">
                TMA was created to fill this gap.
              </p>
              
              <p className="leading-relaxed">
                We give pre-teens and teenagers the tools to understand themselves, lead others, make wise decisions, and thrive in school, work, and life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
              🔹 What Makes Us Different
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentiators.map((item, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] text-center hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-tma-blue to-tma-teal rounded-full mb-4">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-primary font-inter">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 font-inter">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 font-inter">
              🔹 Our Philosophy
            </h2>
            <blockquote className="text-2xl md:text-3xl font-semibold text-primary italic font-inter">
              "Every teenager is a leader in the making — they just need the right education to unlock their power."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 font-inter">
              🔹 Our Vision
            </h2>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed font-inter">
              To build a generation of emotionally intelligent, ethically grounded, future-ready leaders who shape their lives — and the world — with confidence, purpose, and skill.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
              👤 Leadership Team
            </h2>
          </div>
          
          {/* Founder's Message */}
          <div className="max-w-5xl mx-auto mb-16">
            <Card className="border-none shadow-[var(--shadow-elegant)] bg-gradient-to-br from-background via-background to-muted/20">
              <CardContent className="p-8 md:p-16 text-center">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-12 space-y-6 text-foreground/90 font-inter">
                    <p className="text-lg md:text-xl leading-relaxed italic">
                      I did not create TMA to build an institution —<br />
                      I created it to heal a wound I've seen in far too many lives.
                    </p>
                    
                    <p className="text-lg leading-relaxed">
                      Too many teenagers grow up feeling lost, not because they lack talent or value — but because no one showed them how to find it.<br />
                      Not because they are bad — but because no one taught them how to be better.
                    </p>
                    
                    <p className="text-lg leading-relaxed">
                      I've lived a life of responsibility, hardship, leadership, and reflection.<br />
                      And from all of it, one truth remains clear:
                    </p>
                    
                    <p className="text-xl md:text-2xl font-bold text-primary">
                      Teenagers are not the problem. They are the solution.
                    </p>
                    
                    <p className="text-lg leading-relaxed">
                      I don't want the next generations to suffer the way some of us did — unsure, untrained, full of potential but without direction.<br />
                      I want them to sleep with peace in their hearts and wake up with energy, purpose, and confidence.
                    </p>
                    
                    <div className="my-8 space-y-2 text-lg leading-relaxed">
                      <p>I dream of future engineers with character,</p>
                      <p>Doctors who treat not only illness but also the soul,</p>
                      <p>Nurses who serve with grace,</p>
                      <p>And teachers who don't just lecture — but climb down the mountain, take their students by the hand, and walk them back up…</p>
                      <p className="italic text-tma-coral">…to show them that between the stones, they are diamonds.</p>
                    </div>
                    
                    <div className="my-8 space-y-2 text-lg leading-relaxed">
                      <p>And I dream of future parents — full of wisdom, love, and emotional maturity.</p>
                      <p>Parents who know how to raise strong, kind, responsible children.</p>
                      <p>Parents who understand that leadership begins at home.</p>
                      <p>Because a better world starts not with governments or institutions — but in the family, the smallest and most sacred organization on Earth.</p>
                      <p className="italic text-tma-coral">That is where the next generation is truly shaped.</p>
                    </div>
                    
                    <p className="text-xl font-semibold text-primary leading-relaxed">
                      TMA is not just a school. It is a movement.
                    </p>
                    
                    <p className="text-lg leading-relaxed">
                      It's the place where young people will learn to manage their lives, lead with wisdom, care for their mental well-being, and grow into builders of a better future — for themselves, their communities, and their families.
                    </p>
                    
                    <p className="text-lg leading-relaxed">
                      And if that happens — even once —<br />
                      Then everything we've done… was worth it.
                    </p>
                  </div>
                  
                  <div className="pt-8 border-t border-border/30">
                    <p className="text-base text-foreground/70 mb-2">With all my heart,</p>
                    <p className="text-xl font-bold text-primary mb-1">Dr. Iraj Sardari Baf</p>
                    <p className="text-base text-tma-coral italic mb-4">A servant of the next generation</p>
                    
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-gradient-to-r from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-inter">
              Our Global Impact
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 font-inter">1000+</div>
              <div className="text-blue-100 font-inter">Students Empowered</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 font-inter">25+</div>
              <div className="text-blue-100 font-inter">Countries Reached</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 font-inter">8</div>
              <div className="text-blue-100 font-inter">Year Curriculum</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 font-inter">4.9/5</div>
              <div className="text-blue-100 font-inter">Student Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Information */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="p-6 bg-background rounded-xl border border-border/50">
              <h3 className="text-lg font-semibold text-primary mb-4 font-inter">
                Trademark Information
              </h3>
              <p className="text-sm text-foreground/70 font-inter">
                TMA® is a registered trademark in Oman – Reg. No. 185581.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
              Join Our Community
            </h2>
            <p className="text-xl text-foreground/80 mb-8 font-inter">
              Become part of a global community of young leaders committed to 
              personal growth and positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#FF715B] hover:bg-[#FF715B]/90 text-white font-inter" asChild>
                <Link to="/apply">Apply Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="font-inter" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;