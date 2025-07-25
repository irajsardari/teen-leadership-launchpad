import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Globe, Award, Target, Heart, BookOpen, Brain, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const differentiators = [
    {
      icon: Globe,
      title: "Global-first concept",
      description: "No other academy offers this 7-year teen development structure"
    },
    {
      icon: Brain,
      title: "Multidisciplinary curriculum", 
      description: "Combining psychology, strategy, finance, leadership, ethics, and communication"
    },
    {
      icon: Target,
      title: "Age-appropriate design",
      description: "Clear stages for growth: ages 12–15, 15–17, 17–19"
    },
    {
      icon: Award,
      title: "Real outcomes",
      description: "Confidence, decision-making, project planning, emotional strength"
    },
    {
      icon: Heart,
      title: "Vision beyond school",
      description: "We prepare leaders, not just graduates"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-inter">
              About Us – TMA: Teenagers Management Academy
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 font-inter">
              The world's first full-scale leadership and life skills academy built specifically for teenagers aged 12 to 19
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
                🔹 Who We Are
              </h2>
            </div>
            
            <div className="text-lg text-foreground/80 space-y-6 font-inter">
              <p className="text-xl leading-relaxed">
                TMA is the world's first full-scale leadership and life skills academy built specifically for teenagers aged 12 to 19.
              </p>
              
              <p className="leading-relaxed">
                Founded in the GCC and expanding globally, TMA offers a 7-year, 21-term curriculum that blends management, emotional intelligence, finance, psychology, digital literacy, and leadership — all designed to prepare students for real life, not just academics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
                🔹 Why We Exist
              </h2>
            </div>
            
            <div className="text-lg text-foreground/80 space-y-6 font-inter">
              <p className="leading-relaxed">
                Teenagers today face a world full of challenges — from anxiety and peer pressure to information overload and unclear life direction. Traditional education often doesn't equip them for these realities.
              </p>
              
              <p className="text-xl font-semibold text-primary">
                TMA was created to fill this gap.
              </p>
              
              <p className="leading-relaxed">
                We give teenagers the tools to understand themselves, lead others, make wise decisions, and thrive in school, work, and life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
              🔹 What Makes Us Different
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentiators.map((item, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] text-center hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-tma-blue to-tma-teal rounded-full mb-4">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-primary font-inter">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 font-inter">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 font-inter">
              🔹 Our Philosophy
            </h2>
            <blockquote className="text-2xl md:text-3xl font-semibold text-primary italic font-inter">
              "Every teenager is a leader in the making — they just need the right education to unlock their power."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 font-inter">
              🔹 Our Vision
            </h2>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed font-inter">
              To build a generation of emotionally intelligent, ethically grounded, future-ready leaders who shape their lives — and the world — with confidence, purpose, and skill.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
              👤 Meet the Founder
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-none shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="flex-shrink-0">
                    <Avatar className="w-32 h-32 md:w-40 md:h-40">
                      <AvatarImage src="/lovable-uploads/5e280412-042c-48a8-b542-ef7929e003f9.png" alt="Dr. Iraj Sardari Baf" />
                      <AvatarFallback className="text-2xl font-bold">IS</AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2 font-inter">
                      Dr. Iraj Sardari Baf
                    </h3>
                    <p className="text-lg text-tma-coral mb-6 font-inter">
                      Founder of Teenagers Management Academy (TMA)
                    </p>
                    
                    <div className="space-y-4 text-foreground/80 font-inter">
                      <p className="leading-relaxed">
                        Dr. Iraj Sardari Baf is a visionary educator, strategist, and leadership expert with over two decades of senior executive experience in banking and management. Holding a PhD in Business Management and Organizational Behavior, alongside degrees in English and Linguistics, Dr. Sardari brings a rare blend of academic depth, human insight, and real-world leadership to his work.
                      </p>
                      
                      <p className="leading-relaxed">
                        Driven by a bold question — "Why do we wait until adulthood to teach people how to lead their lives?" — he created TMA, the world's first full-scale leadership and life-skills academy for teenagers.
                      </p>
                      
                      <p className="leading-relaxed">
                        Under his guidance, TMA is not just a curriculum — it's a transformative movement. One that empowers youth with the tools of emotional intelligence, strategic thinking, financial literacy, and character-based leadership — starting at the most critical age: adolescence.
                      </p>
                      
                      <blockquote className="text-lg md:text-xl font-semibold text-primary italic border-l-4 border-tma-coral pl-4 my-6">
                        "Teenagers are not too young to lead — they're just too often overlooked. My mission is to give them what school never taught: the power to lead themselves and others with purpose."
                      </blockquote>
                      
                      <p className="leading-relaxed">
                        Dr. Sardari's work bridges education, psychology, and management — and reflects his deep belief that real leadership starts with self-awareness, guided by values, and shaped through mentorship.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-gradient-to-r from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-inter">
              Our Global Impact
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 font-inter">1000+</div>
              <div className="text-blue-100 font-inter">Students Empowered</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 font-inter">25+</div>
              <div className="text-blue-100 font-inter">Countries Reached</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 font-inter">7</div>
              <div className="text-blue-100 font-inter">Year Curriculum</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2 font-inter">4.9/5</div>
              <div className="text-blue-100 font-inter">Student Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-inter">
              Join Our Community
            </h2>
            <p className="text-xl text-foreground/80 mb-8 font-inter">
              Become part of a global community of young leaders committed to 
              personal growth and positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#FF715B] hover:bg-[#FF715B]/90 text-white font-inter" asChild>
                <Link to="/apply">Apply Now</Link>
              </Button>
              <Button size="lg" className="bg-transparent border-2 border-[#012D5A] text-[#012D5A] hover:bg-[#F8F4EE] font-inter" variant="outline" asChild>
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