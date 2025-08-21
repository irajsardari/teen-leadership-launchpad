import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, BookOpen, Users, Clock, Target, Award, ArrowRight } from "lucide-react";
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
      color: "from-green-500 to-teal-500"
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
      color: "from-blue-500 to-teal-500"
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
      color: "from-teal-500 to-blue-600"
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
      color: "from-blue-600 to-indigo-600"
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
    color: "from-tma-gold to-tma-teal"
  };

  const features = [
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Learn at your own pace with 24/7 access to materials"
    },
    {
      icon: Users,
      title: "Interactive Learning",
      description: "Group projects, discussions, and peer-to-peer learning"
    },
    {
      icon: Target,
      title: "Practical Application",
      description: "Real-world scenarios and hands-on projects"
    },
    {
      icon: Award,
      title: "Certification",
      description: "Receive certificates upon completion of each level"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="curriculum-top" className="py-20 bg-gradient-to-br from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              TMA Curriculum Overview
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              TMA — Teenagers Management Academy<br />
              Future Ready Leaders<br /><br />
              A comprehensive 8-year, 24-term program for ages 10–18 designed to develop 
              complete leadership and life skills
            </p>
            <Button variant="accent" size="lg" className="bg-white text-tma-blue hover:bg-gray-100">
              <Download className="mr-2 h-5 w-5" />
              Download Full Curriculum PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              TMA Challenger Journey
            </h2>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold text-primary mb-2">Total: 8 Years | Ages 10–18 | 24 Terms</h3>
              <p className="text-foreground/80">
                4 Levels + Future-Ready Leader Award. All participants are TMA Challengers — future-ready leaders in training.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            {curriculumLevels.map((level, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all duration-300 cursor-pointer group">
                <div className={`h-2 bg-gradient-to-r ${level.color}`}></div>
                <div className="grid lg:grid-cols-3 gap-8 p-8">
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="secondary" className="text-sm">
                        {level.years}
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        Ages {level.ages}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-tma-navy mb-4">
                      {level.level} Level
                    </h3>
                    
                    {/* Badge */}
                    <div className="mb-4">
                      <img 
                        src="/src/assets/tma-badge-per-term-solid.svg" 
                        alt="Per Term • 10 Sessions" 
                        className="term-badge mb-3"
                        loading="lazy"
                      />
                      <p className="text-sm font-semibold text-tma-navy mb-2">
                        Affordable investment per term. Exact fee is shared during registration.
                      </p>
                      <p className="text-sm text-tma-gray mb-3">
                        Duration: {level.level === 'Explorers' ? '45–50 min per session • 10 sessions per term' : '70 min per session • 10 sessions per term'}
                      </p>
                      <p className="note">
                        Final fees are confirmed during registration based on program format and cohort availability.
                      </p>
                    </div>
                    
                    <p className="text-tma-blue font-semibold mb-4">
                      {level.focus}
                    </p>
                    <div className="flex items-center text-tma-gray mb-4">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{level.terms} terms</span>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <h4 className="text-lg font-semibold text-tma-navy mb-4">
                      Core Subjects
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3 mb-6">
                      {level.subjects.map((subject, subjectIndex) => (
                        <div key={subjectIndex} className="flex items-center text-sm text-tma-gray">
                          <div className="w-2 h-2 bg-tma-teal rounded-full mr-3 flex-shrink-0"></div>
                          {subject}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <Link to="/apply" className="register-btn w-full text-center no-underline block">
                        Register for {level.level}
                      </Link>
                      <a href="#fees-faq" className="ask-fees block text-center">
                        Ask About Fees
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Future-Ready Leader Award */}
            <Card className="border-none shadow-[var(--shadow-elegant)] overflow-hidden bg-gradient-to-br from-tma-gold/10 via-background to-tma-teal/10 border-2 border-tma-gold/30">
              <div className={`h-2 bg-gradient-to-r ${graduationAward.color}`}></div>
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-tma-gold to-tma-teal rounded-full mb-6 shadow-lg">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-tma-navy mb-4">
                    🎓 {graduationAward.title}
                  </h3>
                  <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-tma-gold/20 to-tma-teal/20 text-tma-navy border-2 border-tma-gold/40 font-bold text-lg p-3 rounded-2xl">
                    Age {graduationAward.age}
                  </Badge>
                  <p className="text-tma-blue font-semibold text-lg mb-6">
                    {graduationAward.description}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-tma-navy mb-4">
                      Capstone Requirements
                    </h4>
                    <div className="space-y-3">
                      {graduationAward.subjects.map((subject, subjectIndex) => (
                        <div key={subjectIndex} className="flex items-center text-sm text-tma-gray">
                          <div className="w-2 h-2 bg-tma-gold rounded-full mr-3 flex-shrink-0"></div>
                          {subject}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-tma-light/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-tma-navy mb-3">
                      Global Recognition
                    </h4>
                    <p className="text-sm text-tma-gray mb-4">
                      This award holds the same prestige as internationally recognized certificates like IELTS or TOEFL in their respective fields.
                    </p>
                    <Button 
                      className="w-full bg-gradient-to-r from-tma-gold to-tma-teal text-white hover:opacity-90 transition-all duration-300"
                      asChild
                    >
                      <Link to="/apply#register">
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

      {/* Learning Features */}
      <section className="py-20 bg-tma-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              Learning Experience
            </h2>
            <p className="text-xl text-tma-gray max-w-3xl mx-auto">
              Our innovative approach combines theory with practice to ensure 
              effective learning and skill application.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] text-center">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-tma-blue to-tma-teal rounded-full mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-tma-navy">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-tma-gray">{feature.description}</p>
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