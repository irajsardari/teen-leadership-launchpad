import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Globe, Award, Target, Heart, BookOpen, Brain, Users, Sparkles, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const differentiators = [
    {
      icon: Globe,
      title: "Global-first concept",
      description: "No other academy offers this 8-year comprehensive development structure",
      color: "from-primary/10 to-primary/20"
    },
    {
      icon: Brain,
      title: "Multidisciplinary curriculum", 
      description: "Combining psychology, strategy, finance, leadership, ethics, and communication",
      color: "from-secondary/10 to-secondary/20"
    },
    {
      icon: Target,
      title: "Age-appropriate design",
      description: "Clear stages for growth: Explorers (10-11), Builders (12-13), Innovators (14-15), Pathfinders (16-17), Future-Ready Leader Award (18)",
      color: "from-accent/10 to-accent/20"
    },
    {
      icon: Award,
      title: "Real outcomes",
      description: "Confidence, decision-making, project planning, emotional strength",
      color: "from-muted/10 to-muted/20"
    },
    {
      icon: Heart,
      title: "Vision beyond school",
      description: "We prepare leaders, not just graduates",
      color: "from-primary/5 to-accent/10"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%)] animate-pulse"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
              <Sparkles className="h-5 w-5 text-white" />
              <span className="text-white font-medium">World's First Leadership Academy for Teens</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
              About TMA Academy
              <span className="block text-3xl md:text-4xl font-medium text-white/90 mt-4">
                Future Ready Leaders
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto">
              The world's first comprehensive leadership academy for pre-teens and teenagers aged 10 to 18. 
              Building tomorrow's leaders, today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Trophy className="mr-2 h-5 w-5" />
                Join Our Mission
              </Button>
              <div className="flex items-center gap-2 text-white/80">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Founded in GCC • Expanding Globally</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Who We Are */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium text-sm">Who We Are</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-8">
                🔹 Pioneering Youth Leadership
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 border border-primary/10">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Global First</h3>
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    TMA is the world's first comprehensive leadership and life skills academy built specifically for pre-teens and teenagers aged 10 to 18.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-secondary/5 to-muted/5 rounded-3xl p-8 border border-secondary/10">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Comprehensive Curriculum</h3>
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    Founded in the GCC and expanding globally, TMA offers an 8-year, 24-term curriculum that blends management, emotional intelligence, finance, psychology, digital literacy, and leadership.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 rounded-3xl p-12 border border-accent/20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-6 shadow-xl">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">4 Levels + Award</h3>
                <p className="text-lg text-foreground/70 mb-6">
                  Progressive learning journey starting at age 10, culminating in the prestigious Future-Ready Leader Award
                </p>
                <Button 
                  className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-lg"
                  asChild
                >
                  <Link to="/curriculum">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Explore Curriculum
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Why We Exist */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
                <Heart className="h-4 w-4 text-accent" />
                <span className="text-accent font-medium text-sm">Our Purpose</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-8">
                🔹 Why We Exist
              </h2>
            </div>
            
            <div className="space-y-8">
              <Card className="border-none shadow-[var(--shadow-elegant)] bg-gradient-to-br from-muted/10 to-background p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/30 rounded-2xl mb-6">
                    <Target className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">The Challenge We Address</h3>
                  <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                    Young people today face a world full of challenges — from anxiety and peer pressure to information overload and unclear life direction. Traditional education often doesn't equip them for these realities.
                  </p>
                </div>
              </Card>
              
              <div className="text-center py-12">
                <div className="inline-block">
                  <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                    TMA was created to fill this gap.
                  </h3>
                  <div className="h-1 w-full bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>
              </div>
              
              <Card className="border-none shadow-[var(--shadow-elegant)] bg-gradient-to-br from-primary/5 to-secondary/5 p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl mb-6">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Our Solution</h3>
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    We give pre-teens and teenagers the tools to understand themselves, lead others, make wise decisions, and thrive in school, work, and life.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced What Makes Us Different */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-secondary font-medium text-sm">Our Differentiators</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-8">
              🔹 What Makes Us Different
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentiators.map((item, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] text-center hover:shadow-[var(--shadow-elegant)] transition-all duration-500 transform hover:scale-105 group bg-gradient-to-br from-background to-muted/10">
                <CardHeader className="pb-4">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <item.icon className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-foreground text-xl leading-tight">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Philosophy & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-24">
            {/* Philosophy */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium text-sm">Our Philosophy</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-12">
                🔹 Core Belief
              </h2>
              <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-3xl p-12 border border-primary/10">
                <blockquote className="text-3xl md:text-4xl font-bold text-foreground italic leading-relaxed">
                  "Every teenager is a leader in the making — they just need the right education to unlock their power."
                </blockquote>
              </div>
            </div>

            {/* Vision */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-8">
                <Globe className="h-4 w-4 text-accent" />
                <span className="text-accent font-medium text-sm">Our Vision</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-12">
                🔹 Future Impact
              </h2>
              <div className="bg-gradient-to-br from-accent/5 via-secondary/5 to-primary/5 rounded-3xl p-12 border border-accent/10">
                <p className="text-2xl md:text-3xl text-foreground/90 leading-relaxed font-medium">
                  To build a generation of emotionally intelligent, ethically grounded, future-ready leaders who shape their lives — and the world — with confidence, purpose, and skill.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Leadership Team */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
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
                      <p className="italic text-accent">…to show them that between the stones, they are diamonds.</p>
                    </div>
                    
                    <div className="my-8 space-y-2 text-lg leading-relaxed">
                      <p>And I dream of future parents — full of wisdom, love, and emotional maturity.</p>
                      <p>Parents who know how to raise strong, kind, responsible children.</p>
                      <p>Parents who understand that leadership begins at home.</p>
                      <p>Because a better world starts not with governments or institutions — but in the family, the smallest and most sacred organization on Earth.</p>
                      <p className="italic text-accent">That is where the next generation is truly shaped.</p>
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
                    <p className="text-base text-accent italic mb-4">A servant of the next generation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%)]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
              <Users className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Join the Movement</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Join Our Community
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
              Become part of a global community of young leaders committed to 
              personal growth and positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" asChild>
                <Link to="/apply">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Apply Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary border-2 backdrop-blur-sm" asChild>
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