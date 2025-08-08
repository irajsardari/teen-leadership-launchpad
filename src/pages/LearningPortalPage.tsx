import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, GraduationCap, Users } from "lucide-react";

const LearningPortalPage = () => {
  return (
    <>
      <Helmet>
        <title>Learning Portal | TMA Academy</title>
        <meta name="description" content="Access the TMA Learning Portal: choose Challengers Portal or Teacher Portal." />
        <link rel="canonical" href="/learning-portal" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <header className="border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Learning Portal</h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Choose your portal to continue. You may be asked to sign in.
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Challengers Portal */}
            <Card className="hover:shadow-xl transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <CardTitle>Challengers Portal</CardTitle>
                <CardDescription>
                  Access your learning dashboard, progress, and materials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="lg" className="w-full" asChild>
                  <Link to="/portal/dashboard">Enter Challengers Portal</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Teacher Portal */}
            <Card className="hover:shadow-xl transition-all">
              <CardHeader>
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <CardTitle>Teacher Portal</CardTitle>
                <CardDescription>
                  Manage courses, sessions, students, and resources.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="lg" variant="outline" className="w-full" asChild>
                  <Link to="/portal/teacher">Enter Teacher Portal</Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="mt-12 text-center">
            <Button variant="ghost" asChild>
              <Link to="/" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </section>
        </main>
      </div>
    </>
  );
};

export default LearningPortalPage;
