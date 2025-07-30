import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const teacherApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().optional(),
  specialization: z.string().min(1, "Please select your specialization"),
  experienceYears: z.number().min(0, "Experience years must be 0 or more"),
  education: z.string().min(1, "Please enter your education background"),
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
  cv: z.instanceof(FileList).optional()
});

type TeacherApplicationForm = z.infer<typeof teacherApplicationSchema>;

const TeacherApplicationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<TeacherApplicationForm>({
    resolver: zodResolver(teacherApplicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      specialization: "",
      experienceYears: 0,
      education: "",
      coverLetter: "",
    },
  });

  const uploadCV = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('teacher-documents')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading CV:', error);
      return null;
    }

    return fileName;
  };

  const onSubmit = async (values: TeacherApplicationForm) => {
    try {
      setIsSubmitting(true);

      let cvUrl = null;
      if (values.cv && values.cv.length > 0) {
        cvUrl = await uploadCV(values.cv[0]);
        if (!cvUrl) {
          toast({
            title: "Error",
            description: "Failed to upload CV. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      const { error } = await supabase
        .from('teacher_applications')
        .insert({
          user_id: user?.id,
          full_name: values.fullName,
          email: values.email,
          phone_number: values.phoneNumber,
          specialization: values.specialization,
          experience_years: values.experienceYears,
          education: values.education,
          cv_url: cvUrl,
          cover_letter: values.coverLetter,
        });

      if (error) {
        console.error('Error submitting application:', error);
        toast({
          title: "Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Your teacher application has been submitted successfully.",
      });

      form.reset();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Join Our Teaching Team</CardTitle>
            <CardDescription className="text-lg">
              Apply to become an instructor at Teen Management Academy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
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
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
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
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your specialization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="leadership">Leadership Development</SelectItem>
                            <SelectItem value="communication">Communication Skills</SelectItem>
                            <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                            <SelectItem value="personal-development">Personal Development</SelectItem>
                            <SelectItem value="technology">Technology & Innovation</SelectItem>
                            <SelectItem value="creative-arts">Creative Arts</SelectItem>
                            <SelectItem value="sports-fitness">Sports & Fitness</SelectItem>
                            <SelectItem value="academic-tutoring">Academic Tutoring</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
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
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education Background *</FormLabel>
                        <FormControl>
                          <Input placeholder="Degree, certifications, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="cv"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Upload CV/Resume</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverLetter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Letter *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us why you want to join our teaching team and what makes you a great fit for Teen Management Academy..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherApplicationForm;