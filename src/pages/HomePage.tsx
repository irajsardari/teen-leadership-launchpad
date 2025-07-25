import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, BookOpen, Target, Star, Award, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-academy.jpg";

const HomePage = () => {
  const ageGroups = [
    {
      title: "Foundation Level",
      ageRange: "12-15 years",
      description: "Building essential life skills and leadership foundations",
      features: ["Basic Leadership", "Communication Skills", "Time Management", "Goal Setting"],
      color: "from-blue-500 to-teal-500"
    },
    {
      title: "Development Level", 
      ageRange: "15-17 years",
      description: "Advanced management principles and emotional intelligence",
      features: ["Team Leadership", "Emotional Intelligence", "Project Management", "Public Speaking"],
      color: "from-teal-500 to-blue-600"
    },
    {
      title: "Mastery Level",
      ageRange: "17-19 years", 
      description: "Professional leadership and advanced life skills mastery",
      features: ["Strategic Thinking", "Advanced Psychology", "Business Skills", "Mentorship"],
      color: "from-blue-600 to-indigo-600"
    }
  ];

  const stats = [
    { icon: Users, value: "1000+", label: "Students Empowered" },
    { icon: Globe, value: "25+", label: "Countries Reached" },
    { icon: Award, value: "7", label: "Year Curriculum" },
    { icon: Star, value: "4.9", label: "Parent Rating" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-tma-blue via-tma-blue-light to-tma-teal">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Empowering Tomorrow's
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Leaders Today
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              TMA teaches leadership, management, psychology, and essential life skills 
              to teenagers aged 12-19 through our comprehensive 7-year curriculum.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4" asChild>
                <Link to="/apply">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline-hero" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-tma-blue" asChild>
                <Link to="/curriculum">
                  Explore Curriculum
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-tma-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-tma-blue to-tma-teal rounded-full mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-tma-navy mb-2">{stat.value}</div>
                <div className="text-tma-gray">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              Our Mission & Vision
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-none shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="text-tma-blue flex items-center">
                    <Target className="h-6 w-6 mr-2" />
                    Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-tma-gray">
                    To empower teenagers worldwide with essential leadership, management, 
                    and life skills that will serve them throughout their personal and 
                    professional journeys.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="text-tma-teal flex items-center">
                    <BookOpen className="h-6 w-6 mr-2" />
                    Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-tma-gray">
                    A world where every teenager is equipped with the confidence, 
                    skills, and mindset to become effective leaders and contribute 
                    positively to society.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Age Groups Section */}
      <section className="py-20 bg-gradient-to-b from-background to-tma-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              Learning Paths by Age Group
            </h2>
            <p className="text-xl text-tma-gray max-w-3xl mx-auto">
              Our curriculum is carefully designed to match the developmental stage 
              and learning capacity of each age group.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {ageGroups.map((group, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader>
                  <div className={`w-full h-2 bg-gradient-to-r ${group.color} rounded-full mb-4`}></div>
                  <CardTitle className="text-tma-navy">{group.title}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-tma-blue">
                    {group.ageRange}
                  </CardDescription>
                  <p className="text-tma-gray">{group.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {group.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-tma-gray">
                        <div className="w-2 h-2 bg-tma-teal rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/age-groups">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose TMA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              Why Choose TMA?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Comprehensive Curriculum",
                description: "7-year program covering leadership, management, psychology, and life skills",
                icon: BookOpen
              },
              {
                title: "Age-Appropriate Learning",
                description: "Tailored content that matches cognitive and emotional development stages",
                icon: Users
              },
              {
                title: "Global Community",
                description: "Connect with like-minded teenagers from around the world",
                icon: Globe
              },
              {
                title: "Expert Instructors",
                description: "Learn from experienced educators and industry professionals",
                icon: Award
              },
              {
                title: "Practical Application",
                description: "Real-world projects and scenarios to apply what you learn",
                icon: Target
              },
              {
                title: "Flexible Learning",
                description: "Online platform accessible anytime, anywhere, at your own pace",
                icon: Star
              }
            ].map((benefit, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] text-center">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-tma-blue to-tma-teal rounded-full mb-4">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-tma-navy">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-tma-gray">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Unlock Your Leadership Potential?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of teenagers worldwide who are building the skills 
              they need for a successful future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg" className="bg-white text-tma-blue hover:bg-gray-100" asChild>
                <Link to="/apply">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline-hero" size="lg" className="border-white text-white hover:bg-white hover:text-tma-blue" asChild>
                <a href="https://tma.academy/portal" target="_blank" rel="noopener noreferrer">
                  Access Learning Portal
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;