import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail, Users, BookOpen, Heart, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const FAQPage = () => {
  const faqs = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      question: "What is TMA and how is it different from a school?",
      answer: "The Teenagers Management Academy (TMA) is not a school. It is a world-first educational platform that focuses on leadership, emotional intelligence, time and money management, communication, and real-life readiness for teenagers aged 10 to 18. We teach what traditional schools often miss — the tools to live, lead, and grow."
    },
    {
      icon: <Users className="h-6 w-6" />,
      question: "What ages does TMA serve?",
      answer: "TMA is designed for young people aged 10 to 18, divided across four levels plus a graduation award:",
      details: [
        "• Level 1: Explorers (Ages 10–11)",
        "• Level 2: Builders (Ages 12–13)",
        "• Level 3: Innovators (Ages 14–15)",
        "• Level 4: Pathfinders (Ages 16–17)",
        "• Future-Ready Leader Award (Age 18)"
      ],
      additionalText: "Each level includes 6 terms (2 years) with unique themes and life skills, culminating in a prestigious graduation award."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      question: "Is TMA based on a specific educational or religious model?",
      answer: "TMA is values-based and culturally respectful. We combine global best practices in psychology, sociology, leadership, management, and educational science — while honoring the ethical and cultural frameworks of each community we serve."
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      question: "How can I enroll my teenager in TMA?",
      answer: "You can express your interest via our registration form or by contacting us directly through the website. Our team will reach out with the next steps based on your location and your child's age."
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      question: "Can I see the full curriculum before registration?",
      answer: "We provide a general overview of our philosophy, levels, and topics. The full curriculum is reserved for registered families, partner schools, and certified educators to protect the originality and integrity of our program."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-r from-primary via-primary to-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-8">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Find answers to common questions about TMA and our unique approach to teenage leadership development.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-start gap-4 text-xl md:text-2xl">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        {faq.icon}
                      </div>
                      <span className="flex-1">{faq.question}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pl-16">
                    <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                      {faq.answer}
                    </p>
                    {faq.details && (
                      <div className="space-y-2 mb-4">
                        {faq.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground text-lg">
                            {detail}
                          </p>
                        ))}
                      </div>
                    )}
                    {faq.additionalText && (
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {faq.additionalText}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator className="my-16" />

            {/* Contact Section */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  📩 Still have questions?
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  We'd love to hear from you. Our team is here to help with any additional questions about TMA programs and enrollment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="mailto:info@teenmanagement.com">
                      Send Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Resources */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Explore More Resources
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/curriculum">View Curriculum</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/about">About TMA</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/apply">Apply Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;