
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
  education: z.string().min(1, "Please select your education level"),
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
    if (!user) {
      console.error('User not authenticated for file upload');
      toast({
        title: "Authentication Required",
        description: "Please log in to upload your CV.",
        variant: "destructive",
      });
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('teacher-documents')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading CV:', error);
      toast({
        title: "Upload Error",
        description: `Failed to upload CV: ${error.message}`,
        variant: "destructive",
      });
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
                            <SelectItem value="leadership-development">Leadership Development</SelectItem>
                            <SelectItem value="emotional-intelligence">Emotional Intelligence</SelectItem>
                            <SelectItem value="communication-skills">Communication Skills</SelectItem>
                            <SelectItem value="team-building-conflict-resolution">Team Building & Conflict Resolution</SelectItem>
                            <SelectItem value="coaching-mentoring-youth">Coaching & Mentoring Youth</SelectItem>
                            <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                            <SelectItem value="business-fundamentals">Business Fundamentals</SelectItem>
                            <SelectItem value="time-management-productivity">Time Management & Productivity</SelectItem>
                            <SelectItem value="project-planning-event-management">Project Planning & Event Management</SelectItem>
                            <SelectItem value="strategic-thinking">Strategic Thinking</SelectItem>
                            <SelectItem value="adolescent-psychology">Adolescent Psychology</SelectItem>
                            <SelectItem value="positive-psychology">Positive Psychology</SelectItem>
                            <SelectItem value="behavioral-science">Behavioral Science</SelectItem>
                            <SelectItem value="mental-health-teens">Mental Health in Teens</SelectItem>
                            <SelectItem value="mindfulness-self-awareness">Mindfulness & Self-Awareness</SelectItem>
                            <SelectItem value="sociology-social-responsibility">Sociology & Social Responsibility</SelectItem>
                            <SelectItem value="inclusion-diversity">Inclusion & Diversity</SelectItem>
                            <SelectItem value="global-citizenship">Global Citizenship</SelectItem>
                            <SelectItem value="media-society">Media & Society</SelectItem>
                            <SelectItem value="cultural-studies">Cultural Studies</SelectItem>
                            <SelectItem value="financial-literacy-teens">Financial Literacy for Teens</SelectItem>
                            <SelectItem value="youth-budgeting-saving">Youth Budgeting & Saving</SelectItem>
                            <SelectItem value="investing-basics">Investing Basics</SelectItem>
                            <SelectItem value="microeconomics">Microeconomics</SelectItem>
                            <SelectItem value="business-ethics">Business Ethics</SelectItem>
                            <SelectItem value="digital-literacy">Digital Literacy</SelectItem>
                            <SelectItem value="ai-for-teens">Artificial Intelligence for Teens</SelectItem>
                            <SelectItem value="cybersecurity-basics">Cybersecurity Basics</SelectItem>
                            <SelectItem value="design-thinking">Design Thinking</SelectItem>
                            <SelectItem value="innovation-education">Innovation in Education</SelectItem>
                            <SelectItem value="creative-thinking">Creative Thinking</SelectItem>
                            <SelectItem value="public-speaking">Public Speaking</SelectItem>
                            <SelectItem value="writing-expression">Writing & Expression</SelectItem>
                            <SelectItem value="design-branding">Design & Branding</SelectItem>
                            <SelectItem value="photography-media-creation">Photography / Media Creation</SelectItem>
                            <SelectItem value="career-readiness-cv-writing">Career Readiness & CV Writing</SelectItem>
                            <SelectItem value="sports-fitness">Sports & Fitness</SelectItem>
                            <SelectItem value="nutrition-health">Nutrition & Health</SelectItem>
                            <SelectItem value="self-care-stress-management">Self-Care & Stress Management</SelectItem>
                            <SelectItem value="yoga-breathwork">Yoga & Breathwork</SelectItem>
                            <SelectItem value="academic-tutoring">Academic Tutoring (Math, Science, English)</SelectItem>
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
                        <FormLabel>Education Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your education level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="diploma">Diploma</SelectItem>
                            <SelectItem value="ba">Bachelor's Degree (BA/BS)</SelectItem>
                            <SelectItem value="ma">Master's Degree (MA/MS)</SelectItem>
                            <SelectItem value="phd">Doctorate (PhD)</SelectItem>
                          </SelectContent>
                        </Select>
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
