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
      color: "from-tma-teal to-tma-navy"
    },
    {
      title: "Level 2: Builders (Ages 12–13)",
      description: "Communication, collaboration, creativity, leadership.",
      badge: "Builder Badge",
      color: "from-tma-navy to-tma-teal"
    },
    {
      title: "Level 3: Innovators (Ages 14–15)", 
      description: "Critical thinking, problem-solving, resilience, innovation.",
      badge: "Innovator Badge",
      color: "from-tma-teal to-tma-navy"
    },
    {
      title: "Level 4: Pathfinders (Ages 16–17)",
      description: "Strategy, leadership ethics, financial literacy, global citizenship.",
      badge: "Pathfinder Badge",
      color: "from-tma-orange to-tma-yellow"
    }
  ];

  const graduationAward = {
    title: "🎓 Future-Ready Leader Award (Age 18)",
    description: "Final capstone project & graduation recognition. Equivalent in prestige to global certificates.",
    badge: "Future-Ready Leader",
    color: "from-tma-yellow to-tma-teal"
  };

  const learningAreas = [
    {
      title: "Psychology & Emotional Resilience",
      icon: "🧠",
      description: "Understanding emotions and building mental strength",
      brandColor: "tma-teal"
    },
    {
      title: "Communication & Public Speaking",
      icon: "🗣️",
      description: "Effective communication and presentation skills",
      brandColor: "tma-navy"
    },
    {
      title: "Sociology & Community Impact",
      icon: "🫂",
      description: "Understanding society and making positive impact",
      brandColor: "tma-navy"
    },
    {
      title: "Management & Leadership",
      icon: "💼",
      description: "Essential leadership skills and management principles",
      brandColor: "tma-orange"
    },
    {
      title: "Digital & AI Literacy",
      icon: "🌐",
      description: "Modern technology and digital skills",
      brandColor: "tma-teal"
    },
    {
      title: "Finance, Law, and Ethics",
      icon: "💰",
      description: "Financial literacy and ethical decision-making",
      brandColor: "tma-yellow"
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
      {/* Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-tma-blue via-tma-teal to-tma-blue">
        {/* Animated Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-tma-blue/95 via-tma-teal/90 to-tma-blue/95 backdrop-blur-[2px]" />
        
        {/* Modern Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-tma-orange/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-20 right-[15%] w-96 h-96 bg-tma-yellow/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-[20%] w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '4s' }} />
        </div>
        
        {/* Premium Glass Content Container */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* World's First Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 animate-fade-in">
              <span className="text-tma-yellow mr-2">🌟</span>
              <span className="text-white font-semibold text-sm">World's First Comprehensive Academy</span>
            </div>
            
            {/* Main Hero Content */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 mb-8 shadow-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black mb-6 leading-tight tracking-tight">
                <span className="block text-white mb-2">Where Future</span>
                <span className="block">
                  <span className="text-tma-teal">CEOs</span>,{' '}
                  <span className="text-tma-yellow">Creators</span> &{' '}
                  <span className="text-tma-orange">Changemakers</span>
                </span>
                <span className="block text-white mt-2">Begin</span>
              </h1>
              
              <div className="mb-8">
                <h2 className="text-2xl lg:text-4xl font-black text-white mb-4">
                  TMA — Teenagers Management Academy
                </h2>
                <div className="flex items-center justify-center gap-2 text-tma-yellow font-bold text-lg lg:text-xl mb-6">
                  <span>🚀</span>
                  <span>Future Ready Leaders</span>
                  <span>🚀</span>
                </div>
                <p className="text-lg lg:text-2xl max-w-4xl mx-auto text-white/90 font-medium leading-relaxed">
                  The world's <span className="font-black text-tma-yellow">first comprehensive academy</span> for pre-teens and teenagers (ages 10–18) dedicated to leadership, emotional intelligence, and life mastery.
                </p>
              </div>
            </div>
            
            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-3xl mx-auto">
              <Button 
                size="lg" 
                variant="accent"
                className="font-black text-xl px-12 py-8 rounded-2xl transition-all duration-500 group relative overflow-hidden w-full sm:w-auto shadow-2xl hover:shadow-tma-orange/25 hover:scale-105 min-h-[64px]" 
                asChild
              >
                <Link to="/apply" className="flex items-center justify-center relative z-10">
                  <span className="mr-4 text-2xl">🚀</span>
                  Start Your Journey
                  <ArrowRight className="ml-4 h-7 w-7 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="font-bold text-xl px-12 py-8 rounded-2xl transition-all duration-500 group w-full sm:w-auto bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:scale-105 min-h-[64px]" 
                asChild
              >
                <Link to="/curriculum" className="flex items-center justify-center">
                  <span className="mr-4 text-2xl">📚</span>
                  Explore Curriculum
                  <ArrowRight className="ml-4 h-7 w-7 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
            </div>

            {/* Key Value Proposition */}
            <div className="mt-8 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 lg:p-8">
                <div className="flex items-start gap-4">
                  <div className="text-3xl lg:text-4xl">💰</div>
                  <p className="text-lg lg:text-xl leading-relaxed font-semibold text-white">
                    Earning money is important — <span className="font-black text-tma-orange text-xl lg:text-2xl">but managing and growing money</span> is the skill that builds long-term independence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-tma-cream">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-tma-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-tma-blue rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500">
                    <stat.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-tma-blue mb-2 sm:mb-3">{stat.value}</div>
                  <div className="text-tma-text font-bold text-sm sm:text-base lg:text-lg font-inter opacity-75">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fix Pack v1 - Brand Line Quote */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="quote">
              "We are not just teaching leadership—we're cultivating a generation of confident, purpose-driven teens ready to lead in life, school, and society."
            </div>
          </div>
        </div>
      </section>

      {/* What Is TMA Section */}
      <section id="what-is-tma" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tma-beige/30 to-background"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-tma-blue mb-8 sm:mb-12 lg:mb-16 font-inter leading-tight">
                What Is TMA?
              </h2>
            <div className="tma-card rounded-3xl p-12 lg:p-16 space-y-10">
              <div className="text-xl md:text-2xl space-y-8 font-inter">
                <p className="text-3xl md:text-4xl font-black text-tma-blue">
                  🌟 TMA is the world's <span className="text-tma-green font-black">first academy</span> fully dedicated to teenage leadership and life readiness.
                </p>
                <p className="text-2xl md:text-3xl leading-relaxed text-tma-dark-gray">
                  Our program combines <span className="font-black text-tma-green text-3xl">management</span>, <span className="font-black text-tma-orange text-3xl">emotional intelligence</span>, <span className="font-black text-tma-blue text-3xl">strategy</span>, entrepreneurship, and digital literacy — empowering youth to lead with confidence in school, career, and life.
                </p>
                <div className="bg-tma-white border-2 border-tma-orange/30 rounded-3xl p-8 shadow-[var(--shadow-card)]">
                  <p className="text-3xl md:text-4xl font-black text-tma-blue leading-relaxed">
                    💡 "We don't just prepare students to pass exams. We prepare them to lead their lives."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Structure Section - Simplified Teaser */}
      <section id="challenger-journey" className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-tma-blue mb-6 font-inter">
              TMA Challenger Journey
            </h1>
            <div className="bg-tma-neutral-gray border border-tma-blue/20 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold text-tma-blue mb-2">Total: 8 Years | Ages 10–18 | 24 Terms</h3>
              <p className="text-tma-dark-gray">
                4 Levels + Future-Ready Leader Award. All participants are TMA Challengers — future-ready leaders in training.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12">
            {levels.map((level, index) => (
              <div key={index} className="group">
                <div className="bg-tma-blue text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="flex-1 text-center">
                    <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                      <div className="bg-tma-orange text-white px-4 py-2 rounded-full font-semibold text-sm">
                        {level.title.match(/\(Ages (\d+-\d+)\)/)?.[1]}
                      </div>
                      <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold">{level.title.split(' (')[0]}</h3>
                      <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed">{level.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center px-4 sm:px-0">
            <Button 
              size="lg" 
              variant="primary"
              className="font-inter font-black px-8 sm:px-12 lg:px-16 py-6 sm:py-8 rounded-2xl sm:rounded-3xl text-lg sm:text-xl group w-full sm:w-auto max-w-md sm:max-w-none min-h-[44px] min-w-[44px]"
              asChild
            >
              <Link to="/curriculum" className="flex items-center justify-center">
                <span className="mr-3 sm:mr-4 text-xl sm:text-2xl">📚</span>
                See Full Curriculum
                <ArrowRight className="ml-3 sm:ml-4 h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
          </div>
          
          {/* Future-Ready Leader Award Section */}
          <div className="mt-16">
            <Card className="border-2 border-tma-orange/30 shadow-[var(--shadow-card)] bg-tma-neutral-gray">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-tma-orange rounded-full mb-8 shadow-lg">
                  <Award className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-tma-blue mb-6 font-inter">
                  {graduationAward.title}
                </h3>
                <p className="text-xl text-tma-dark-gray font-inter mb-8 leading-relaxed max-w-3xl mx-auto">
                  {graduationAward.description}
                </p>
                <Badge variant="secondary" className="bg-tma-orange text-white border-2 border-tma-orange font-bold text-xl p-4 rounded-2xl">
                  🎓 {graduationAward.badge}
                </Badge>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-xl font-semibold text-tma-blue font-inter italic">
              "4 Levels + Future-Ready Leader Award — A Complete Leadership Journey"
            </p>
          </div>
        </div>
      </section>

      {/* What Students Learn */}
      <section id="curriculum" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-blue mb-6 font-inter">
              What Students Learn
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {learningAreas.map((area, index) => (
              <div key={index} className="group">
                 <div className="tma-card border-2 border-tma-blue/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 h-full hover:scale-105 transition-all duration-500">
                  <CardHeader className="pb-6 sm:pb-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-tma-blue rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 text-4xl sm:text-5xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      {area.icon}
                    </div>
                    <CardTitle className="text-tma-blue font-inter text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 font-black leading-tight">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-tma-dark-gray font-inter leading-relaxed text-base sm:text-lg font-medium">{area.description}</p>
                  </CardContent>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center px-4 sm:px-0">
            <Button 
              size="lg" 
              variant="primary"
              className="font-inter font-black px-8 sm:px-12 lg:px-16 py-6 sm:py-8 rounded-2xl sm:rounded-3xl text-lg sm:text-xl group w-full sm:w-auto max-w-md sm:max-w-none min-h-[44px] min-w-[44px] bg-tma-orange text-white hover:bg-tma-orange/90"
            >
              <span className="mr-3 sm:mr-4 text-xl sm:text-2xl">📖</span>
              Download Full Curriculum PDF
              <ArrowRight className="ml-3 sm:ml-4 h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:translate-x-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="fees-faq" className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-blue mb-12 text-center font-inter">
              Pricing FAQ
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-tma-dark-gray">Q: How much are the fees?</h4>
                  <p className="text-tma-dark-gray/80 leading-relaxed">TMA fees are affordable per-term investments. Each term includes 10 sessions. Exact fees are confirmed during registration and depend on program format (online/offline) and cohort size.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-tma-dark-gray">Q: What does one term include?</h4>
                  <p className="text-tma-dark-gray/80 leading-relaxed">10 sessions, learning materials, progress tracking, and parent updates. Level 1 sessions are 45–50 min; Levels 2–4 are 70 min.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-tma-dark-gray">Q: Do you offer scholarships or payment plans?</h4>
                  <p className="text-tma-dark-gray/80 leading-relaxed">Yes. Need-based support and installment plans are available for eligible families. Please ask during registration.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-tma-dark-gray">Q: Why "per term" instead of monthly?</h4>
                  <p className="text-tma-dark-gray/80 leading-relaxed">Our curriculum runs in 10-session terms. This keeps teaching, projects, and assessments aligned and avoids monthly billing confusion.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Parents & Educators */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-blue mb-8 font-inter">
              For Parents & Educators
            </h2>
            <div className="text-lg md:text-xl text-tma-dark-gray space-y-6 font-inter mb-8 leading-relaxed">
              <p className="text-2xl font-semibold text-tma-blue">
                At TMA Academy, your teenager's journey is built step by step — from Explorers to Pathfinders — with a clear structure that builds confidence, skills, and leadership.
              </p>
              <p className="text-tma-dark-gray/90">
                We keep parents fully informed about what each level covers. For a detailed breakdown of subjects and badges, please see the Curriculum page.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="btn-tma-primary font-inter font-black px-12 py-6 rounded-2xl text-lg group"
                asChild
              >
                <Link to="/curriculum">
                  See Full Curriculum
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="btn-tma-secondary font-inter font-bold px-12 py-6 rounded-2xl text-lg group"
                asChild
              >
                <Link to="/apply">
                  Register Your Teenager
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why TMA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-blue mb-6 font-inter">
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
                <div className="w-6 h-6 bg-tma-green rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-tma-dark-gray">{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-xl font-semibold text-tma-blue font-inter">
              Built in the GCC. Scaling Globally.
            </p>
          </div>
        </div>
      </section>

      {/* Audience-Based Entry Points */}
      <section className="py-20 bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-blue mb-6 font-inter">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-tma-dark-gray/80 mb-12 font-inter">
              Register as a Challenger or explore our curriculum to take the first step toward leadership.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Teenager Path */}
              <div className="group">
                <Card className="border-2 border-tma-blue/20 hover:border-tma-blue/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer bg-tma-neutral-gray">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-tma-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-tma-blue/30 transition-colors duration-300">
                      <GraduationCap className="h-8 w-8 text-tma-blue" />
                    </div>
                    <h3 className="text-2xl font-bold text-tma-blue mb-4 font-inter">I'm a Teenager</h3>
                    <p className="text-tma-dark-gray/80 mb-6 leading-relaxed">
                      Ready to transform yourself into a confident leader? Join as a challenger and begin your journey to becoming future-ready.
                    </p>
                    <Button size="lg" className="w-full btn-tma-primary font-inter" asChild>
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
                <Card className="border-2 border-tma-green/20 hover:border-tma-green/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer bg-tma-neutral-gray">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-tma-green/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-tma-green/30 transition-colors duration-300">
                      <Users className="h-8 w-8 text-tma-green" />
                    </div>
                    <h3 className="text-2xl font-bold text-tma-blue mb-4 font-inter">I'm a Parent</h3>
                    <p className="text-tma-dark-gray/80 mb-6 leading-relaxed">
                      Discover how TMA can help your teenager develop essential life skills and prepare for their future success.
                    </p>
                    <Button size="lg" className="w-full btn-tma-secondary font-inter" asChild>
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
      <section className="py-20 bg-tma-blue">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-inter">
              Ready to Unlock Your Leadership Potential?
            </h2>
            <p className="text-xl text-white/90 mb-8 font-inter">
              Join thousands of students worldwide who are building the skills 
              they need for a successful future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-tma-secondary font-inter font-bold" asChild>
                <Link to="/challenger">
                  Join as a Challenger
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" className="bg-tma-green hover:bg-tma-green/90 text-white font-inter font-bold" asChild>
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