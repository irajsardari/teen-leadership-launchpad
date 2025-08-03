import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Target, Users, Trophy, Lightbulb, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import ChallengerForm from "@/components/ChallengerForm";
import { Helmet } from "react-helmet-async";

const ChallengerPage = () => {
  const benefits = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Goal-Oriented Learning",
      description: "Set and achieve meaningful objectives in your personal and academic growth"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Leadership Skills",
      description: "Develop confidence, communication, and team management abilities"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Academic Excellence",
      description: "Master study techniques and critical thinking skills for lifelong success"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Innovation Mindset",
      description: "Think creatively and solve problems with entrepreneurial thinking"
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Achievement Recognition",
      description: "Earn certificates and recognition for your progress and accomplishments"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Personal Growth",
      description: "Build emotional intelligence and resilience for life's challenges"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Join as a Challenger - Start Your Journey | TMA Academy</title>
        <meta name="description" content="Begin your transformation journey at TMA Academy. For students aged 12-19 ready to become future leaders." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-6 text-sm font-medium">
                For Students Aged 10-18 | Future Ready Leaders
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Join as a{" "}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Challenger
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-8">
                Join TMA and start your leadership journey today.
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Transform yourself into a confident, capable leader ready to take on any challenge. 
                Join thousands of pre-teens and teenagers who have already begun their journey to becoming Future Ready Leaders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg" asChild>
                  <a href="#register">
                    Register Now <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg" asChild>
                  <Link to="/curriculum">
                    Explore Curriculum
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Gain Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                What You'll Gain as a Challenger
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive program is designed to unlock your potential and prepare you for future success
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Registration Section */}
        <section id="register" className="py-16 px-4 sm:px-6 lg:px-8 bg-background/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Register as a Challenger
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Take the first step towards becoming a Future Ready Leader. Fill out the registration form below and we'll get you started.
              </p>
            </div>

            <ChallengerForm />
            
            {/* Trademark Notice */}
            <div className="mt-8 pt-6 border-t border-border/20 text-center">
              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                <span className="font-semibold">TMA®</span> (Teenagers Management and Leadership Academy) is a registered trademark.
                By registering, you acknowledge that all TMA curriculum content and brand assets are protected under applicable intellectual property laws.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-12">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Have Questions?
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Our team is here to help you understand the program and guide you through the enrollment process.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
                    <Link to="/contact">
                      Contact Us
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
                    <Link to="/about">
                      Learn More About TMA
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default ChallengerPage;