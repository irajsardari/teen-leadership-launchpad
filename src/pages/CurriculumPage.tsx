import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, BookOpen, Users, Clock, Target, Award, ArrowRight, Sparkles, Trophy, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const CurriculumPage = () => {
  const curriculumLevels = [
    {
      level: "Explorers",
      badge: "Explorer Badge", 
      years: "Years 1-2",
      ages: "10-11",
      terms: 6,
      focus: "Self-awareness, curiosity, discipline, teamwork.",
      subjects: [
        "Self-Awareness & Confidence",
        "Curiosity & Discovery", 
        "Discipline & Healthy Habits",
        "Foundational Communication",
        "Teamwork & Friendship",
        "Basic Problem-Solving",
        "Emotion Recognition",
        "Goal Setting for Beginners"
      ],
      color: "from-primary to-primary/80",
      icon: Sparkles
    },
    {
      level: "Builders",
      badge: "Builder Badge",
      years: "Years 3-4", 
      ages: "12-13",
      terms: 6,
      focus: "Communication, collaboration, creativity, leadership.",
      subjects: [
        "Communication & Presentation",
        "Collaboration Skills",
        "Creative Thinking",
        "Leadership Foundations",
        "Time Management & Organization",
        "Ethics & Values",
        "Team Building",
        "Creative Problem-Solving"
      ],
      color: "from-secondary to-secondary/80",
      icon: Users
    },
    {
      level: "Innovators",
      badge: "Innovator Badge",
      years: "Years 5-6",
      ages: "14-15", 
      terms: 6,
      focus: "Critical thinking, problem-solving, resilience, innovation.",
      subjects: [
        "Critical Thinking & Analysis",
        "Innovation & Design Thinking",
        "Project Management",
        "Resilience & Mental Strength",
        "Advanced Problem-Solving",
        "Digital Literacy & Innovation",
        "Public Speaking & Persuasion",
        "Entrepreneurial Mindset"
      ],
      color: "from-accent to-accent/80",
      icon: Target
    },
    {
      level: "Pathfinders",
      badge: "Pathfinder Badge",
      years: "Years 7-8",
      ages: "16-17",
      terms: 6,
      focus: "Strategy, leadership ethics, financial literacy, global citizenship.",
      subjects: [
        "Strategic Leadership",
        "Leadership Ethics & Values",
        "Financial Literacy & Management",
        "Global Citizenship",
        "Career Strategy & Development",
        "Social Impact & Responsibility",
        "Mentorship & Coaching",
        "Future Planning & Vision"
      ],
      color: "from-muted to-muted/80",
      icon: Globe
    }
  ];

  const graduationAward = {
    title: "Future-Ready Leader Award",
    age: "18",
    description: "Final capstone project & graduation recognition. Equivalent in prestige to global certificates (similar in positioning to IELTS/TOEFL in languages).",
    subjects: [
      "Capstone Leadership Project",
      "Public Presentation & Defense",
      "10-Year Life Vision Plan",
      "Community Impact Initiative"
    ],
    color: "from-primary via-accent to-secondary"
  };

  const features = [
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Learn at your own pace with 24/7 access to materials",
      color: "from-primary/10 to-primary/20"
    },
    {
      icon: Users,
      title: "Interactive Learning", 
      description: "Group projects, discussions, and peer-to-peer learning",
      color: "from-secondary/10 to-secondary/20"
    },
    {
      icon: Target,
      title: "Practical Application",
      description: "Real-world scenarios and hands-on projects",
      color: "from-accent/10 to-accent/20"
    },
    {
      icon: Award,
      title: "Certification",
      description: "Receive certificates upon completion of each level",
      color: "from-muted/10 to-muted/20"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Visuals */}
      <section id="curriculum-top" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-95"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%)] animate-pulse"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
              <BookOpen className="h-5 w-5 text-white" />
              <span className="text-white font-medium">8-Year Comprehensive Program</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
              TMA Curriculum
              <span className="block text-3xl md:text-4xl font-medium text-white/90 mt-4">
                Future Ready Leaders
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto">
              A comprehensive 8-year, 24-term program for ages 10–18 designed to develop 
              complete leadership and life skills through innovative, age-appropriate learning
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Download className="mr-2 h-5 w-5" />
                Download Full Curriculum PDF
              </Button>
              <div className="flex items-center gap-2 text-white/80">
                <Trophy className="h-4 w-4" />
                <span className="text-sm font-medium">Globally Recognized Program</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Overview with Enhanced Design */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium text-sm">The TMA Journey</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-8 leading-tight">
              TMA Challenger Journey
            </h2>
            
            <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-3xl p-8 mb-8 max-w-4xl mx-auto border border-primary/10">
              <div className="flex flex-wrap justify-center items-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">8</div>
                  <div className="text-sm text-foreground/70">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">10-18</div>
                  <div className="text-sm text-foreground/70">Age Range</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">24</div>
                  <div className="text-sm text-foreground/70">Terms</div>
                </div>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed">
                4 Progressive Levels + Future-Ready Leader Award. All participants are TMA Challengers — future-ready leaders in training.
              </p>
            </div>
          </div>

          <div className="space-y-16">
            {curriculumLevels.map((level, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-elegant)] overflow-hidden hover:shadow-[var(--shadow-glow)] transition-all duration-500 cursor-pointer group bg-gradient-to-br from-background to-muted/10">
                <div className={`h-3 bg-gradient-to-r ${level.color}`}></div>
                <div className="grid lg:grid-cols-12 gap-8 p-10">
                  {/* Level Info */}
                  <div className="lg:col-span-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${level.color}`}>
                        <level.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {level.years} • Ages {level.ages}
                        </Badge>
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-foreground mb-6 leading-tight">
                      {level.level}
                      <span className="block text-lg font-medium text-foreground/70 mt-2">
                        Level
                      </span>
                    </h3>
                    
                    {/* Enhanced Badge Section */}
                    <div className="mb-8 p-6 bg-gradient-to-br from-muted/20 to-background rounded-2xl border border-border/50">
                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src="/src/assets/tma-badge-per-term-solid.svg" 
                          alt="Per Term Badge" 
                          className="w-8 h-8"
                          loading="lazy"
                        />
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            Per Term Investment
                          </p>
                          <p className="text-xs text-foreground/60">
                            10 Sessions • Affordable Pricing
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-foreground/70 mb-3">
                        Duration: {level.level === 'Explorers' ? '45–50 min per session' : '70 min per session'}
                      </p>
                      <p className="text-xs text-foreground/60 italic">
                        Final fees confirmed during registration based on program format and cohort availability.
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 mb-6">
                      <p className="text-foreground font-semibold">
                        {level.focus}
                      </p>
                    </div>
                    
                    <div className="flex items-center text-foreground/70 mb-6">
                      <BookOpen className="h-5 w-5 mr-3 text-primary" />
                      <span className="font-medium">{level.terms} comprehensive terms</span>
                    </div>
                  </div>
                  
                  {/* Subjects Grid */}
                  <div className="lg:col-span-8">
                    <h4 className="text-xl font-semibold text-foreground mb-8 flex items-center gap-2">
                      <Target className="h-5 w-5 text-accent" />
                      Core Learning Subjects
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      {level.subjects.map((subject, subjectIndex) => (
                        <div key={subjectIndex} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-muted/10 to-background border border-border/30 hover:border-primary/20 transition-all duration-300">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-foreground/80 font-medium">{subject}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        size="lg"
                        asChild
                      >
                        <Link to="/apply">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Register for {level.level}
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-primary/20 text-primary hover:bg-primary/5"
                        asChild
                      >
                        <Link to="#fees-faq">
                          Learn About Fees
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Enhanced Future-Ready Leader Award */}
            <Card className="border-none shadow-[var(--shadow-glow)] overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-2 border-primary/20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 opacity-50"></div>
              <div className={`h-3 bg-gradient-to-r ${graduationAward.color}`}></div>
              
              <div className="p-12 relative z-10">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary via-accent to-secondary rounded-full mb-8 shadow-2xl animate-pulse">
                    <Trophy className="h-12 w-12 text-white" />
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                    🎓 {graduationAward.title}
                  </h3>
                  
                  <Badge className="mb-6 bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border-2 border-primary/30 font-bold text-xl px-6 py-3 rounded-2xl">
                    Age {graduationAward.age} • Graduation Excellence
                  </Badge>
                  
                  <p className="text-xl text-foreground/80 font-semibold leading-relaxed mb-8 max-w-3xl mx-auto">
                    {graduationAward.description}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
                    <h4 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Capstone Requirements
                    </h4>
                    <div className="space-y-4">
                      {graduationAward.subjects.map((subject, subjectIndex) => (
                        <div key={subjectIndex} className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-foreground/80 font-medium">{subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
                    <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Globe className="h-5 w-5 text-accent" />
                      Global Recognition
                    </h4>
                    <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
                      This award holds the same prestige as internationally recognized certificates like IELTS or TOEFL in their respective fields.
                    </p>
                    <Button 
                      className="w-full bg-gradient-to-r from-primary via-accent to-secondary text-white hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                      size="lg"
                      asChild
                    >
                      <Link to="/apply#register">
                        <Trophy className="mr-2 h-4 w-4" />
                        Begin Your Journey
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Learning Features */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
              <Target className="h-4 w-4 text-accent" />
              <span className="text-accent font-medium text-sm">Learning Experience</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              How We Deliver Excellence
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Our innovative approach combines theory with practice to ensure 
              effective learning and real-world skill application.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] text-center hover:shadow-[var(--shadow-elegant)] transition-all duration-300 transform hover:scale-105 group bg-gradient-to-br from-background to-muted/10">
                <CardHeader className="pb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-foreground text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment & Certification */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
                Assessment & Certification
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-none shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="text-tma-blue">Assessment Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-tma-teal rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-tma-navy">Project-Based Learning</h4>
                      <p className="text-sm text-tma-gray">Real-world projects that demonstrate skill application</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-tma-teal rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-tma-navy">Peer Assessments</h4>
                      <p className="text-sm text-tma-gray">Collaborative evaluation and feedback sessions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-tma-teal rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-tma-navy">Self-Reflection</h4>
                      <p className="text-sm text-tma-gray">Regular self-assessment and goal-setting exercises</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="text-tma-teal">Certification Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-tma-blue rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-tma-navy">Term Completion</h4>
                      <p className="text-sm text-tma-gray">Certificates awarded upon successful completion of each term</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-tma-blue rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-tma-navy">Level Certification</h4>
                      <p className="text-sm text-tma-gray">Advanced certificates for completing each level</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-tma-blue rounded-full mr-3 mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-tma-navy">Future-Ready Leader Award</h4>
                      <p className="text-sm text-tma-gray">Prestigious graduation award upon completing the full 8-year program</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="fees-faq" className="py-20 bg-tma-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-12 text-center">
              Pricing FAQ
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-tma-navy">Q: How much are the fees?</h4>
                  <p className="text-tma-gray leading-relaxed">TMA fees are affordable per-term investments. Each term includes 10 sessions. Exact fees are confirmed during registration and depend on program format (online/offline) and cohort size.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-tma-navy">Q: What does one term include?</h4>
                  <p className="text-tma-gray leading-relaxed">10 sessions, learning materials, progress tracking, and parent updates. Level 1 sessions are 45–50 min; Levels 2–4 are 70 min.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-tma-navy">Q: Do you offer scholarships or payment plans?</h4>
                  <p className="text-tma-gray leading-relaxed">Yes. Need-based support and installment plans are available for eligible families. Please ask during registration.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-tma-navy">Q: Why "per term" instead of monthly?</h4>
                  <p className="text-tma-gray leading-relaxed">Our curriculum runs in 10-session terms. This keeps teaching, projects, and assessments aligned and avoids monthly billing confusion.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Downloads & Resources */}
      <section className="py-20 bg-gradient-to-r from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Download Resources
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Get detailed information about our curriculum, sample lessons, 
              and guidance materials.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-none shadow-[var(--shadow-card)] text-center">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-tma-teal to-tma-blue rounded-full mb-4">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-tma-navy">Full Curriculum Guide</CardTitle>
                <CardDescription>Complete 8-year program overview</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Download PDF
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-[var(--shadow-card)] text-center">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-tma-teal to-tma-blue rounded-full mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-tma-navy">Sample Lessons</CardTitle>
                <CardDescription>Preview our teaching methodology</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Download PDF
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-[var(--shadow-card)] text-center">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-tma-teal to-tma-blue rounded-full mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-tma-navy">Parent Guide</CardTitle>
                <CardDescription>Supporting your teenager's journey</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              Ready to Start the Journey?
            </h2>
            <p className="text-xl text-tma-gray mb-8">
              Join our comprehensive program and unlock your teenager's 
              leadership potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/apply">Apply Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Have Questions?</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CurriculumPage;
