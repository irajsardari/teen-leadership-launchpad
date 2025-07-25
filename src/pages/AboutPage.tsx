import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Award, Target, Heart, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & Academic Director", 
      description: "PhD in Educational Psychology with 15+ years in youth development",
      image: "photo-1494790108755-2616b612b789"
    },
    {
      name: "Michael Chen",
      role: "Leadership Program Director",
      description: "Former Fortune 500 executive specializing in leadership training",
      image: "photo-1472099645785-5658abf4ff4e"
    },
    {
      name: "Dr. Amanda Rodriguez",
      role: "Psychology & Emotional Intelligence Lead",
      description: "Licensed psychologist with expertise in adolescent development",
      image: "photo-1559839734-2b71ea197ec2"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Empowerment",
      description: "We believe every teenager has the potential to become a leader"
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for the highest standards in education and character development"
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "We prepare students for success in an interconnected world"
    },
    {
      icon: Users,
      title: "Community",
      description: "We foster a supportive environment where students learn from each other"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About TMA
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Pioneering the future of youth leadership education since 2020
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
                Our Story
              </h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-tma-gray">
              <p className="text-xl leading-relaxed mb-6">
                The Teenagers Management Academy was founded with a simple yet powerful vision: 
                to bridge the gap between traditional education and the real-world skills young 
                people need to thrive in the 21st century.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Our founders recognized that while academic subjects are important, teenagers 
                also need practical skills in leadership, emotional intelligence, communication, 
                and personal management. These skills, often overlooked in traditional curricula, 
                are crucial for personal success and societal contribution.
              </p>
              
              <p className="text-lg leading-relaxed mb-8">
                Since our inception, we've empowered over 1,000 students across 25 countries, 
                helping them develop the confidence, skills, and mindset needed to become 
                effective leaders in their communities and future careers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-tma-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="border-none shadow-[var(--shadow-card)] h-full">
                <CardHeader>
                  <CardTitle className="text-2xl text-tma-blue flex items-center">
                    <Target className="h-8 w-8 mr-3" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-lg">
                  <p className="text-tma-gray leading-relaxed">
                    To empower teenagers worldwide with essential leadership, management, 
                    psychology, and life skills through innovative, age-appropriate education 
                    that prepares them for personal and professional success.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-[var(--shadow-card)] h-full">
                <CardHeader>
                  <CardTitle className="text-2xl text-tma-teal flex items-center">
                    <BookOpen className="h-8 w-8 mr-3" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-lg">
                  <p className="text-tma-gray leading-relaxed">
                    A world where every teenager is equipped with the confidence, skills, 
                    and mindset to become an effective leader, contributing positively to 
                    their communities and creating meaningful change in society.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-tma-gray max-w-3xl mx-auto">
              These values guide everything we do at TMA and shape our approach to education
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] text-center hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-tma-blue to-tma-teal rounded-full mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-tma-navy">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-tma-gray">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gradient-to-b from-background to-tma-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              Our Leadership Team
            </h2>
            <p className="text-xl text-tma-gray max-w-3xl mx-auto">
              Meet the experienced educators and professionals who guide our mission
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] text-center">
                <CardHeader>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-tma-blue to-tma-teal">
                    <img 
                      src={`https://images.unsplash.com/${member.image}?auto=format&fit=crop&w=200&h=200`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-tma-navy">{member.name}</CardTitle>
                  <CardDescription className="text-tma-blue font-semibold">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-tma-gray text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-gradient-to-r from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our Global Impact
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Students Empowered</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">25+</div>
              <div className="text-blue-100">Countries Reached</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Completion Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">4.9/5</div>
              <div className="text-blue-100">Student Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-tma-gray mb-8">
              Become part of a global community of young leaders committed to 
              personal growth and positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/apply">Apply Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
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