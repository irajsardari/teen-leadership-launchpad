import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowLeft, Users, BookOpen, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const TeacherPortalPage = () => {
  return (
    <>
      <Helmet>
        <title>Teacher Portal - TMA Academy</title>
        <meta name="description" content="TMA Teacher Portal - Coming Soon" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Main Card */}
          <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto">
                <Construction className="h-10 w-10 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-foreground mb-3">
                  Teacher Portal
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  TMA — Teenagers Management Academy<br />
                  Future Ready Leaders
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Status Message */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-amber-800 mb-2">
                  Under Development
                </h3>
                <p className="text-amber-700">
                  Our comprehensive teacher portal is currently being developed. 
                  This section will include course management, student progress tracking, 
                  and teaching resources.
                </p>
              </div>
              
              {/* Coming Features */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground text-center">
                  Coming Soon Features:
                </h4>
                <div className="grid gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground/80">Curriculum Management & Lesson Planning</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground/80">Student Progress Tracking & Analytics</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground/80">Assessment Tools & Certification Management</span>
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 text-center">
                <h4 className="text-lg font-semibold text-foreground mb-3">
                  Interested in Teaching at TMA?
                </h4>
                <p className="text-muted-foreground mb-4">
                  We're actively recruiting qualified educators to join our team. 
                  Get in touch to learn about opportunities and our teacher training program.
                </p>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground" 
                  asChild
                >
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
              
              {/* Back to Main Site */}
              <div className="text-center pt-4 border-t border-border">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Main Site
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TeacherPortalPage;