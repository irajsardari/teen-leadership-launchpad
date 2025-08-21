import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, Phone, Mail, Clock } from 'lucide-react';
import { SecurityAudit, InputSecurity } from '@/utils/security';

interface SafeguardingModalProps {
  children: React.ReactNode;
}

export const SafeguardingModal: React.FC<SafeguardingModalProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const reportTypes = [
    { 
      id: 'inappropriate_behavior', 
      label: 'Inappropriate Behavior', 
      severity: 'high',
      description: 'Concerning behavior from staff, teachers, or other students'
    },
    { 
      id: 'safety_concern', 
      label: 'Safety Concern', 
      severity: 'high',
      description: 'Physical or emotional safety issues'
    },
    { 
      id: 'bullying', 
      label: 'Bullying/Harassment', 
      severity: 'medium',
      description: 'Bullying, cyberbullying, or harassment incidents'
    },
    { 
      id: 'content_inappropriate', 
      label: 'Inappropriate Content', 
      severity: 'medium',
      description: 'Inappropriate course content or materials'
    },
    { 
      id: 'technical_safety', 
      label: 'Technical Safety Issue', 
      severity: 'low',
      description: 'Platform security or privacy concerns'
    },
    { 
      id: 'other', 
      label: 'Other Concern', 
      severity: 'medium',
      description: 'Any other safeguarding concern'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportType || !description.trim()) {
      toast({
        title: "Required Information Missing",
        description: "Please select a report type and provide a description.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize inputs
      const sanitizedDescription = InputSecurity.sanitizeString(description);
      const sanitizedContact = InputSecurity.sanitizeString(contactInfo);
      
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create safeguarding report
      const { error } = await supabase
        .from('safeguarding_reports')
        .insert({
          report_type: reportType,
          description: sanitizedDescription,
          contact_info: sanitizedContact || null,
          reporter_id: user?.id || null,
          status: 'submitted',
          urgency: reportTypes.find(t => t.id === reportType)?.severity || 'medium'
        });

      if (error) {
        throw error;
      }

      // Log the report submission
      await SecurityAudit.log('safeguarding_report_submitted', 'safeguarding_report', reportType);

      // Send notification email (via Edge Function)
      await supabase.functions.invoke('send-safeguarding-alert', {
        body: {
          reportType,
          description: sanitizedDescription,
          contactInfo: sanitizedContact,
          reporterId: user?.id,
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: "Report Submitted Successfully",
        description: "Your concern has been reported and will be reviewed within 24 hours. Reference ID provided via email if contact info was shared.",
      });

      // Reset form
      setReportType('');
      setDescription('');
      setContactInfo('');
      setOpen(false);

    } catch (error: any) {
      console.error('Error submitting safeguarding report:', error);
      toast({
        title: "Submission Error",
        description: "There was an issue submitting your report. Please try again or contact us directly.",
        variant: "destructive",
      });
      await SecurityAudit.log('safeguarding_report_failed', 'safeguarding_report', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Report a Safeguarding Concern</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Emergency Notice */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>In case of immediate danger:</strong> Call emergency services (999/911) first, then report here.
            </AlertDescription>
          </Alert>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">24/7 Safeguarding Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4" />
                <span>Emergency Line: +968 9123-4567 (24/7)</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4" />
                <span>safeguarding@teenmanagement.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>Response Time: Within 24 hours</span>
              </div>
            </CardContent>
          </Card>

          {/* Report Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Report Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Type of Concern *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportTypes.map((type) => (
                  <Card 
                    key={type.id}
                    className={`cursor-pointer transition-colors ${
                      reportType === type.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setReportType(type.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <input
                              type="radio"
                              value={type.id}
                              checked={reportType === type.id}
                              onChange={() => setReportType(type.id)}
                              className="w-4 h-4"
                            />
                            <span className="font-medium text-sm">{type.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground ml-6">
                            {type.description}
                          </p>
                        </div>
                        <Badge variant={getSeverityColor(type.severity)} className="text-xs">
                          {type.severity}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description of Concern *
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide as much detail as possible. Include dates, times, people involved, and any relevant context that would help us understand and address your concern."
                rows={6}
                className="resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                Your report is confidential and will only be shared with authorized safeguarding personnel.
              </p>
            </div>

            {/* Optional Contact Info */}
            <div className="space-y-2">
              <label htmlFor="contact" className="text-sm font-medium">
                Contact Information (Optional)
              </label>
              <Input
                id="contact"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Email or phone number if you'd like us to follow up with you"
              />
              <p className="text-xs text-muted-foreground">
                Providing contact info allows us to update you on the investigation and ask follow-up questions if needed.
              </p>
            </div>

            {/* Privacy Notice */}
            <Alert>
              <Shield className="w-4 h-4" />
              <AlertDescription className="text-xs">
                <strong>Privacy & Confidentiality:</strong> Your report is encrypted and only accessible to trained safeguarding officers. 
                We follow strict protocols to protect reporter identity while ensuring appropriate action is taken.
              </AlertDescription>
            </Alert>

            {/* Submit Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !reportType || !description.trim()}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Confidential Report'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};