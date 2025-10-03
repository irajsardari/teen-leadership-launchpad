import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";

const TMAPlusPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    
    try {
      // Store in a waitlist table or similar
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, type: 'tma_plus' }]);

      if (error) throw error;

      toast.success("You're on the waitlist! We'll be in touch soon.");
      setEmail("");
    } catch (error: any) {
      console.error('Waitlist error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>TMA Plus - Coming Soon | Teenagers Management Academy</title>
        <meta name="description" content="TMA Plus is expanding leadership education beyond teenagers. Management skills for everyone. Join the waitlist today." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* TMA Brand Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-tma-teal via-tma-blue to-tma-navy">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-[10%] w-96 h-96 bg-gradient-to-r from-tma-orange/20 to-tma-yellow/15 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-gradient-to-r from-tma-teal/25 to-tma-blue/20 rounded-full blur-3xl animate-float-delayed"></div>
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Coming Soon Badge */}
              <div className="mb-8 animate-bounce-gentle">
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-medium border border-white/20">
                  <Sparkles className="h-4 w-4" />
                  Coming Soon
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-white via-tma-cream to-white bg-clip-text text-transparent">
                  TMA Plus
                </span>
              </h1>

              {/* Subtitle */}
              <h2 className="text-2xl md:text-4xl font-bold text-white/95 mb-8">
                Because management is for everyone, not just teenagers.
              </h2>

              {/* Description */}
              <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
                TMA Plus will open new doors of learning for adults worldwide. Stay tuned.
              </p>

              {/* Waitlist Form */}
              <div className="max-w-md mx-auto">
                <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 text-lg bg-white/95 border-white/20 focus:border-tma-orange"
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="bg-tma-orange hover:bg-tma-orange/90 text-white px-8 h-14 text-lg font-bold rounded-xl"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join the Waitlist"
                    )}
                  </Button>
                </form>
                <p className="text-white/70 text-sm mt-4">
                  Be the first to know when TMA Plus launches
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-tma-blue mb-6">
                Expanding the TMA Vision
              </h3>
              <p className="text-xl text-tma-dark-gray/80 leading-relaxed mb-8">
                While TMA has been transforming teenagers into future-ready leaders, 
                we've seen a growing demand for management and leadership education 
                that goes beyond age barriers. TMA Plus is our answer to that call.
              </p>
              <div className="bg-tma-cream/30 rounded-2xl p-8 border-2 border-tma-teal/20">
                <p className="text-lg text-tma-dark-gray italic">
                  "Management skills aren't just for the young or the corporate world. 
                  They're for everyone who wants to lead their life with purpose, 
                  clarity, and impact."
                </p>
                <p className="text-tma-blue font-semibold mt-4">
                  — TMA Academy Team
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TMAPlusPage;
