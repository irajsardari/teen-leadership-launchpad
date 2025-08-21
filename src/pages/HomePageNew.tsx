import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, BookOpen, Target, Star, Award, Globe, GraduationCap, Brain, Mic, Users2, Briefcase, Smartphone, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import heroImage from "@/assets/hero-academy.jpg";
import perTermBadge from "@/assets/tma-per-term-badge.svg";

const HomePage = () => {
  const levels = [
    {
      title: "Level 1: Explorers",
      age: "Ages 10-11",
      description: "Self-awareness, curiosity, discipline, teamwork.",
      color: "from-tma-emerald-green to-tma-deep-blue"
    },
    {
      title: "Level 2: Builders", 
      age: "Ages 12-13",
      description: "Communication, collaboration, creativity, leadership.",
      color: "from-tma-deep-blue to-tma-sky-blue"
    },
    {
      title: "Level 3: Innovators",
      age: "Ages 14-15", 
      description: "Critical thinking, problem-solving, resilience, innovation.",
      color: "from-tma-sky-blue to-tma-emerald-green"
    },
    {
      title: "Level 4: Pathfinders",
      age: "Ages 16-17",
      description: "Strategy, leadership ethics, financial literacy, global citizenship.",
      color: "from-tma-bright-orange to-tma-golden-yellow"
    }
  ];

  const learningAreas = [
    {
      title: "Psychology & Emotional Resilience",
      icon: Brain,
      description: "Understanding emotions and building mental strength",
      gradient: "from-tma-deep-blue to-tma-sky-blue"
    },
    {
      title: "Communication & Public Speaking",
      icon: Mic,
      description: "Effective communication and presentation skills", 
      gradient: "from-tma-emerald-green to-tma-bright-orange"
    },
    {
      title: "Sociology & Community Impact",
      icon: Users2,
      description: "Understanding society and making positive impact",
      gradient: "from-tma-golden-yellow to-tma-emerald-green"
    },
    {
      title: "Management & Leadership",
      icon: Briefcase,
      description: "Essential leadership skills and management principles",
      gradient: "from-tma-bright-orange to-tma-deep-blue"
    },
    {
      title: "Digital & AI Literacy", 
      icon: Smartphone,
      description: "Modern technology and digital skills",
      gradient: "from-tma-sky-blue to-tma-golden-yellow"
    },
    {
      title: "Finance, Law, and Ethics",
      icon: DollarSign,
      description: "Financial literacy and ethical decision-making",
      gradient: "from-tma-golden-yellow to-tma-bright-orange"
    }
  ];

  const stats = [
    { icon: BookOpen, value: "8", label: "Year Curriculum" },
    { icon: Users, value: "Ages 10–18", label: "Serving Youth" },
    { icon: Globe, value: "First of its kind", label: "In the World" },
    { icon: Award, value: "Based in Oman", label: "Expanding Globally" }
  ];

  const testimonials = [
    {
      quote: "TMA transformed my confidence and leadership skills beyond what I imagined possible.",
      author: "Future Challenger",
      role: "Level 3 Graduate"
    },
    {
      quote: "Watching my teenager grow into a thoughtful leader has been incredible.",
      author: "Parent Testimonial", 
      role: "TMA Parent Community"
    },
    {
      quote: "The world's first academy dedicated to teenage leadership - truly groundbreaking.",
      author: "Education Expert",
      role: "Youth Development Specialist"
    }
  ];

  return (
    <>
      <Helmet>
        <title>TMA - Future Ready Leaders | World's First Academy for Teenagers in Management & Leadership</title>
        <meta name="description" content="The world's first comprehensive academy for teenage leadership and life readiness. Ages 10-18. Modern, global, youth-driven, rooted in Oman." />
      </Helmet>

      <div className="min-h-screen font-open-sans">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image with Modern Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transform scale-105"
            style={{ backgroundImage: `url(${heroImage})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-tma-deep-blue/90 via-tma-deep-blue/70 to-tma-emerald-green/80"></div>
          
          {/* Floating Elements - Modern & Dynamic */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-tma-bright-orange/30 rounded-full blur-xl floating"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-tma-golden-yellow/30 rounded-full blur-xl floating" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-tma-emerald-green/30 rounded-full blur-xl floating" style={{ animationDelay: '4s' }}></div>
          
          {/* Hero Content */}
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
            <div className="max-w-6xl mx-auto text-center text-white">
              <div className="glass-card-modern rounded-3xl p-8 lg:p-16 mb-8 animate-fade-in">
                <Badge className="mb-6 bg-tma-bright-orange text-white px-6 py-2 text-lg font-montserrat font-bold">
                  🌍 World's First Academy
                </Badge>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 leading-tight font-montserrat tracking-tight">
                  Future Ready <span className="bg-gradient-to-r from-tma-bright-orange to-tma-golden-yellow bg-clip-text text-transparent font-black">Leaders</span>
                </h1>
                <div className="mb-8">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 font-montserrat">
                    The World's First Academy for Teenagers in Management & Leadership
                  </p>
                  <p className="text-xl sm:text-2xl text-slate-200 max-w-4xl mx-auto font-open-sans font-medium leading-relaxed mb-6">
                    Empowering youth aged <span className="font-bold text-tma-golden-yellow">10–18</span> with leadership, emotional intelligence, and life mastery through our comprehensive <span className="font-bold text-tma-bright-orange">8-year curriculum</span>.
                  </p>
                  <div className="flex justify-center items-center gap-4 text-lg font-semibold">
                    <span className="bg-tma-emerald-green/20 backdrop-blur-sm px-4 py-2 rounded-full border border-tma-emerald-green/40">
                      🌐 Modern & Global
                    </span>
                    <span className="bg-tma-bright-orange/20 backdrop-blur-sm px-4 py-2 rounded-full border border-tma-bright-orange/40">
                      💡 Youth-Driven
                    </span>
                    <span className="bg-tma-golden-yellow/20 backdrop-blur-sm px-4 py-2 rounded-full border border-tma-golden-yellow/40">
                      🇴🇲 Rooted in Oman
                    </span>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons - Updated Design */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Button 
                  size="lg" 
                  className="bg-tma-deep-blue hover:bg-tma-bright-orange text-white font-montserrat font-bold text-xl px-16 py-8 rounded-2xl transition-all duration-500 transform hover:scale-105" 
                  style={{ boxShadow: 'var(--shadow-cta-blue)' }}
                  asChild
                >
                  <Link to="/apply" className="flex items-center">
                    <span className="mr-4 text-2xl">🚀</span>
                    Start Your Journey
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-tma-deep-blue font-montserrat font-bold text-xl px-16 py-8 rounded-2xl transition-all duration-500 transform hover:scale-105" 
                  asChild
                >
                  <Link to="/curriculum" className="flex items-center">
                    <span className="mr-4 text-2xl">📚</span>
                    Explore Curriculum
                  </Link>
                </Button>
              </div>

              {/* Tagline */}
              <div className="max-w-4xl mx-auto">
                <p className="text-2xl sm:text-3xl font-bold font-montserrat bg-gradient-to-r from-tma-bright-orange to-tma-golden-yellow bg-clip-text text-transparent">
                  "Future Ready Leaders – The World's First Academy for Teenagers in Management & Leadership"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-b from-tma-light-grey to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-tma-deep-blue to-tma-emerald-green rounded-2xl mb-6 shadow-lg">
                      <stat.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-black text-tma-deep-blue mb-3 font-montserrat">{stat.value}</div>
                    <div className="text-tma-charcoal-grey font-bold text-lg font-open-sans">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why TMA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl font-black text-tma-deep-blue mb-16 font-montserrat">
                Why TMA?
              </h2>
              <div className="grid lg:grid-cols-3 gap-12">
                <Card className="bg-gradient-to-br from-tma-deep-blue/5 to-tma-sky-blue/10 border-2 border-tma-deep-blue/20 rounded-3xl hover:scale-105 transition-all duration-500">
                  <CardHeader className="p-8">
                    <div className="text-6xl mb-4">🌍</div>
                    <CardTitle className="text-2xl font-bold text-tma-deep-blue font-montserrat mb-4">First in the World</CardTitle>
                    <CardDescription className="text-lg text-tma-charcoal-grey font-open-sans">
                      The world's pioneering academy dedicated exclusively to teenage leadership and management development.
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="bg-gradient-to-br from-tma-emerald-green/5 to-tma-bright-orange/10 border-2 border-tma-emerald-green/20 rounded-3xl hover:scale-105 transition-all duration-500">
                  <CardHeader className="p-8">
                    <div className="text-6xl mb-4">🎯</div>
                    <CardTitle className="text-2xl font-bold text-tma-emerald-green font-montserrat mb-4">Research-Based Approach</CardTitle>
                    <CardDescription className="text-lg text-tma-charcoal-grey font-open-sans">
                      Comprehensive curriculum combining psychology, management, and emotional intelligence for holistic development.
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="bg-gradient-to-br from-tma-bright-orange/5 to-tma-golden-yellow/10 border-2 border-tma-bright-orange/20 rounded-3xl hover:scale-105 transition-all duration-500">
                  <CardHeader className="p-8">
                    <div className="text-6xl mb-4">🚀</div>
                    <CardTitle className="text-2xl font-bold text-tma-bright-orange font-montserrat mb-4">Future-Ready Skills</CardTitle>
                    <CardDescription className="text-lg text-tma-charcoal-grey font-open-sans">
                      Preparing teenagers with 21st-century skills for leadership in an evolving global landscape.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* TMA Challenger Journey - Simplified Preview */}
        <section className="py-20 bg-gradient-to-b from-tma-light-grey to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-tma-deep-blue mb-8 font-montserrat">
                TMA Challenger Journey
              </h2>
              <div className="bg-gradient-to-r from-tma-deep-blue/10 to-tma-emerald-green/10 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-tma-deep-blue mb-4 font-montserrat">8 Years | Ages 10–18 | 4 Levels + Future-Ready Leader Award</h3>
                <div className="flex justify-center mb-4">
                  <img src={perTermBadge} alt="Per Term • 10 Sessions" className="h-10 w-auto" />
                </div>
                <p className="text-lg text-tma-charcoal-grey font-open-sans">
                  All participants are TMA Challengers — future-ready leaders in training.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {levels.map((level, index) => (
                <Card key={index} className={`bg-gradient-to-br ${level.color} text-white rounded-3xl hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-2xl`}>
                  <CardHeader className="p-8 text-center">
                    <Badge className="bg-white/20 text-white border-white/30 mb-4 font-montserrat font-bold">
                      {level.age}
                    </Badge>
                    <CardTitle className="text-xl font-bold mb-4 font-montserrat">{level.title}</CardTitle>
                    <CardDescription className="text-white/90 font-open-sans">
                      {level.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-tma-deep-blue hover:bg-tma-bright-orange text-white font-montserrat font-bold px-16 py-8 rounded-2xl text-xl transition-all duration-500 transform hover:scale-105"
                asChild
              >
                <Link to="/curriculum">
                  <span className="mr-4 text-2xl">📚</span>
                  See Full Curriculum Details
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* What Students Learn */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-tma-deep-blue mb-8 font-montserrat">
                What Students Learn
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {learningAreas.map((area, index) => (
                <Card key={index} className="bg-white border-2 border-gray-100 rounded-3xl hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-2xl">
                  <CardHeader className="p-8 text-center">
                    <div className={`w-24 h-24 bg-gradient-to-br ${area.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <area.icon className="h-12 w-12 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-tma-deep-blue mb-4 font-montserrat">{area.title}</CardTitle>
                    <CardDescription className="text-tma-charcoal-grey font-open-sans leading-relaxed">
                      {area.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-b from-tma-light-grey to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-tma-deep-blue mb-8 font-montserrat">
                Future Impact
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="text-4xl mb-4">⭐</div>
                    <blockquote className="text-lg text-tma-charcoal-grey font-open-sans mb-6 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div>
                      <div className="font-bold text-tma-deep-blue font-montserrat">{testimonial.author}</div>
                      <div className="text-sm text-tma-charcoal-grey font-open-sans">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Registration CTA */}
        <section className="py-20 bg-gradient-to-br from-tma-deep-blue to-tma-emerald-green text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black mb-8 font-montserrat">
                Ready to Begin Your Leadership Journey?
              </h2>
              <p className="text-xl mb-8 font-open-sans">
                Join the world's first academy for teenage leadership and management. Spaces are limited.
              </p>
              <div className="flex justify-center mb-6">
                <img src={perTermBadge} alt="Per Term • 10 Sessions" className="h-12 w-auto" />
              </div>
              <p className="text-lg mb-8 font-open-sans opacity-90">
                Affordable investment per term. Final fees are confirmed during registration based on program format and current availability.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-tma-bright-orange hover:bg-tma-golden-yellow text-white font-montserrat font-bold text-xl px-16 py-8 rounded-2xl transition-all duration-500 transform hover:scale-105" 
                  asChild
                >
                  <Link to="/apply">
                    Join as a Challenger
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-tma-deep-blue font-montserrat font-bold text-xl px-16 py-8 rounded-2xl transition-all duration-500 transform hover:scale-105" 
                  asChild
                >
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;