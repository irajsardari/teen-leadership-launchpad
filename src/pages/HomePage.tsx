import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, BookOpen, Target, Star, Award, Globe, GraduationCap, Play, ChevronRight, Sparkles, Trophy, Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-teenagers.jpg";

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    // Animate streak counter
    const timer = setInterval(() => {
      setStreakCount(prev => prev < 7 ? prev + 1 : prev);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const levels = [
    {
      title: "Explorer",
      age: "Ages 10-11",
      icon: "🌍",
      description: "Self-awareness, curiosity, discipline, teamwork",
      badge: "Explorer Badge",
      color: "from-[#006D6C] to-[#003A5D]",
      hoverColor: "hover:from-[#006D6C]/90 hover:to-[#003A5D]/90",
      skills: ["🧠 Self-Discovery", "🤝 Teamwork", "📚 Study Skills"]
    },
    {
      title: "Builder", 
      age: "Ages 12-13",
      icon: "🔧",
      description: "Communication, collaboration, creativity, leadership",
      badge: "Builder Badge", 
      color: "from-[#F28C28] to-[#FDB940]",
      hoverColor: "hover:from-[#F28C28]/90 hover:to-[#FDB940]/90",
      skills: ["🗣️ Communication", "🎨 Creativity", "👥 Leadership"]
    },
    {
      title: "Innovator",
      age: "Ages 14-15", 
      icon: "💡",
      description: "Critical thinking, problem-solving, resilience, innovation",
      badge: "Innovator Badge",
      color: "from-[#003A5D] to-[#006D6C]", 
      hoverColor: "hover:from-[#003A5D]/90 hover:to-[#006D6C]/90",
      skills: ["🧩 Problem Solving", "💪 Resilience", "🚀 Innovation"]
    },
    {
      title: "Pathfinder",
      age: "Ages 16-17",
      icon: "🧭", 
      description: "Strategy, leadership ethics, financial literacy, global citizenship",
      badge: "Pathfinder Badge",
      color: "from-[#FDB940] to-[#F28C28]",
      hoverColor: "hover:from-[#FDB940]/90 hover:to-[#F28C28]/90", 
      skills: ["📈 Strategy", "💰 Finance", "🌍 Global Impact"]
    }
  ];

  const blogCategories = [
    { name: "Leadership", icon: "👑", color: "bg-[#006D6C]/10 text-[#006D6C] border border-[#006D6C]/20" },
    { name: "Psychology", icon: "🧠", color: "bg-[#003A5D]/10 text-[#003A5D] border border-[#003A5D]/20" },
    { name: "Money", icon: "💰", color: "bg-[#F28C28]/10 text-[#F28C28] border border-[#F28C28]/20" },
    { name: "Digital Life", icon: "🌐", color: "bg-[#FDB940]/10 text-[#FDB940] border border-[#FDB940]/20" }
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
      {/* Premium TMA Brand Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Official TMA Brand Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#006D6C] via-[#004B5C] to-[#003A5D]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
          {/* Premium mesh gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"></div>
        </div>
        
        {/* Sophisticated Floating Elements with Brand Colors */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-gradient-to-r from-[#F28C28]/20 to-[#FDB940]/15 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-gradient-to-r from-[#006D6C]/25 to-[#003A5D]/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#F28C28]/8 to-[#FDB940]/6 rounded-full blur-3xl animate-pulse"></div>
          {/* Additional premium light effects */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.02] via-transparent to-white/[0.01]"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="max-w-6xl mx-auto text-center">
            
            {/* Announcement Badge */}
            <div className="mb-8 animate-bounce-gentle">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-medium border border-white/20">
                <Sparkles className="h-4 w-4" />
                World's First Teen Leadership Academy
                <Sparkles className="h-4 w-4" />
              </span>
            </div>
            
            {/* Main Hero Title with TMA Brand Colors */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-[#FAF5EF] to-white bg-clip-text text-transparent animate-fade-in">
                Learn. Lead.
              </span>
              <span className="block bg-gradient-to-r from-[#F28C28] via-[#FDB940] to-[#F28C28] bg-clip-text text-transparent animate-fade-in-delayed">
                Change the World
              </span>
              <span className="block text-3xl md:text-4xl mt-4 text-white/90 font-normal animate-fade-in-slow">
                🚀
              </span>
            </h1>
            
            {/* TMA Slogan */}
            <div className="mb-8 animate-fade-in-delayed">
              <h2 className="text-2xl md:text-3xl font-bold text-white/95 tracking-wide">
                Future Ready Leaders
              </h2>
            </div>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto font-medium animate-fade-in-slower">
              From Teenagers to Trailblazers — Master leadership, emotional intelligence, and life skills that turn dreams into reality
            </p>
            
            {/* Premium TMA Brand CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-slowest">
              <Button
                size="lg"
                className="bg-[#F28C28] hover:bg-[#F28C28]/90 text-white px-12 py-6 text-lg font-bold rounded-2xl shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to="/auth" className="flex items-center gap-3">
                  <Play className="h-5 w-5" />
                  Start Your Journey
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-md text-white px-12 py-6 text-lg font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                asChild
              >
                <Link to="/curriculum" className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5" />
                  Explore Curriculum
                </Link>
              </Button>
            </div>

            {/* Premium Gamification Element - Reading Streak */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto border border-white/20">
              <div className="flex items-center justify-center gap-3">
                <div className="text-2xl">🔥</div>
                <div className="text-white">
                  <div className="text-sm opacity-75">Reading Streak</div>
                  <div className="text-xl font-bold">{streakCount}/10 Leadership Articles</div>
                </div>
                <div className="bg-[#F28C28] text-white px-3 py-1 rounded-full text-sm font-bold">
                  Keep Going!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Level Cards Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Choose Your Adventure 🎯
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four epic levels designed to transform you from curious explorer to confident leader
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {levels.map((level, index) => (
              <div key={index} className="group cursor-pointer">
                <div className={`relative bg-gradient-to-br ${level.color} ${level.hoverColor} rounded-3xl p-8 text-white transform hover:scale-105 hover:-rotate-1 transition-all duration-500 shadow-lg hover:shadow-2xl`}>
                  
                  {/* Level Icon */}
                  <div className="text-6xl mb-4 text-center animate-bounce-gentle">
                    {level.icon}
                  </div>
                  
                  {/* Level Title */}
                  <h3 className="text-2xl font-black text-center mb-2">{level.title}</h3>
                  <div className="text-center text-white/80 text-sm font-medium mb-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                    {level.age}
                  </div>
                  
                  {/* Skills List */}
                  <div className="space-y-2 mb-6">
                    {level.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="text-sm bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                  
                  {/* Badge */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                    <Trophy className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-bold">{level.badge}</div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl flex items-center justify-center">
                    <div className="text-center">
                      <ChevronRight className="h-8 w-8 mx-auto mb-2 animate-bounce" />
                      <div className="text-sm font-bold">Explore Level</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Testimonials Carousel - REMOVED */}
      {/* Testimonials section removed as requested - fake content placeholder */}

      {/* Modern Blog/Voices Feed */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Voices from Our Community 📝
            </h2>
            <p className="text-xl text-gray-600">
              Stories, insights, and inspiration from the next generation of leaders
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {blogCategories.map((category, index) => (
              <button
                key={index}
                className={`${category.color} px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-all duration-300 flex items-center gap-2`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Real TMA Articles Preview */}
          <div className="text-center">
            <p className="text-gray-600 mb-8">Coming soon: Real stories and insights from our TMA community</p>
            <Button asChild className="bg-[#006D6C] hover:bg-[#006D6C]/90 text-white px-8 py-4 rounded-2xl font-bold">
              <Link to="/voices" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Visit TMA Voices
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Premium Gamified Journey Overview with TMA Brand Colors */}
      <section className="py-20 bg-gradient-to-br from-[#FAF5EF] to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#003A5D] mb-6">
              Your Learning Journey 🎮
            </h2>
            <p className="text-xl text-[#1D1D1D]/80 max-w-3xl mx-auto">
              Complete challenges, earn badges, and unlock new levels as you grow from explorer to leader
            </p>
          </div>

          {/* Premium Progress Tracker */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#006D6C]/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#003A5D]">Your Progress</h3>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#FDB940]" />
                  <span className="text-lg font-bold text-[#1D1D1D]">Level 2: Builder</span>
                </div>
              </div>
              
              {/* TMA Brand Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div className="bg-gradient-to-r from-[#006D6C] to-[#F28C28] h-4 rounded-full" style={{width: '65%'}}></div>
              </div>
              
              <div className="flex justify-between text-sm text-[#1D1D1D]/70 mb-6">
                <span>13/20 Challenges Complete</span>
                <span>Next: Communication Badge</span>
              </div>

              {/* Premium Badge Collection with TMA Colors */}
              <div className="flex gap-4 justify-center">
                {['🌍 Explorer', '🔧 Builder', '💡 Locked', '🧭 Locked'].map((badge, index) => (
                  <div key={index} className={`px-4 py-2 rounded-full text-sm font-bold ${
                    index < 2 ? 'bg-[#006D6C]/10 text-[#006D6C] border border-[#006D6C]/20' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Premium Final CTA with TMA Brand */}
          <div className="text-center">
            <Button asChild size="lg" className="bg-[#F28C28] hover:bg-[#F28C28]/90 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Link to="/auth" className="flex items-center gap-3">
                <Star className="h-6 w-6" />
                Begin Your Adventure
                <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
            <p className="text-[#1D1D1D]/70 mt-4">Join 1,000+ teenagers already on their leadership journey</p>
          </div>
        </div>
      </section>

      {/* What Students Learn - Premium TMA Brand */}
      <section id="curriculum" className="py-20 bg-[#FAF5EF]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003A5D] mb-6 font-inter">
              What Students Learn
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {learningAreas.map((area, index) => (
              <div key={index} className="group">
                 <div className="bg-white border-2 border-[#006D6C]/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 h-full hover:scale-105 transition-all duration-500 shadow-lg">
                  <CardHeader className="pb-6 sm:pb-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#003A5D] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 text-4xl sm:text-5xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      {area.icon}
                    </div>
                    <CardTitle className="text-[#003A5D] font-inter text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 font-black leading-tight">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#1D1D1D] font-inter leading-relaxed text-base sm:text-lg font-medium">{area.description}</p>
                  </CardContent>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center px-4 sm:px-0">
            <Button 
              size="lg" 
              className="font-inter font-black px-8 sm:px-12 lg:px-16 py-6 sm:py-8 rounded-2xl sm:rounded-3xl text-lg sm:text-xl group w-full sm:w-auto max-w-md sm:max-w-none min-h-[44px] min-w-[44px] bg-[#F28C28] text-white hover:bg-[#F28C28]/90"
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