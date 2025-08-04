import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, BookOpen, Users, Clock, Target, Award } from "lucide-react";
import { Link } from "react-router-dom";

const CurriculumPage = () => {
  const curriculumLevels = [
    {
      level: "Explorers",
      badge: "Explorer Badge",
      years: "Years 1-2",
      ages: "10-11",
      terms: 6,
      focus: "Pre-TMA Foundation - Self-Discovery & Basic Life Skills",
      subjects: [
        "Self-Awareness & Confidence",
        "Basic Communication Skills", 
        "Goal Setting for Kids",
        "Friendship & Social Skills",
        "Basic Problem-Solving",
        "Time Management Basics",
        "Emotion Recognition",
        "Healthy Habits",
        "Introduction to Leadership"
      ],
      color: "from-green-500 to-teal-500"
    },
    {
      level: "Builders",
      badge: "Builder Badge",
      years: "Years 3-5",
      ages: "12-14",
      terms: 9,
      focus: "Foundations of Leadership, Discipline & Emotional Intelligence",
      subjects: [
        "Leadership Foundations",
        "Emotional Intelligence Basics", 
        "Communication & Presentation",
        "Time Management & Organization",
        "Goal Achievement Strategies",
        "Team Collaboration",
        "Basic Psychology Principles",
        "Ethics & Values",
        "Creative Problem-Solving"
      ],
      color: "from-blue-500 to-teal-500"
    },
    {
      level: "Innovators", 
      badge: "Innovator Badge",
      years: "Years 6-7",
      ages: "15-16",
      terms: 6,
      focus: "Advanced Leadership, Communication & Innovation Skills",
      subjects: [
        "Advanced Leadership Principles",
        "Innovation & Creative Thinking",
        "Project Management",
        "Public Speaking & Persuasion",
        "Conflict Resolution",
        "Digital Innovation",
        "Decision Making & Critical Thinking",
        "Cultural Awareness",
        "Entrepreneurial Mindset"
      ],
      color: "from-teal-500 to-blue-600"
    },
    {
      level: "Pathfinders",
      badge: "Pathfinder Badge",
      years: "Years 8-9", 
      ages: "17-18",
      terms: 7,
      focus: "Professional Leadership, Career Preparation & Life Mastery",
      subjects: [
        "Strategic Leadership",
        "Advanced Psychology & Behavior",
        "Business & Entrepreneurship",
        "Mentorship & Coaching",
        "Change Management",
        "Global Leadership",
        "Career Planning & Development",
        "Social Impact & Responsibility",
        "Life Skills Mastery"
      ],
      color: "from-blue-600 to-indigo-600"
    }
  ];

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
              A comprehensive 8-year, 28-term program for ages 10–18 designed to develop 
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
              Program Structure
            </h2>
            <p className="text-xl text-tma-gray max-w-3xl mx-auto mb-8">
              Our curriculum is divided into four progressive levels, each building 
              upon the previous one to ensure comprehensive skill development from pre-teens to young adults.
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold text-primary mb-3">Pre-TMA Foundation Program</h3>
              <p className="text-foreground/80">
                Starting at age 10, our foundation program introduces essential life skills 
                and leadership concepts in an age-appropriate, engaging environment.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            {curriculumLevels.map((level, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] overflow-hidden">
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
                    <h3 className="text-2xl font-bold text-tma-navy mb-2">
                      {level.level} Level
                    </h3>
                    <Badge variant="secondary" className="mb-3 w-fit">
                      Challenger - {level.badge}
                    </Badge>
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
                    <div className="grid md:grid-cols-2 gap-3">
                      {level.subjects.map((subject, subjectIndex) => (
                        <div key={subjectIndex} className="flex items-center text-sm text-tma-gray">
                          <div className="w-2 h-2 bg-tma-teal rounded-full mr-3 flex-shrink-0"></div>
                          {subject}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
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
                      <h4 className="font-semibold text-tma-navy">Master Diploma</h4>
                      <p className="text-sm text-tma-gray">Comprehensive diploma upon completing the full 8-year program</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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