import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const challengerSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  age: z.number().min(10, "Age must be at least 10").max(18, "Age must be at most 18"),
  email: z.string().email("Please enter a valid email address"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  level: z.string().min(1, "Please specify your level"),
  confidential_info: z.string().optional()
});

type ChallengerFormData = z.infer<typeof challengerSchema>;

const ChallengerForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChallengerFormData>({
    resolver: zodResolver(challengerSchema),
    defaultValues: {
      full_name: "",
      age: 10,
      email: "",
      phone_number: "",
      level: "",
      confidential_info: ""
    }
  });

  const onSubmit = async (data: ChallengerFormData) => {
    setIsSubmitting(true);
    
    try {
      // Using any to bypass empty types issue until database types are generated
      const { error } = await (supabase as any)
        .from('challengers')
        .insert([data]);

      if (error) {
        throw error;
      }

      toast({
        title: "Registration Successful!",
        description: "You have been registered as a challenger. We'll be in touch soon!",
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
                    <Input placeholder="Level 1 (Explorers), Level 2 (Builders), Level 3 (Innovators), Level 4 (Trailblazers), Elite Summit" {...field} />
                  </FormControl>
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
            
            <Button
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
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