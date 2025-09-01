import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Trophy, 
  Star, 
  Users, 
  Calendar,
  ArrowRight,
  User,
  Settings,
  LogOut,
  PlusCircle,
  Target,
  Award,
  TrendingUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PortalPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [challengerData, setChallengerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile error:", profileError);
      } else if (profileData) {
        setProfile(profileData);
      }

      // Fetch challenger application if exists
      const { data: challengerData, error: challengerError } = await supabase
        .from("challengers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (challengerError && challengerError.code !== "PGRST116") {
        console.error("Challenger error:", challengerError);
      } else if (challengerData) {
        setChallengerData(challengerData);
      }

    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "See you soon! 👋"
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF5EF] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C28] mx-auto mb-4"></div>
          <p className="text-[#003A5D] font-medium">Loading your portal...</p>
        </div>
      </div>
    );
  }

  const userName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Challenger";
  const hasApplication = !!challengerData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EF] to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#006D6C]/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-[#F28C28] to-[#FDB940] rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#003A5D]">Welcome, {userName}! 🚀</h1>
                <p className="text-sm text-gray-600">Your leadership journey continues</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-[#003A5D]">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="text-[#003A5D] border-[#003A5D]/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasApplication ? (
          // New User - Application Flow
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-[#006D6C] to-[#F28C28] text-white mb-8">
              <CardContent className="p-8">
                <div className="text-center">
                  <Star className="h-16 w-16 mx-auto mb-4 text-[#FDB940]" />
                  <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey? 🌟</h2>
                  <p className="text-xl mb-6 text-white/90">
                    Complete your application to join the TMA Academy and unlock your leadership potential!
                  </p>
                  <Button 
                    size="lg"
                    className="bg-white text-[#006D6C] hover:bg-white/90 font-bold px-8 py-3"
                    onClick={() => navigate("/apply")}
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Complete Your Application
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Why Join TMA Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: <Target className="h-8 w-8" />,
                  title: "Clear Path to Success",
                  description: "Structured curriculum designed specifically for teenagers"
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Global Community",
                  description: "Connect with like-minded teenagers from around the world"
                },
                {
                  icon: <Trophy className="h-8 w-8" />,
                  title: "Real Achievements",
                  description: "Earn badges, certificates, and recognition for your progress"
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-[#F28C28] mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-[#003A5D] mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Existing User - Dashboard
          <div className="max-w-6xl mx-auto">
            {/* Welcome Back Section */}
            <Card className="bg-gradient-to-r from-[#006D6C] to-[#F28C28] text-white mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back, {challengerData.full_name}! 🎯</h2>
                    <p className="text-white/90">
                      Level: {challengerData.level || "Explorer"} • Age: {challengerData.age}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">65%</div>
                    <div className="text-sm text-white/80">Overall Progress</div>
                  </div>
                </div>
                <Progress value={65} className="mt-4 bg-white/20" />
              </CardContent>
            </Card>

            {/* Dashboard Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Current Progress */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#003A5D]">
                    <TrendingUp className="h-5 w-5" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Communication Skills</span>
                      <div className="flex items-center gap-2">
                        <Progress value={80} className="w-24" />
                        <span className="text-sm font-bold">80%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Leadership Fundamentals</span>
                      <div className="flex items-center gap-2">
                        <Progress value={60} className="w-24" />
                        <span className="text-sm font-bold">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Team Collaboration</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-24" />
                        <span className="text-sm font-bold">45%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#003A5D]">
                    <Award className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-[#F28C28] rounded-full flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">First Steps</div>
                        <div className="text-xs text-gray-600">Completed profile</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 opacity-50">
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Communication Pro</div>
                        <div className="text-xs text-gray-600">Complete communication module</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Continue Learning",
                  description: "Resume your current lesson",
                  icon: <BookOpen className="h-5 w-5" />,
                  color: "bg-[#006D6C]",
                  action: () => navigate("/learning")
                },
                {
                  title: "Join Session", 
                  description: "Live group session at 3 PM",
                  icon: <Calendar className="h-5 w-5" />,
                  color: "bg-[#F28C28]",
                  action: () => toast({ title: "Coming Soon!", description: "Live sessions will be available soon." })
                },
                {
                  title: "Community",
                  description: "Connect with peers",
                  icon: <Users className="h-5 w-5" />,
                  color: "bg-[#003A5D]",
                  action: () => toast({ title: "Coming Soon!", description: "Community features coming soon." })
                },
                {
                  title: "My Profile",
                  description: "Update your information",
                  icon: <User className="h-5 w-5" />,
                  color: "bg-[#FDB940]",
                  action: () => navigate("/profile")
                }
              ].map((action, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={action.action}
                >
                  <CardContent className="p-4">
                    <div className={`${action.color} text-white p-3 rounded-lg mb-3 w-fit`}>
                      {action.icon}
                    </div>
                    <h3 className="font-bold text-[#003A5D] mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PortalPage;