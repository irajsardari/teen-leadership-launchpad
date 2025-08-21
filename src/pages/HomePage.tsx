import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, BookOpen, Target, Star, Award, Globe, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-teenagers.jpg";

const HomePage = () => {
  const levels = [
    {
      title: "Level 1: Explorers (Ages 10–11)",
      description: "Self-awareness, curiosity, discipline, teamwork.",
      badge: "Explorer Badge",
      color: "from-tma-teal to-tma-blue"
    },
    {
      title: "Level 2: Builders (Ages 12–13)",
      description: "Communication, collaboration, creativity, leadership.",
      badge: "Builder Badge",
      color: "from-tma-navy to-tma-blue"
    },
    {
      title: "Level 3: Innovators (Ages 14–15)", 
      description: "Critical thinking, problem-solving, resilience, innovation.",
      badge: "Innovator Badge",
      color: "from-tma-blue to-tma-teal"
    },
    {
      title: "Level 4: Pathfinders (Ages 16–17)",
      description: "Strategy, leadership ethics, financial literacy, global citizenship.",
      badge: "Pathfinder Badge",
      color: "from-tma-coral to-tma-coral/80"
    }
  ];

  const graduationAward = {
    title: "🎓 Future-Ready Leader Award (Age 18)",
    description: "Final capstone project & graduation recognition. Equivalent in prestige to global certificates.",
    badge: "Future-Ready Leader",
    color: "from-tma-gold to-tma-teal"
  };

  const learningAreas = [
    {
      title: "Psychology & Emotional Resilience",
      icon: "🧠",
      description: "Understanding emotions and building mental strength",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Communication & Public Speaking",
      icon: "🗣️",
      description: "Effective communication and presentation skills",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Sociology & Community Impact",
      icon: "🫂",
      description: "Understanding society and making positive impact",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Management & Leadership",
      icon: "💼",
      description: "Essential leadership skills and management principles",
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Digital & AI Literacy",
      icon: "🌐",
      description: "Modern technology and digital skills",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      title: "Finance, Law, and Ethics",
      icon: "💰",
      description: "Financial literacy and ethical decision-making",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const stats = [
    { icon: BookOpen, value: "8", label: "Year Curriculum" },
    { icon: Users, value: "Ages 10–18", label: "Serving Youth" },
    { icon: Globe, value: "First of its kind", label: "In the World" },
    { icon: Award, value: "Based in Oman", label: "Expanding Globally" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/70"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-tma-coral/20 rounded-full blur-xl floating"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-tma-teal/20 rounded-full blur-xl floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-tma-gold/20 rounded-full blur-xl floating" style={{ animationDelay: '4s' }}></div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="max-w-5xl mx-auto text-center text-white">
            <div className="glass-card-modern rounded-3xl p-8 lg:p-12 mb-8 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 lg:mb-8 leading-tight font-inter tracking-tight">
                Where Future <span className="text-gradient-accent font-black">CEOs</span>, <span className="text-gradient-accent font-black">Creators</span> & <span className="text-gradient-accent font-black">Changemakers</span> Begin
              </h1>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gradient-primary mb-4 font-inter">
                  TMA — Teenagers Management Academy
                </h2>
                <h3 className="text-xl sm:text-2xl text-gradient-accent font-bold mb-6 font-inter">
                  🌟 Future Ready Leaders
                </h3>
                <p className="text-lg sm:text-xl lg:text-2xl text-slate-200 max-w-4xl mx-auto font-inter font-medium leading-relaxed">
                  The world's <span className="font-black text-tma-teal text-2xl">first comprehensive academy</span> for pre-teens and teenagers (ages 10–18) dedicated to leadership, emotional intelligence, and life mastery.
                </p>
              </div>
            </div>
            
{/* CTA Buttons */}
<div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
  <Button 
    size="lg" 
    className="btn-modern-accent text-white font-inter font-black text-xl px-16 py-8 rounded-3xl transition-all duration-500 group relative overflow-hidden" 
    style={{ boxShadow: 'var(--shadow-button-3d)' }}
    asChild
  >
    <Link to="/apply" className="flex items-center relative z-10">
      <span className="mr-4 text-2xl">🚀</span>
      Start Your Journey
      <ArrowRight className="ml-4 h-7 w-7 transition-transform group-hover:translate-x-2" />
    </Link>
  </Button>
  <Button 
    size="lg" 
    variant="cta-teal"
    className="font-inter font-bold text-xl px-16 py-8 rounded-3xl transition-all duration-500 group" 
    asChild
  >
    <Link to="/curriculum" className="flex items-center">
      <span className="mr-4 text-2xl">📚</span>
      Explore Curriculum
      <ArrowRight className="ml-4 h-7 w-7 transition-transform group-hover:translate-x-2" />
    </Link>
  </Button>
</div>

{/* Financial Literacy Callout */}
<div className="mt-8 max-w-4xl mx-auto">
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-left">
    <div className="flex items-start gap-4">
      <div className="text-3xl">💰</div>
      <p className="text-lg sm:text-xl text-white leading-relaxed font-semibold">
        Earning money is important — <span className="font-extrabold text-tma-gold">but managing and growing money</span> is the skill that builds long-term independence.
      </p>
    </div>
  </div>
</div>
</div>
</div>
      </section>

      {/* Stats Section */}
      <section className="py-20 section-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="card-3d rounded-3xl p-8 mb-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-tma-blue to-tma-teal rounded-3xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500 number-badge">
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-black text-gradient-primary mb-3 animate-counter">{stat.value}</div>
                  <div className="text-foreground/80 font-bold text-lg font-inter">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Is TMA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tma-beige/30 to-background"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-black text-gradient-primary mb-16 font-inter">
              What Is TMA?
            </h2>
            <div className="glass-card-modern rounded-3xl p-12 lg:p-16 space-y-10">
              <div className="text-xl md:text-2xl text-foreground/90 space-y-8 font-inter">
                <p className="text-3xl md:text-4xl font-black text-gradient-primary">
                  🌟 TMA is the world's <span className="text-gradient-accent font-black">first academy</span> fully dedicated to teenage leadership and life readiness.
                </p>
                <p className="text-2xl md:text-3xl leading-relaxed">
                  Our program combines <span className="font-black text-tma-teal text-3xl">management</span>, <span className="font-black text-tma-coral text-3xl">emotional intelligence</span>, <span className="font-black text-tma-gold text-3xl">strategy</span>, entrepreneurship, and digital literacy — empowering youth to lead with confidence in school, career, and life.
                </p>
                <div className="card-3d rounded-3xl p-8 border-2 border-tma-coral/30">
                  <p className="text-3xl md:text-4xl font-black text-gradient-accent leading-relaxed">
                    💡 "We don't just prepare students to pass exams. We prepare them to lead their lives."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Structure Section */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
              TMA Challenger Journey
            </h2>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold text-primary mb-2">Total: 8 Years | Ages 10–18 | 24 Terms</h3>
              <p className="text-foreground/80">
                4 Levels + Future-Ready Leader Award. All participants are TMA Challengers — future-ready leaders in training.
              </p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            {levels.map((level, index) => (
              <div key={index} className="group">
                <div className="card-3d border-2 border-white/20 flex flex-col h-full rounded-3xl overflow-hidden">
                  <CardHeader className="flex-1 p-8">
                    <div className="w-full h-4 bg-gradient-to-r from-tma-teal to-tma-coral rounded-full mb-8 shadow-inner"></div>
                    <div className="w-20 h-20 number-badge rounded-3xl flex items-center justify-center mb-8 relative">
                      <span className="text-3xl text-white font-black relative z-10">{index + 1}</span>
                    </div>
                    <CardTitle className="text-gradient-primary font-inter text-2xl mb-6 font-black">{level.title}</CardTitle>
                    <p className="text-foreground/80 font-inter mb-6 leading-relaxed text-lg">{level.description}</p>
                    <Badge variant="secondary" className="w-fit bg-gradient-to-r from-tma-coral/20 to-tma-gold/20 text-tma-coral border-2 border-tma-coral/40 font-bold text-lg p-3 rounded-2xl">
                      🏅 Challenger - {level.badge}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-0 pb-8 px-8">
                  <Button 
                    className="w-full btn-modern-accent text-white font-inter font-black text-lg py-6 rounded-2xl transition-all duration-500 group-hover:scale-105"
                    style={{ boxShadow: 'var(--shadow-button-3d)' }}
                    onClick={() => window.location.href = '/apply#register'}
                  >
                    <span className="mr-3 text-xl">🚀</span>
                    Select This Program
                    <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                  </Button>
                  </CardContent>
                </div>
              </div>
            ))}
          </div>
          
          {/* Future-Ready Leader Award Section */}
          <div className="mt-16">
            <Card className="border-2 border-tma-gold/30 shadow-[var(--shadow-elegant)] bg-gradient-to-br from-tma-gold/5 to-tma-teal/5">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-tma-gold to-tma-teal rounded-full mb-8 shadow-lg">
                  <Award className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-6 font-inter">
                  {graduationAward.title}
                </h3>
                <p className="text-xl text-foreground/80 font-inter mb-8 leading-relaxed max-w-3xl mx-auto">
                  {graduationAward.description}
                </p>
                <Badge variant="secondary" className="bg-gradient-to-r from-tma-gold/20 to-tma-teal/20 text-tma-navy border-2 border-tma-gold/40 font-bold text-xl p-4 rounded-2xl">
                  🎓 {graduationAward.badge}
                </Badge>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-xl font-semibold text-primary font-inter italic">
              "4 Levels + Future-Ready Leader Award — A Complete Leadership Journey"
            </p>
          </div>
        </div>
      </section>

      {/* What Students Learn */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
              What Students Learn
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {learningAreas.map((area, index) => (
              <div key={index} className="group">
                <div className="card-3d border-2 border-white/20 text-center rounded-3xl p-10 h-full hover:scale-105 transition-all duration-500">
                  <CardHeader className="pb-8">
                    <div className={`w-24 h-24 bg-gradient-to-br ${area.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 text-5xl shadow-lg group-hover:shadow-2xl transition-all duration-500 number-badge`}>
                      {area.icon}
                    </div>
                    <CardTitle className="text-gradient-primary font-inter text-2xl mb-6 font-black">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 font-inter leading-relaxed text-lg font-medium">{area.description}</p>
                  </CardContent>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              className="btn-modern-accent text-white font-inter font-black px-16 py-8 rounded-3xl text-xl group"
              style={{ boxShadow: 'var(--shadow-button-3d)' }}
            >
              <span className="mr-4 text-2xl">📖</span>
              View Full Curriculum PDF
              <ArrowRight className="ml-4 h-7 w-7 transition-transform group-hover:translate-x-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* For Parents & Educators */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 font-inter">
              For Parents & Educators
            </h2>
            <div className="text-lg md:text-xl text-foreground/80 space-y-6 font-inter mb-8">
              <p>
                We believe parents are the first mentors.
              </p>
              <p>
                TMA provides short courses and guides to help parents support their teens' growth, plus teacher training materials to ensure our program is delivered with care and excellence.
              </p>
            </div>
            <Button size="lg" variant="outline" className="font-inter">
              → Learn About Parent & Teacher Programs
            </Button>
          </div>
        </div>
      </section>

      {/* Why TMA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
              Why TMA?
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4 mb-12">
            {[
              "The first of its kind in the world",
              "Age-appropriate, future-focused education", 
              "Research-based + emotionally safe",
              "Blending school, leadership, lifestyle, and purpose",
              "Founded in Oman — Built for the world"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center text-lg font-inter">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-foreground/80">{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-xl font-semibold text-primary font-inter">
              Built in the GCC. Scaling Globally.
            </p>
          </div>
        </div>
      </section>

      {/* Audience-Based Entry Points */}
      <section className="py-20 bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-inter">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 font-inter">
              Register as a Challenger or explore our curriculum to take the first step toward leadership.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Teenager Path */}
              <div className="group">
                <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/30 transition-colors duration-300">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 font-inter">I'm a Teenager</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Ready to transform yourself into a confident leader? Join as a challenger and begin your journey to becoming future-ready.
                    </p>
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-inter" asChild>
                      <Link to="/challenger">
                        Join as a Challenger
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Parent Path */}
              <div className="group">
                <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/30 transition-colors duration-300">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 font-inter">I'm a Parent</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Discover how TMA can help your teenager develop essential life skills and prepare for their future success.
                    </p>
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-inter" asChild>
                      <Link to="/apply">
                        Learn More & Apply
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-inter">
              Ready to Unlock Your Leadership Potential?
            </h2>
            <p className="text-xl text-blue-100 mb-8 font-inter">
              Join thousands of students worldwide who are building the skills 
              they need for a successful future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#012D5A] hover:bg-gray-100 font-inter" asChild>
                <Link to="/challenger">
                  Join as a Challenger
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="glass" className="font-inter" asChild>
                <Link to="/curriculum">
                  Explore Curriculum
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;