import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Users, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PortalPage = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Interactive Learning Modules",
      description: "Engaging content designed specifically for teenage learners"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Peer Collaboration",
      description: "Connect and learn alongside fellow challengers worldwide"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Personalized Schedules",
      description: "Flexible learning paths that adapt to your lifestyle"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Learning Portal - Coming Soon | TMA Academy</title>
        <meta name="description" content="Our comprehensive student learning platform is under development and will launch soon with exciting features for TMA challengers." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Header */}
            <div className="mb-12">
              <Badge variant="secondary" className="mb-6 text-sm font-medium">
                <Clock className="h-4 w-4 mr-2" />
                Coming Soon
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Learning{" "}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Portal
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Our comprehensive student learning platform is under development and will launch soon with exciting features designed specifically for TMA challengers.
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 to-primary/10 mb-12">
              <CardContent className="p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  What to Expect
                </h2>
                <div className="text-left max-w-2xl mx-auto space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Our Learning Portal will provide TMA challengers with a cutting-edge digital learning environment featuring:
                  </p>
                  <ul className="space-y-3 ml-6">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Personalized learning dashboards with progress tracking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Interactive assignments and real-world project challenges</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Direct communication with mentors and fellow students</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Digital certificates and achievement recognition</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Resource library with videos, articles, and study materials</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">
                Ready to Start Your Journey?
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                While our portal is in development, you can still begin your TMA experience by registering as a challenger or exploring our curriculum.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg" asChild>
                  <Link to="/challenger">
                    Join as a Challenger
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg" asChild>
                  <Link to="/curriculum">
                    Explore Curriculum
                  </Link>
                </Button>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-12 pt-8 border-t border-border">
              <Button variant="ghost" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortalPage;