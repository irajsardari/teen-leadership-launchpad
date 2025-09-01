import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, ArrowLeft, BookOpen, Users, Target } from "lucide-react";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/portal";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }

    if (isSignUp) {
      if (!formData.fullName) {
        toast({
          title: "Missing Information", 
          description: "Please enter your full name.",
          variant: "destructive"
        });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match.",
          variant: "destructive"
        });
        return false;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 6 characters long.",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/portal`,
            data: {
              full_name: formData.fullName
            }
          }
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account Exists",
              description: "This email is already registered. Try signing in instead.",
              variant: "destructive"
            });
            setIsSignUp(false);
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Welcome to TMA! 🎉",
            description: "Account created successfully. Please check your email to verify your account.",
            duration: 5000
          });
          // Don't redirect yet - wait for email verification
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Invalid Credentials",
              description: "Please check your email and password and try again.",
              variant: "destructive"
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Welcome back! 🚀",
            description: "Successfully signed in to your TMA account."
          });
          // Navigation will happen automatically via useEffect when user state updates
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Interactive Learning",
      description: "Engaging curriculum designed for teenagers"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Community",
      description: "Connect with peers and mentors worldwide"
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Goal Achievement",
      description: "Track progress and earn badges as you grow"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#006D6C] via-[#004B5C] to-[#003A5D] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-gradient-to-r from-[#F28C28]/20 to-[#FDB940]/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-gradient-to-r from-[#006D6C]/25 to-[#003A5D]/20 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Features */}
          <div className="text-white space-y-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                Join the <span className="text-[#F28C28]">Future</span>
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Start your leadership journey with the world's first Teen Management Academy
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-[#F28C28] mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                    <p className="text-white/80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Auth Form */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-[#003A5D]">
                {isSignUp ? "Create Your Account" : "Welcome Back"}
              </CardTitle>
              <p className="text-gray-600">
                {isSignUp 
                  ? "Join thousands of teenagers building their future" 
                  : "Sign in to continue your journey"
                }
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required={isSignUp}
                      className="h-12"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                      className="h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required={isSignUp}
                      className="h-12"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#F28C28] hover:bg-[#F28C28]/90 text-white font-bold text-lg"
                >
                  {loading 
                    ? "Please wait..." 
                    : isSignUp 
                      ? "Create Account 🚀" 
                      : "Sign In"
                  }
                </Button>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setFormData({
                        email: "",
                        password: "",
                        confirmPassword: "",
                        fullName: ""
                      });
                    }}
                    className="text-[#006D6C] hover:text-[#006D6C]/80 font-medium"
                  >
                    {isSignUp 
                      ? "Already have an account? Sign In" 
                      : "Need an account? Sign Up"
                    }
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;