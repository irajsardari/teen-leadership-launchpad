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
      description: "Pre-TMA Foundation - Self-Discovery and Basic Life Skills",
      badge: "Challenger - Explorer Badge",
      color: "from-tma-teal to-tma-blue"
    },
    {
      title: "Level 2: Builders (Ages 12–14)",
      description: "Foundations of Leadership, Discipline, and Emotional Intelligence",
      badge: "Challenger - Builder Badge",
      color: "from-tma-navy to-tma-blue"
    },
    {
      title: "Level 3: Innovators (Ages 15–16)", 
      description: "Advanced Leadership, Communication, and Innovation Skills",
      badge: "Challenger - Innovator Badge",
      color: "from-tma-blue to-tma-teal"
    },
    {
      title: "Level 4: Pathfinders (Ages 17–18)",
      description: "Professional Leadership, Career Preparation, and Life Mastery",
      badge: "Challenger - Pathfinder Badge",
      color: "from-tma-coral to-tma-coral/80"
    }
  ];

  const learningAreas = [
    {
      title: "Psychology & Emotional Resilience",
      icon: "🧠",
      description: "Understanding emotions and building mental strength"
    },
    {
      title: "Communication & Public Speaking",
      icon: "🗣️",
      description: "Effective communication and presentation skills"
    },
    {
      title: "Sociology & Community Impact",
      icon: "🫂",
      description: "Understanding society and making positive impact"
    },
    {
      title: "Management & Leadership",
      icon: "💼",
      description: "Essential leadership skills and management principles"
    },
    {
      title: "Digital & AI Literacy",
      icon: "🌐",
      description: "Modern technology and digital skills"
    },
    {
      title: "Finance, Law, and Ethics",
      icon: "💰",
      description: "Financial literacy and ethical decision-making"
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
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60"></div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="max-w-5xl mx-auto text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 lg:mb-8 leading-tight font-inter tracking-tight">
              Where Future CEOs, Creators & Changemakers Begin
            </h1>
            <h2 className="text-lg sm:text-xl lg:text-2xl mb-10 text-slate-200 max-w-4xl mx-auto font-inter font-medium leading-relaxed">
              TMA — Teenagers Management Academy<br />
              Future Ready Leaders<br /><br />
              The world's first comprehensive academy for pre-teens and teenagers (ages 10–18) dedicated to leadership, emotional intelligence, and life mastery.
            </h2>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-inter font-semibold text-lg px-10 py-6 rounded-lg shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1" 
                asChild
              >
                <Link to="/apply">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-white/80 text-white hover:bg-white hover:text-navy-900 font-inter font-semibold text-lg px-10 py-6 rounded-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl" 
                variant="outline" 
                asChild
              >
                <Link to="/curriculum">
                  Explore Curriculum
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-tma-blue to-tma-teal rounded-full mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Is TMA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 font-inter">
              What Is TMA?
            </h2>
            <div className="text-lg md:text-xl text-foreground/80 space-y-6 font-inter">
              <p>
                TMA is the world's first academy fully dedicated to teenage leadership and life readiness.
              </p>
              <p>
                Our program combines management, emotional intelligence, strategy, entrepreneurship, and digital literacy — empowering youth to lead with confidence in school, career, and life.
              </p>
              <p className="text-xl font-semibold text-primary">
                We don't just prepare students to pass exams. We prepare them to lead their lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Structure Section */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
              Our Structure (4 Levels, 28 Terms)
            </h2>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold text-primary mb-3">Pre-TMA Foundation Program</h3>
              <p className="text-foreground/80">
                Our foundation program for ages 10-11 prepares students for the full TMA Academy experience, 
                introducing basic life skills, self-awareness, and leadership fundamentals in an age-appropriate environment.
              </p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            {levels.map((level, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full">
                <CardHeader className="flex-1">
                  <div className="w-full h-2 bg-gradient-to-r from-[#006D6C] to-[#0EA5E9] rounded-full mb-4"></div>
                  <CardTitle className="text-primary font-inter text-lg">{level.title}</CardTitle>
                  <p className="text-foreground/70 font-inter mb-3">{level.description}</p>
                  <Badge variant="secondary" className="w-fit bg-[#006D6C]/10 text-[#006D6C] border-[#006D6C]">
                    {level.badge}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0 pb-6">
                  <Button 
                    className="w-full bg-[#006D6C] hover:bg-[#006D6C]/90 text-white font-inter transition-all duration-300"
                    onClick={() => window.location.href = '/apply'}
                  >
                    Select This Program
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-xl font-semibold text-primary font-inter italic">
              "More than a school — a launchpad."
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
              <Card key={index} className="border-none shadow-[var(--shadow-card)] text-center">
                <CardHeader>
                  <div className="text-4xl mb-4">{area.icon}</div>
                  <CardTitle className="text-primary font-inter">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 font-inter">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" className="bg-[#FF715B] hover:bg-[#FF715B]/90 text-white font-inter">
              → View Full Curriculum PDF
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
            <Button size="lg" className="bg-transparent border-2 border-[#012D5A] text-[#012D5A] hover:bg-[#F8F4EE] font-inter" variant="outline">
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
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#012D5A] font-inter" variant="outline" asChild>
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