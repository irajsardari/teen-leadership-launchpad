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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { secureApi, validateInput, ClientRateLimit } from "@/utils/secureApi";

const baseSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  specialization: z.array(z.string()).min(1, "Please select at least one specialization"),
  experienceYears: z.string().min(1, "Please select your experience level"),
  education: z.string().min(1, "Please select your education level"),
  cv: z
    .instanceof(FileList)
    .refine((files) => files?.length > 0, "CV/Resume is required"),
  linkedinPortfolio: z.string().optional(),
});

const landingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  experienceDetails: z.string().min(1, "Please share your teaching experience"),
  qualifications: z.string().optional(),
  areasOfInterest: z.array(z.string()).min(1, "Select at least one area"),
  availability: z.array(z.string()).min(1, "Select your availability"),
  timezone: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required" }),
  }),
  cv: z
    .instanceof(FileList)
    .refine((files) => files?.length > 0, "CV/Resume is required")
    .refine((files) => (files?.[0]?.size ?? 0) <= 10 * 1024 * 1024, "Max file size is 10MB"),
  linkedinPortfolio: z.string().optional(),
  hp: z.string().optional().refine((v) => !v, ""), // honeypot
});

type BaseForm = z.infer<typeof baseSchema>;
type LandingForm = z.infer<typeof landingSchema>;
type TeacherApplicationFormValues = BaseForm | LandingForm;

const specializations = [
  "Leadership Development",
  "Emotional Intelligence", 
  "Communication Skills",
  "Team Building & Conflict Resolution",
  "Coaching & Mentoring Youth",
  "Entrepreneurship",
  "Business Fundamentals",
  "Time Management & Productivity",
  "Project Planning & Event Management",
  "Strategic Thinking",
  "Adolescent Psychology",
  "Positive Psychology",
  "Behavioral Science",
  "Mental Health in Teens",
  "Mindfulness & Self-Awareness",
  "Sociology & Social Responsibility",
  "Inclusion & Diversity",
  "Global Citizenship",
  "Media & Society",
  "Cultural Studies",
  "Financial Literacy for Teens",
  "Youth Budgeting & Saving",
  "Investing Basics",
  "Microeconomics",
  "Business Ethics",
  "Digital Literacy",
  "Artificial Intelligence for Teens",
  "Cybersecurity Basics",
  "Design Thinking",
  "Innovation in Education",
  "Creative Thinking",
  "Public Speaking",
  "Writing & Expression",
  "Design & Branding",
  "Photography / Media Creation",
  "Career Readiness & CV Writing",
  "Sports & Fitness",
  "Nutrition & Health",
  "Self-Care & Stress Management",
  "Yoga & Breathwork",
  "Academic Tutoring (Math, Science, English)",
  "Other"
];

const TeacherApplicationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<BaseForm>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      specialization: [],
      experienceYears: "",
      education: "",
      linkedinPortfolio: ""
    },
  });

  const handleAuthExpiry = async () => {
    const nextUrl = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
    window.location.href = `/portal?reason=expired&next=${nextUrl}`;
  };

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

    try {
      // Use secure file upload API
      const result = await secureApi.uploadFile('secure-teacher-cvs', file.name, file);
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }
      
      return result.data?.path || null;
    } catch (error: any) {
      console.error('Error uploading CV:', error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload CV. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const onSubmit = async (values: BaseForm) => {
    if (!user) {
      toast({ 
        title: "Authentication Required", 
        description: "Please log in before submitting this form.", 
        variant: "destructive" 
      });
      return;
    }

    // Client-side rate limiting
    const rateLimitKey = `teacher_application_${user.id}`;
    if (!ClientRateLimit.check(rateLimitKey, 3, 60 * 60 * 1000)) {
      const remainingTime = ClientRateLimit.getRemainingTime(rateLimitKey);
      toast({
        title: "Rate Limit Exceeded",
        description: `Please wait ${Math.ceil(remainingTime / 60000)} minutes before submitting another application.`,
        variant: "destructive",
      });
      return;
    }

    // Input validation
    if (!validateInput.name(values.fullName)) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid full name (2-100 characters).",
        variant: "destructive",
      });
      return;
    }

    if (!validateInput.email(values.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validateInput.phone(values.phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number (minimum 10 digits).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle CV upload first if provided
      let cvUrl = null;
      if (values.cv && values.cv.length > 0) {
        cvUrl = await uploadCV(values.cv[0]);
        if (!cvUrl) {
          toast({
            title: "Upload Error",
            description: "Failed to upload CV. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      // Prepare sanitized data
      const sanitizedData = {
        full_name: validateInput.sanitizeText(values.fullName),
        email: values.email.toLowerCase().trim(),
        phone_number: validateInput.sanitizeText(values.phoneNumber),
        specialization: Array.isArray(values.specialization) ? values.specialization : [values.specialization],
        education: values.education,
        experience_years: values.experienceYears,
        cv_url: cvUrl,
        cover_letter: values.linkedinPortfolio ? validateInput.sanitizeText(values.linkedinPortfolio) : null,
      };

      // Submit via secure API
      const result = await secureApi.submitForm('teacher', sanitizedData);

      if (!result.success) {
        throw new Error(result.error || 'Application submission failed');
      }

      toast({
        title: "Application Submitted!",
        description: "Thank you for your application. We'll review it and contact you within 7-10 business days.",
      });

      setShowSuccessMessage(true);
      form.reset();

    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Application Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">Thank you for your application!</CardTitle>
              <CardDescription className="text-lg">
                We review each submission carefully and will contact shortlisted instructors within 7–10 business days.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">💬 Need Help?</h3>
                <p className="text-muted-foreground">
                  If you have questions, feel free to reach out at{" "}
                  <a href="mailto:info@teenmanagement.com" className="text-primary hover:underline">
                    info@teenmanagement.com
                  </a>{" "}
                  or via WhatsApp.
                </p>
              </div>
              <div className="flex justify-center items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🧭</span>
                  <span className="text-sm font-medium">Purpose</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🌱</span>
                  <span className="text-sm font-medium">Growth</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">💬</span>
                  <span className="text-sm font-medium">Community</span>
                </div>
              </div>
              <Button onClick={() => setShowSuccessMessage(false)} variant="outline">
                Submit Another Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // PHASE 6: UX Gating - Show authentication gate if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold">Join Our Teaching Team</CardTitle>
              <CardDescription className="text-xl mt-2">
                Inspire the next generation of leaders.
              </CardDescription>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                We're looking for passionate, caring, and qualified individuals who want to help teenagers grow into confident, capable, and conscious leaders.
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTitle className="text-amber-800">🔐 Login Required</AlertTitle>
                <AlertDescription className="text-amber-700">
                  To protect applicant data and ensure secure submissions, please sign in before completing your teacher application.
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Your application contains sensitive personal information including your CV, contact details, and professional background. 
                  We require authentication to keep this data secure.
                </p>
                <Link to={`/portal?next=${encodeURIComponent('/teachers')}`}>
                  <Button size="lg" className="text-lg px-8">
                    Sign In to Apply
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground">
                  Don't have an account? You can create one during the sign-in process.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold">Join Our Teaching Team</CardTitle>
            <CardDescription className="text-xl mt-2">
              Inspire the next generation of leaders.
            </CardDescription>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              We're looking for passionate, caring, and qualified individuals who want to help teenagers grow into confident, capable, and conscious leaders.
              If you're a mentor, coach, teacher, or professional who connects well with youth — this is your opportunity.
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">✏️ Application Form</h3>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>🖋️ Full Name (Required)</FormLabel>
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
                        <FormLabel>📧 Email Address (Required)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email address" {...field} />
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
                        <FormLabel>📞 Phone Number (Required)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. +968 91234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>📅 Years of Experience (Required)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0-1">0–1 years</SelectItem>
                            <SelectItem value="2-4">2–4 years</SelectItem>
                            <SelectItem value="5-7">5–7 years</SelectItem>
                            <SelectItem value="8-10">8–10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>🎓 Education Level (Required)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your education level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                            <SelectItem value="master">Master's Degree</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specialization"
                  render={() => (
                    <FormItem>
                      <FormLabel>🎓 Specialization (Required) - Select your main area(s) of expertise</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-4">
                        {specializations.map((spec) => (
                          <FormField
                            key={spec}
                            control={form.control}
                            name="specialization"
                            render={({ field }) => {
                              return (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(spec)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, spec])
                                          : field.onChange(
                                              field.value?.filter((value) => value !== spec)
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {spec}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cv"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>📄 Upload CV / Resume (Required)</FormLabel>
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
                  name="linkedinPortfolio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>🔗 LinkedIn or Portfolio (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Paste a link (if available)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !user}
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