import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SecurityAudit, InputSecurity } from '@/utils/security';
import { Shield, FileText, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const parentalConsentSchema = z.object({
  // Parent/Guardian Information
  parentFullName: z.string().min(2, "Parent/guardian name must be at least 2 characters"),
  parentEmail: z.string().email("Please enter a valid email address"),
  parentPhone: z.string().min(1, "Phone number is required"),
  relationshipToChild: z.string().min(1, "Please specify relationship to child"),
  
  // Child Information
  childFullName: z.string().min(2, "Child's name must be at least 2 characters"),
  childDateOfBirth: z.string().min(1, "Date of birth is required"),
  childAge: z.number().min(10).max(18, "Child must be between 10-18 years old"),
  
  // Consent Areas
  consentDataCollection: z.boolean().refine(val => val === true, "Consent for data collection is required"),
  consentCommunication: z.boolean().refine(val => val === true, "Consent for communication is required"),
  consentEducationalActivities: z.boolean().refine(val => val === true, "Consent for educational activities is required"),
  consentProgressTracking: z.boolean().refine(val => val === true, "Consent for progress tracking is required"),
  
  // Optional Consents
  consentPhotosVideos: z.boolean(),
  consentMarketing: z.boolean(),
  consentDataSharing: z.boolean(),
  
  // Emergency Contact
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
  emergencyContactRelation: z.string().min(1, "Emergency contact relationship is required"),
  
  // Additional Information
  medicalConditions: z.string().optional(),
  learningNeeds: z.string().optional(),
  additionalNotes: z.string().optional(),
  
  // Legal Confirmations
  confirmIdentity: z.boolean().refine(val => val === true, "Identity confirmation is required"),
  confirmLegalAuthority: z.boolean().refine(val => val === true, "Legal authority confirmation is required"),
  confirmUnderstanding: z.boolean().refine(val => val === true, "Understanding confirmation is required"),
  
  // Digital Signature
  digitalSignature: z.string().min(1, "Digital signature is required"),
  signatureDate: z.string().min(1, "Signature date is required")
});

type ParentalConsentForm = z.infer<typeof parentalConsentSchema>;

interface ParentalConsentFormProps {
  childUserId?: string;
  onSuccess?: (consentId: string) => void;
  onCancel?: () => void;
}

export const ParentalConsentForm: React.FC<ParentalConsentFormProps> = ({
  childUserId,
  onSuccess,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentSubmitted, setConsentSubmitted] = useState(false);
  const [consentId, setConsentId] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<ParentalConsentForm>({
    resolver: zodResolver(parentalConsentSchema),
    defaultValues: {
      signatureDate: new Date().toISOString().split('T')[0],
      consentPhotosVideos: false,
      consentMarketing: false,
      consentDataSharing: false,
    }
  });

  const handleSubmit = async (values: ParentalConsentForm) => {
    setIsSubmitting(true);

    try {
      // Input sanitization
      const sanitizedValues = {
        ...values,
        parentFullName: InputSecurity.sanitizeString(values.parentFullName),
        parentEmail: values.parentEmail.toLowerCase().trim(),
        parentPhone: InputSecurity.sanitizeString(values.parentPhone),
        childFullName: InputSecurity.sanitizeString(values.childFullName),
        emergencyContactName: InputSecurity.sanitizeString(values.emergencyContactName),
        emergencyContactPhone: InputSecurity.sanitizeString(values.emergencyContactPhone),
        medicalConditions: values.medicalConditions ? InputSecurity.sanitizeString(values.medicalConditions) : '',
        learningNeeds: values.learningNeeds ? InputSecurity.sanitizeString(values.learningNeeds) : '',
        additionalNotes: values.additionalNotes ? InputSecurity.sanitizeString(values.additionalNotes) : '',
        digitalSignature: InputSecurity.sanitizeString(values.digitalSignature)
      };

      // Validate email
      if (!InputSecurity.validateEmail(sanitizedValues.parentEmail)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }

      // Calculate age from DOB
      const birthDate = new Date(values.childDateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age !== values.childAge) {
        toast({
          title: "Age Mismatch",
          description: "The calculated age doesn't match the entered age. Please check the date of birth.",
          variant: "destructive",
        });
        return;
      }

      // Prepare consent permissions
      const permissions = [
        { permission_type: 'data_collection', granted: sanitizedValues.consentDataCollection, required: true },
        { permission_type: 'communication', granted: sanitizedValues.consentCommunication, required: true },
        { permission_type: 'educational_activities', granted: sanitizedValues.consentEducationalActivities, required: true },
        { permission_type: 'progress_tracking', granted: sanitizedValues.consentProgressTracking, required: true },
        { permission_type: 'photos_videos', granted: sanitizedValues.consentPhotosVideos, required: false },
        { permission_type: 'marketing', granted: sanitizedValues.consentMarketing, required: false },
        { permission_type: 'data_sharing', granted: sanitizedValues.consentDataSharing, required: false },
      ];

      // Submit parental consent using RPC function
      const { data: consentId, error: consentError } = await supabase.rpc('submit_parental_consent', {
        p_child_user_id: childUserId,
        p_parent_guardian_name: sanitizedValues.parentFullName,
        p_parent_guardian_email: sanitizedValues.parentEmail,
        p_relationship: sanitizedValues.relationshipToChild,
        p_digital_signature: sanitizedValues.digitalSignature,
        p_permissions: permissions
      });

      if (consentError) {
        throw consentError;
      }

      // Send confirmation email
      await supabase.functions.invoke('send-consent-confirmation', {
        body: {
          parentEmail: sanitizedValues.parentEmail,
          parentName: sanitizedValues.parentFullName,
          childName: sanitizedValues.childFullName,
          consentId: consentId
        }
      });

      setConsentSubmitted(true);
      setConsentId(consentId);
      
      toast({
        title: "Parental Consent Recorded",
        description: "Consent has been successfully recorded. A confirmation email has been sent.",
      });

      if (onSuccess) {
        onSuccess(consentId);
      }

    } catch (error: any) {
      console.error('Error submitting parental consent:', error);
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit parental consent. Please try again.",
        variant: "destructive",
      });
      await SecurityAudit.log('parental_consent_failed', 'parental_consent', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (consentSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-green-800">Parental Consent Recorded</h3>
              <p className="text-muted-foreground mt-2">
                Your parental consent has been successfully recorded and stored securely.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Consent Reference ID:</strong> {consentId}
              </p>
              <p className="text-sm text-green-700 mt-1">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              You can request changes or withdraw consent at any time by contacting our support team.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <span>Parental Consent Form</span>
          <Badge variant="outline">Required for Ages 10-17</Badge>
        </CardTitle>
        <Alert>
          <FileText className="w-4 h-4" />
          <AlertDescription>
            This form is required for all students under 18 years old. All information is encrypted and stored securely in compliance with data protection regulations.
          </AlertDescription>
        </Alert>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            
            {/* Parent/Guardian Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <span>Parent/Guardian Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="parentFullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter parent/guardian full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="relationshipToChild"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Child *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mother, Father, Guardian" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="parentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="parent@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="parentPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+968 9123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Child Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Child Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="childFullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child's Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter child's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="childDateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="childAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Age *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={10} 
                          max={18} 
                          placeholder="Age"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Required Consents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <span>Required Permissions</span>
                <Badge variant="destructive">All Required</Badge>
              </h3>
              
              <div className="space-y-3">
                {[
                  { name: 'consentDataCollection', label: 'Data Collection & Storage', desc: 'Collect and securely store educational progress, attendance, and account information' },
                  { name: 'consentCommunication', label: 'Communication', desc: 'Send course updates, progress reports, and important notifications via email' },
                  { name: 'consentEducationalActivities', label: 'Educational Activities', desc: 'Participate in all TMA Academy courses, assessments, and learning activities' },
                  { name: 'consentProgressTracking', label: 'Progress Tracking', desc: 'Monitor and record learning progress, completion rates, and achievements' }
                ].map((consent) => (
                  <FormField
                    key={consent.name}
                    control={form.control}
                    name={consent.name as any}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-lg">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel className="font-medium">{consent.label} *</FormLabel>
                          <p className="text-sm text-muted-foreground">{consent.desc}</p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Optional Consents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <span>Optional Permissions</span>
                <Badge variant="secondary">Optional</Badge>
              </h3>
              
              <div className="space-y-3">
                {[
                  { name: 'consentPhotosVideos', label: 'Photos & Videos', desc: 'Use photos/videos for promotional materials and success stories (with privacy protection)' },
                  { name: 'consentMarketing', label: 'Marketing Communications', desc: 'Receive information about new courses, events, and special offers' },
                  { name: 'consentDataSharing', label: 'Anonymized Data Sharing', desc: 'Share anonymized learning data with educational research partners' }
                ].map((consent) => (
                  <FormField
                    key={consent.name}
                    control={form.control}
                    name={consent.name as any}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-lg">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel className="font-medium">{consent.label}</FormLabel>
                          <p className="text-sm text-muted-foreground">{consent.desc}</p>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="+968 9123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyContactRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Aunt, Family Friend" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information (Optional)</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="medicalConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Conditions or Allergies</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any medical conditions or allergies we should be aware of..."
                          rows={2}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="learningNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Learning Needs</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any learning differences, accommodations needed, or educational support requirements..."
                          rows={2}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any other information you'd like us to know..."
                          rows={2}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Legal Confirmations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal Confirmations</h3>
              
              <div className="space-y-3">
                {[
                  { name: 'confirmIdentity', label: 'Identity Confirmation', desc: 'I confirm that I am the parent/legal guardian of the above-named child' },
                  { name: 'confirmLegalAuthority', label: 'Legal Authority', desc: 'I have the legal authority to provide consent for this child\'s participation' },
                  { name: 'confirmUnderstanding', label: 'Understanding', desc: 'I have read and understand the privacy policy, terms of service, and safeguarding policy' }
                ].map((confirmation) => (
                  <FormField
                    key={confirmation.name}
                    control={form.control}
                    name={confirmation.name as any}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-lg bg-blue-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel className="font-medium">{confirmation.label} *</FormLabel>
                          <p className="text-sm text-muted-foreground">{confirmation.desc}</p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Digital Signature */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Digital Signature</h3>
              
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <AlertDescription>
                  By typing your full name below, you are providing your digital signature and confirming all information provided is accurate and complete.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="digitalSignature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Digital Signature (Type Full Name) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Type your full legal name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="signatureDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Consent...
                  </>
                ) : (
                  'Submit Parental Consent'
                )}
              </Button>
              
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};