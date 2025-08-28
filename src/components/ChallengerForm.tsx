import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const challengerSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  age: z.number().min(10, "Age must be at least 10").max(18, "Age must be at most 18"),
  email: z.string().email("Please enter a valid email address"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  level: z.string().min(1, "Please specify your level"),
  preferred_format: z.string().optional(),
  preferred_cohort_time: z.string().optional(),
  confidential_info: z.string().optional(),
  hp: z.string().optional(),
});

type ChallengerFormData = z.infer<typeof challengerSchema>;

const ChallengerForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChallengerFormData>({
    resolver: zodResolver(challengerSchema),
    defaultValues: {
      full_name: "",
      age: 10,
      email: "",
      phone_number: "",
      level: "",
      preferred_format: "",
      preferred_cohort_time: "",
      confidential_info: "",
      hp: "",
    }
  });

  const onSubmit = async (data: ChallengerFormData) => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in before submitting this form.",
        variant: "destructive",
      });
      return;
    }
    
    // Honeypot: if filled, silently abort
    if ((data as any)?.hp) {
      return;
    }
    setIsSubmitting(true);
    
    try {
      // Using any to bypass empty types issue until database types are generated
      const { hp, ...clean } = data as any;
      const { error } = await (supabase as any)
        .from('challengers')
        .insert([{
          user_id: user.id,
          full_name: data.full_name,
          age: data.age,
          email: data.email,
          phone_number: data.phone_number,
          level: data.level,
          confidential_info: data.confidential_info || null,
        }]);

      if (error) {
        throw error;
      }

      // Send email via Resend
      const { error: emailError } = await supabase.functions.invoke('send-application-emails', {
        body: {
          type: 'challenger',
          to: data.email,
          applicantName: data.full_name,
        },
      });

      if (emailError) {
        console.warn('Email sending failed:', emailError);
        // Don't throw error - registration was successful
      }

      toast({
        title: "Registration Successful!",
        description: "Thanks! Your place is being reviewed. We'll share the exact term fee and available cohorts in your confirmation email.",
      });

      form.reset();
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // PHASE 6: UX Gating - Show authentication gate if not logged in
  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Register as a Challenger</CardTitle>
          <CardDescription className="text-center">
            Join TMA and start your leadership journey today
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTitle className="text-amber-800">🔐 Login Required</AlertTitle>
            <AlertDescription className="text-amber-700">
              Please sign in to register as a challenger and protect your personal information.
            </AlertDescription>
          </Alert>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Your registration includes personal details that need to be securely stored and protected.
            </p>
            <Link to={`/portal?next=${encodeURIComponent(window.location.pathname)}`}>
              <Button size="lg" className="text-lg px-8">
                Sign In to Register
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Don't have an account? You can create one during the sign-in process.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Register as a Challenger</CardTitle>
        <CardDescription className="text-center">
          Join TMA and start your leadership journey today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter your age" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Level</FormLabel>
                  <FormControl>
                    <Input placeholder="Level 1 (Explorers), Level 2 (Builders), Level 3 (Innovators), Level 4 (Pathfinders)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="preferred_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Format (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="either">Either</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="preferred_cohort_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Cohort Time (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="weekday">Weekday</SelectItem>
                      <SelectItem value="weekend">Weekend</SelectItem>
                      <SelectItem value="either">Either</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confidential_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confidential Information (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="If you have any special learning or attention-related needs (e.g., ADHD), please let us know here (confidential)"
                      {...field}
                      className="border-amber-200 focus:border-amber-400"
                    />
                  </FormControl>
                  <p className="text-xs text-amber-600 font-medium">
                    🔒 This information is confidential and only accessible to authorized TMA administrators.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Honeypot */}
            <input type="text" aria-hidden className="hidden" tabIndex={-1} {...form.register("hp")} />
            
            <Button
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !user}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register as a Challenger"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChallengerForm;